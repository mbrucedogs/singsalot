import { useEffect, useRef } from 'react';
import { useAppSelector } from '../redux';
import { selectQueue, selectControllerName } from '../redux';
import { historyService } from '../firebase/services';
import { debugLog } from '../utils/logger';
import type { QueueItem } from '../types';

export const useQueueHistoryTracking = () => {
  const queue = useAppSelector(selectQueue);
  const controllerName = useAppSelector(selectControllerName);
  const previousQueueRef = useRef<Record<string, QueueItem>>({});

  useEffect(() => {
    if (!controllerName) return;

    const previousQueue = previousQueueRef.current;
    const currentQueue = queue;

    // Find songs that were removed from the queue
    const removedSongs: QueueItem[] = [];
    
    Object.entries(previousQueue).forEach(([key, queueItem]) => {
      if (!currentQueue[key]) {
        // This song was removed from the queue
        removedSongs.push(queueItem);
      }
    });

    // Add removed songs to history (they were likely played)
    removedSongs.forEach(async (queueItem) => {
      if (queueItem.song) {
        console.log('useQueueHistoryTracking - checking song:', {
          title: queueItem.song.title,
          didAddHistory: queueItem.didAddHistory
        });
        
        // Only add to history if it hasn't been added already while in the queue
        if (!queueItem.didAddHistory) {
          try {
            console.log('useQueueHistoryTracking - adding to history:', queueItem.song.title);
            await historyService.addToHistory(controllerName, queueItem.song);
            debugLog('Added song to history after queue removal:', {
              title: queueItem.song.title,
              artist: queueItem.song.artist,
              singer: queueItem.singer.name
            });
          } catch (error) {
            console.error('Failed to add song to history after queue removal:', error);
          }
        } else {
          debugLog('Song already added to history while in queue, skipping:', {
            title: queueItem.song.title,
            artist: queueItem.song.artist
          });
        }
      }
    });

    // Update the previous queue reference
    previousQueueRef.current = currentQueue;
  }, [queue, controllerName]);
}; 