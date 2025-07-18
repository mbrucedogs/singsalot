import { debugLog } from './logger';
import type { Song, QueueItem, TopPlayed } from '../types';

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

// Filter songs by search term with intelligent multi-word handling
export const filterSongs = (songs: Song[], searchTerm: string, disabledSongPaths?: Set<string>): Song[] => {
  let filteredSongs = songs;
  
  // First filter out disabled songs if disabledSongPaths is provided
  if (disabledSongPaths) {
    filteredSongs = filterDisabledSongs(songs, disabledSongPaths);
  }
  
  if (!searchTerm.trim()) return filteredSongs;
  
  const terms = searchTerm.toLowerCase().split(/\s+/).filter(term => term.length > 0);
  
  if (terms.length === 0) return filteredSongs;
  
  return filteredSongs.filter(song => {
    const songTitle = song.title.toLowerCase();
    const songArtist = song.artist.toLowerCase();
    
    // If only one term, use OR logic (title OR artist)
    if (terms.length === 1) {
      return songTitle.includes(terms[0]) || songArtist.includes(terms[0]);
    }
    
    // If multiple terms, use AND logic (all terms must match somewhere)
    return terms.every(term => 
      songTitle.includes(term) || songArtist.includes(term)
    );
  });
};

// Sort queue items by order
export const sortQueueByOrder = (queueItems: QueueItem[]): QueueItem[] => {
  return [...queueItems].sort((a, b) => a.order - b.order);
};

// Sort history by date (most recent first)
export const sortHistoryByDate = (songs: Song[]): Song[] => {
  return [...songs].sort((a, b) => {
    if (!a.date || !b.date) return 0;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
};

// Sort top played by count (highest first)
export const sortTopPlayedByCount = (songs: TopPlayed[]): TopPlayed[] => {
  return [...songs].sort((a, b) => b.count - a.count);
};

// Sort songs by artist then title (case insensitive)
export const sortSongsByArtistAndTitle = (songs: Song[]): Song[] => {
  const sortedSongs = [...songs].sort((a, b) => {
    // First sort by artist (case insensitive)
    const artistA = a.artist.toLowerCase();
    const artistB = b.artist.toLowerCase();
    
    if (artistA !== artistB) {
      return artistA.localeCompare(artistB);
    }
    
    // If artists are the same, sort by title (case insensitive)
    const titleA = a.title.toLowerCase();
    const titleB = b.title.toLowerCase();
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
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
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