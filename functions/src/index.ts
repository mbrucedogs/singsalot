import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin
admin.initializeApp();

// Database reference
const db = admin.database();

// Types for our data structures
interface HistorySong {
  artist: string;
  title: string;
  path: string;
  count?: number;
  disabled?: boolean;
  favorite?: boolean;
  date?: string;
  key?: string;
}

interface TopPlayed {
  artist: string;
  title: string;
  count: number;
  key?: string;
}

interface HistoryAggregation {
  [key: string]: {
    artist: string;
    title: string;
    count: number;
  };
}

/**
 * Cloud Function that triggers when a song is added to history
 * This function aggregates all history items to create/update the topPlayed collection
 * based on unique combinations of artist and title (not path)
 */
export const updateTopPlayedOnHistoryChange = functions.database
  .ref('/controllers/{controllerName}/history/{historyId}')
  .onCreate(async (snapshot, context) => {
    const { controllerName } = context.params;
    
    console.log(`TopPlayed update triggered for controller: ${controllerName}`);
    
    try {
      // Get the controller reference
      const controllerRef = db.ref(`/controllers/${controllerName}`);
      
      // Get all history items for this controller
      const historySnapshot = await controllerRef.child('history').once('value');
      const historyData = historySnapshot.val();
      
      if (!historyData) {
        console.log('No history data found, skipping TopPlayed update');
        return;
      }
      
      // Aggregate history items by artist + title combination
      const aggregation: HistoryAggregation = {};
      
      Object.values(historyData).forEach((song: unknown) => {
        const historySong = song as HistorySong;
        if (historySong && historySong.artist && historySong.title) {
          // Create a unique key based on artist and title (case-insensitive)
          // Replace invalid Firebase key characters with underscores
          const sanitizedArtist = historySong.artist.toLowerCase().trim().replace(/[.#$/[\]]/g, '_');
          const sanitizedTitle = historySong.title.toLowerCase().trim().replace(/[.#$/[\]]/g, '_');
          const key = `${sanitizedArtist}_${sanitizedTitle}`;
          
          if (aggregation[key]) {
            // Increment count for existing song
            aggregation[key].count += historySong.count || 1;
          } else {
            // Create new entry
            aggregation[key] = {
              artist: historySong.artist,
              title: historySong.title,
              count: historySong.count || 1
            };
          }
        }
      });
      
      // Convert aggregation to array, sort by count (descending), and take top 100
      const sortedSongs = Object.entries(aggregation)
        .map(([key, songData]) => ({
          key,
          artist: songData.artist,
          title: songData.title,
          count: songData.count
        }))
        .sort((a, b) => b.count - a.count) // Sort by count descending
        .slice(0, 100); // Take only top 100
      
      // Convert back to object format for Firebase
      const topPlayedData: { [key: string]: TopPlayed } = {};
      
      sortedSongs.forEach((song) => {
        topPlayedData[song.key] = {
          artist: song.artist,
          title: song.title,
          count: song.count
        };
      });
      
      // Update the topPlayed collection
      await controllerRef.child('topPlayed').set(topPlayedData);
      
      console.log(`Successfully updated TopPlayed for controller ${controllerName} with ${Object.keys(topPlayedData).length} unique songs`);
      
    } catch (error) {
      console.error('Error updating TopPlayed:', error);
      throw error;
    }
  });

/**
 * Alternative function that can be called manually to recalculate TopPlayed
 * This is useful for initial setup or data migration
 */
export const recalculateTopPlayed = functions.https.onCall(async (data, context) => {
  const { controllerName } = data;
  
  if (!controllerName) {
    throw new functions.https.HttpsError('invalid-argument', 'controllerName is required');
  }
  
  console.log(`Manual TopPlayed recalculation requested for controller: ${controllerName}`);
  
  try {
    // Get the controller reference
    const controllerRef = db.ref(`/controllers/${controllerName}`);
    
    // Get all history items for this controller
    const historySnapshot = await controllerRef.child('history').once('value');
    const historyData = historySnapshot.val();
    
    if (!historyData) {
      console.log('No history data found, returning empty TopPlayed');
      await controllerRef.child('topPlayed').set({});
      return { success: true, message: 'No history data found, TopPlayed cleared' };
    }
    
    // Aggregate history items by artist + title combination
    const aggregation: HistoryAggregation = {};
    
    Object.values(historyData).forEach((song: unknown) => {
      const historySong = song as HistorySong;
              if (historySong && historySong.artist && historySong.title) {
          // Create a unique key based on artist and title (case-insensitive)
          // Replace invalid Firebase key characters with underscores
          const sanitizedArtist = historySong.artist.toLowerCase().trim().replace(/[.#$/[\]]/g, '_');
          const sanitizedTitle = historySong.title.toLowerCase().trim().replace(/[.#$/[\]]/g, '_');
          const key = `${sanitizedArtist}_${sanitizedTitle}`;
        
        if (aggregation[key]) {
          // Increment count for existing song
          aggregation[key].count += historySong.count || 1;
        } else {
          // Create new entry
          aggregation[key] = {
            artist: historySong.artist,
            title: historySong.title,
            count: historySong.count || 1
          };
        }
      }
    });
    
    // Convert aggregation to array, sort by count (descending), and take top 100
    const sortedSongs = Object.entries(aggregation)
      .map(([key, songData]) => ({
        key,
        artist: songData.artist,
        title: songData.title,
        count: songData.count
      }))
      .sort((a, b) => b.count - a.count) // Sort by count descending
      .slice(0, 100); // Take only top 100
    
    // Convert back to object format for Firebase
    const topPlayedData: { [key: string]: TopPlayed } = {};
    
    sortedSongs.forEach((song) => {
      topPlayedData[song.key] = {
        artist: song.artist,
        title: song.title,
        count: song.count
      };
    });
    
    // Update the topPlayed collection
    await controllerRef.child('topPlayed').set(topPlayedData);
    
    console.log(`Successfully recalculated TopPlayed for controller ${controllerName} with ${Object.keys(topPlayedData).length} unique songs`);
    
    return { 
      success: true, 
      message: `TopPlayed recalculated successfully`,
      songCount: Object.keys(topPlayedData).length
    };
    
  } catch (error) {
    console.error('Error recalculating TopPlayed:', error);
    throw new functions.https.HttpsError('internal', 'Failed to recalculate TopPlayed');
  }
}); 