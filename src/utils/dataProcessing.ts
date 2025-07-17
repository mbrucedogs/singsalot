import type { Song, QueueItem, TopPlayed } from '../types';

// Convert Firebase object to array with keys
export const objectToArray = <T extends { key?: string }>(
  obj: Record<string, T>
): T[] => {
  return Object.entries(obj).map(([key, item]) => ({
    ...item,
    key,
  }));
};

// Filter songs by search term
export const filterSongs = (songs: Song[], searchTerm: string): Song[] => {
  if (!searchTerm.trim()) return songs;
  
  const term = searchTerm.toLowerCase();
  return songs.filter(song =>
    song.title.toLowerCase().includes(term) ||
    song.artist.toLowerCase().includes(term)
  );
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