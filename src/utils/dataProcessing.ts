import { debugLog } from './logger';
import type { Song, QueueItem, TopPlayed } from '../types';
import Fuse from 'fuse.js';

// Convert Firebase object to array with keys
export const objectToArray = <T extends { key?: string }>(
  obj: Record<string, T>
): T[] => {
  if (Object.keys(obj).length === 0) return [];
  
  return Object.entries(obj).map(([key, item]) => ({
    ...item,
    key,
  }));
};

// Filter out disabled songs from an array
export const filterDisabledSongs = (songs: Song[], disabledSongPaths: Set<string>): Song[] => {
  return songs.filter(song => !disabledSongPaths.has(song.path));
};

// Filter songs by search term with FUZZY MATCHING using Fuse.js (90% threshold)
// TODO: REVERT - This is the new fuzzy matching implementation. To revert, replace with the old filterSongs function below
export const filterSongs = (songs: Song[], searchTerm: string, disabledSongPaths?: Set<string>): Song[] => {
  debugLog('🚀 FILTER SONGS CALLED with:', { searchTerm, songsCount: songs.length });
  
  let filteredSongs = songs;
  
  // First filter out disabled songs if disabledSongPaths is provided
  if (disabledSongPaths) {
    filteredSongs = filterDisabledSongs(songs, disabledSongPaths);
  }
  
  if (!searchTerm.trim()) {
    debugLog('📝 No search term, returning all songs');
    return filteredSongs;
  }
  
  // Configure Fuse.js for fuzzy matching with 90% threshold
  // Note: Fuse.js threshold is 0.0 (exact) to 1.0 (very loose), so 0.1 = 90% similarity
  const fuseOptions = {
    keys: ['title', 'artist'],
    threshold: 0.2, // 80% similarity threshold (more reasonable)
    includeScore: true,
    includeMatches: false,
    minMatchCharLength: 2, // Allow shorter matches
    shouldSort: true,
    findAllMatches: true,
    location: 0,
    distance: 100, // More reasonable distance
    useExtendedSearch: false,
    ignoreLocation: true, // Allow words anywhere in the text
    ignoreFieldNorm: false,
  };
  
  // Split search term into individual words for better matching
  const searchWords = searchTerm.toLowerCase().split(/\s+/).filter(word => word.length >= 2);
  
  debugLog('🔍 FUZZY SEARCH DEBUG:', {
    originalSearchTerm: searchTerm,
    searchWords: searchWords,
    totalSongsToSearch: filteredSongs.length,
    firstFewSongs: filteredSongs.slice(0, 3).map(s => `${s.artist} - ${s.title}`)
  });
  
  if (searchWords.length === 0) {
    debugLog('❌ No search words found, returning all songs');
    return filteredSongs;
  }
  
  // Search for each word individually and find songs that contain ALL words
  const songsWithAllWords = new Map<Song, number[]>(); // Song -> array of scores for each word
  
  searchWords.forEach((word, wordIndex) => {
    debugLog(`\n🔤 Searching for word ${wordIndex + 1}: "${word}"`);
    
    const fuse = new Fuse(filteredSongs, fuseOptions);
    const wordResults = fuse.search(word);
    
    debugLog(`   Found ${wordResults.length} matches for "${word}":`);
    
    if (wordResults.length === 0) {
      debugLog(`   ❌ No matches found for "${word}"`);
    } else {
      wordResults.slice(0, 5).forEach((result, resultIndex) => {
        const song = result.item;
        const score = result.score || 1;
        const similarity = Math.round((1 - score) * 100);
        
        debugLog(`   ${resultIndex + 1}. "${song.artist} - ${song.title}" (Score: ${score.toFixed(3)}, ${similarity}% match)`);
      });
      
      if (wordResults.length > 5) {
        debugLog(`   ... and ${wordResults.length - 5} more results`);
      }
    }
    
    // Add songs that match this word to our tracking map
    wordResults.forEach(result => {
      const song = result.item;
      const score = result.score || 1;
      
      if (!songsWithAllWords.has(song)) {
        songsWithAllWords.set(song, new Array(searchWords.length).fill(1)); // Initialize with worst scores
      }
      
      // Store the score for this word
      songsWithAllWords.get(song)![wordIndex] = score;
    });
  });
  
  // Only keep songs that have ALL words (no missing words)
  const allResults = new Map<Song, number>(); // Song -> best score
  
  songsWithAllWords.forEach((scores, song) => {
    // Check if this song has all words (no missing words with score 1)
    const hasAllWords = scores.every(score => score < 1);
    
    if (hasAllWords) {
      // Use the best (lowest) score for ranking
      const bestScore = Math.min(...scores);
      allResults.set(song, bestScore);
    }
  });
  
  // Convert back to array and sort by score
  const fuzzyFilteredSongs = Array.from(allResults.entries())
    .sort(([, scoreA], [, scoreB]) => scoreA - scoreB)
    .map(([song]) => song);
  
  debugLog('\n🎯 FINAL COMBINED RESULTS:');
  debugLog(`   Total unique songs found: ${fuzzyFilteredSongs.length}`);
  debugLog('   Top 10 results:');
  
  fuzzyFilteredSongs.slice(0, 10).forEach((song, index) => {
    const score = allResults.get(song) || 1;
    const similarity = Math.round((1 - score) * 100);
    debugLog(`   ${index + 1}. "${song.artist} - ${song.title}" (Best score: ${score.toFixed(3)}, ${similarity}% match)`);
  });
  
  if (fuzzyFilteredSongs.length > 10) {
    debugLog(`   ... and ${fuzzyFilteredSongs.length - 10} more results`);
  }
  
  debugLog('Fuzzy search results:', {
    searchTerm,
    searchWords,
    totalSongs: filteredSongs.length,
    fuzzyResults: fuzzyFilteredSongs.length,
    firstFewResults: fuzzyFilteredSongs.slice(0, 3).map(s => `${s.artist} - ${s.title}`)
  });
  
  return fuzzyFilteredSongs;
};

// OLD IMPLEMENTATION (for easy revert):
// export const filterSongs = (songs: Song[], searchTerm: string, disabledSongPaths?: Set<string>): Song[] => {
//   let filteredSongs = songs;
//   
//   // First filter out disabled songs if disabledSongPaths is provided
//   if (disabledSongPaths) {
//     filteredSongs = filterDisabledSongs(songs, disabledSongPaths);
//   }
//   
//   if (!searchTerm.trim()) return filteredSongs;
//   
//   const terms = (searchTerm || '').toLowerCase().split(/\s+/).filter(term => term.length > 0);
//   
//   if (terms.length === 0) return filteredSongs;
//   
//   return filteredSongs.filter(song => {
//     const songTitle = (song.title || '').toLowerCase();
//     const songArtist = (song.artist || '').toLowerCase();
//     
//     // If only one term, use OR logic (title OR artist)
//     if (terms.length === 1) {
//       return songTitle.includes(terms[0]) || songArtist.includes(terms[0]);
//     }
//     
//     // If multiple terms, use AND logic (all terms must match somewhere)
//     return terms.every(term => 
//       songTitle.includes(term) || songArtist.includes(term)
//     );
//   });
// };

// Filter artists by search term with FUZZY MATCHING using Fuse.js
export const filterArtists = (artists: string[], searchTerm: string): string[] => {
  debugLog('🎤 ARTIST SEARCH CALLED with:', { searchTerm, artistsCount: artists.length });
  
  if (!searchTerm.trim()) {
    debugLog('📝 No search term, returning all artists');
    return artists;
  }
  
  // Configure Fuse.js for fuzzy matching artists
  const fuseOptions = {
    threshold: 0.2, // 80% similarity threshold
    includeScore: true,
    includeMatches: false,
    minMatchCharLength: 2,
    shouldSort: true,
    findAllMatches: true,
    location: 0,
    distance: 100,
    useExtendedSearch: false,
    ignoreLocation: true,
    ignoreFieldNorm: false,
  };
  
  // Split search term into individual words
  const searchWords = searchTerm.toLowerCase().split(/\s+/).filter(word => word.length >= 2);
  
  debugLog('🔍 ARTIST FUZZY SEARCH DEBUG:', {
    originalSearchTerm: searchTerm,
    searchWords: searchWords,
    totalArtistsToSearch: artists.length,
    firstFewArtists: artists.slice(0, 3)
  });
  
  if (searchWords.length === 0) {
    debugLog('❌ No search words found, returning all artists');
    return artists;
  }
  
  // Search for each word individually and find artists that contain ALL words
  const artistsWithAllWords = new Map<string, number[]>(); // Artist -> array of scores for each word
  
  searchWords.forEach((word, wordIndex) => {
    debugLog(`\n🔤 Searching for artist word ${wordIndex + 1}: "${word}"`);
    
    const fuse = new Fuse(artists, fuseOptions);
    const wordResults = fuse.search(word);
    
    debugLog(`   Found ${wordResults.length} artist matches for "${word}":`);
    
    if (wordResults.length === 0) {
      debugLog(`   ❌ No artist matches found for "${word}"`);
    } else {
      wordResults.slice(0, 5).forEach((result, resultIndex) => {
        const artist = result.item;
        const score = result.score || 1;
        const similarity = Math.round((1 - score) * 100);
        
        debugLog(`   ${resultIndex + 1}. "${artist}" (Score: ${score.toFixed(3)}, ${similarity}% match)`);
      });
      
      if (wordResults.length > 5) {
        debugLog(`   ... and ${wordResults.length - 5} more results`);
      }
    }
    
    // Add artists that match this word to our tracking map
    wordResults.forEach(result => {
      const artist = result.item;
      const score = result.score || 1;
      
      if (!artistsWithAllWords.has(artist)) {
        artistsWithAllWords.set(artist, new Array(searchWords.length).fill(1)); // Initialize with worst scores
      }
      
      // Store the score for this word
      artistsWithAllWords.get(artist)![wordIndex] = score;
    });
  });
  
  // Only keep artists that have ALL words (no missing words)
  const allResults = new Map<string, number>(); // Artist -> best score
  
  artistsWithAllWords.forEach((scores, artist) => {
    // Check if this artist has all words (no missing words with score 1)
    const hasAllWords = scores.every(score => score < 1);
    
    if (hasAllWords) {
      // Use the best (lowest) score for ranking
      const bestScore = Math.min(...scores);
      allResults.set(artist, bestScore);
    }
  });
  
  // Convert back to array and sort by score
  const fuzzyFilteredArtists = Array.from(allResults.entries())
    .sort(([, scoreA], [, scoreB]) => scoreA - scoreB)
    .map(([artist]) => artist);
  
  debugLog('\n🎯 ARTIST FINAL COMBINED RESULTS:');
  debugLog(`   Total unique artists found: ${fuzzyFilteredArtists.length}`);
  debugLog('   Top 10 results:');
  
  fuzzyFilteredArtists.slice(0, 10).forEach((artist, index) => {
    const score = allResults.get(artist) || 1;
    const similarity = Math.round((1 - score) * 100);
    debugLog(`   ${index + 1}. "${artist}" (Best score: ${score.toFixed(3)}, ${similarity}% match)`);
  });
  
  if (fuzzyFilteredArtists.length > 10) {
    debugLog(`   ... and ${fuzzyFilteredArtists.length - 10} more results`);
  }
  
  return fuzzyFilteredArtists;
};

// Sort queue items by order
export const sortQueueByOrder = (queueItems: QueueItem[]): QueueItem[] => {
  return [...queueItems].sort((a, b) => a.order - b.order);
};

// Sort history by date (most recent first)
export const sortHistoryByDate = (songs: Song[]): Song[] => {
  return [...songs].sort((a, b) => {
    // History items use 'lastPlayed' field (numeric timestamp)
    const lastPlayedA = (a as any).lastPlayed;
    const lastPlayedB = (b as any).lastPlayed;
    
    if (!lastPlayedA || !lastPlayedB) return 0;
    return lastPlayedB - lastPlayedA; // Sort by timestamp (newest first)
  });
};

// Sort top played by count (highest first)
export const sortTopPlayedByCount = (songs: TopPlayed[]): TopPlayed[] => {
  return [...songs].sort((a, b) => b.count - a.count);
};

// Sort songs by artist then title (case insensitive)
export const sortSongsByArtistAndTitle = (songs: Song[]): Song[] => {
  const sortedSongs = [...songs].sort((a, b) => {
    // Defensive: treat missing artist/title as empty string
    const artistA = (a.artist || '').toLowerCase();
    const artistB = (b.artist || '').toLowerCase();
    
    if (artistA !== artistB) {
      return artistA.localeCompare(artistB);
    }
    
    const titleA = (a.title || '').toLowerCase();
    const titleB = (b.title || '').toLowerCase();
    return titleA.localeCompare(titleB);
  });

  // Debug logging for first few songs to verify sorting
  if (sortedSongs.length > 0) {
    debugLog('Songs sorted by artist and title. First 5 songs:', 
      sortedSongs.slice(0, 5).map(s => `${s.artist} - ${s.title}`)
    );
  }

  return sortedSongs;
};

// Limit array to specified length
export const limitArray = <T>(array: T[], limit: number): T[] => {
  return array.slice(0, limit);
};

// Format date for display
export const formatDate = (dateInput: string | number): string => {
  // Handle both string dates and numeric timestamps
  const date = typeof dateInput === 'number' ? new Date(dateInput) : new Date(dateInput);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString();
};

// Get queue statistics
export const getQueueStats = (queue: Record<string, QueueItem>) => {
  const queueArray = objectToArray(queue);
  return {
    totalSongs: queueArray.length,
    singers: [...new Set(queueArray.map(item => item.singer.name))],
    estimatedDuration: queueArray.length * 3, // Rough estimate: 3 minutes per song
  };
}; 

// Get songs by artist and title combination
export const getSongsByArtistTitle = (songs: Song[], artist: string, title: string): Song[] => {
  const artistLower = (artist || '').toLowerCase();
  const titleLower = (title || '').toLowerCase();
  
  return songs.filter(song => 
    (song.artist || '').toLowerCase() === artistLower &&
    (song.title || '').toLowerCase() === titleLower
  );
};

// Get song count by artist and title combination
export const getSongCountByArtistTitle = (songs: Song[], artist: string, title: string): number => {
  return getSongsByArtistTitle(songs, artist, title).length;
};

// Create a map of song counts by artist and title for performance
export const createSongCountMapByArtistTitle = (songs: Song[]): Map<string, number> => {
  const countsMap = new Map<string, number>();
  
  songs.forEach(song => {
    const artist = (song.artist || '').toLowerCase();
    const title = (song.title || '').toLowerCase();
    const key = `${artist}|${title}`;
    
    countsMap.set(key, (countsMap.get(key) || 0) + 1);
  });
  
  return countsMap;
};

// Get song count using a pre-computed map
export const getSongCountFromMap = (countsMap: Map<string, number>, artist: string, title: string): number => {
  const key = `${(artist || '').toLowerCase()}|${(title || '').toLowerCase()}`;
  return countsMap.get(key) || 0;
}; 