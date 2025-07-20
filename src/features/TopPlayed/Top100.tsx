import React, { useState, useMemo, useCallback } from 'react';
import { IonChip, IonModal, IonHeader, IonToolbar, IonTitle, IonButton, IonIcon, IonContent, IonList } from '@ionic/react';
import { close, list } from 'ionicons/icons';
import { useTopPlayed } from '../../hooks';
import { useAppSelector } from '../../redux';
import { selectTopPlayed, selectSongsArray } from '../../redux';
import { InfiniteScrollList, SongItem, ListItem } from '../../components/common';
import { filterSongs } from '../../utils/dataProcessing';
import { debugLog } from '../../utils/logger';
import { useSongOperations } from '../../hooks';
import { useToast } from '../../hooks';
import type { TopPlayed, Song } from '../../types';

const Top100: React.FC = () => {
  debugLog('Top100 component - RENDERING START');

  const {
    topPlayedItems,
    loadMore,
    hasMore,
    isLoading,
  } = useTopPlayed();

  const topPlayed = useAppSelector(selectTopPlayed);
  const topPlayedCount = Object.keys(topPlayed).length;
  const allSongs = useAppSelector(selectSongsArray);
  const { addToQueue } = useSongOperations();
  const { showSuccess, showError } = useToast();
  const [selectedTopPlayed, setSelectedTopPlayed] = useState<TopPlayed | null>(null);

  debugLog('Top100 component - Redux data:', { topPlayedCount, topPlayedItems: topPlayedItems.length });

  const handleTopPlayedClick = useCallback((item: TopPlayed) => {
    setSelectedTopPlayed(item);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedTopPlayed(null);
  }, []);

  // Find songs that match the selected top played item
  const selectedSongs = useMemo(() => {
    if (!selectedTopPlayed) return [];
    
    // Use the shared search function with title and artist
    const searchTerm = `${selectedTopPlayed.title} ${selectedTopPlayed.artist}`;
    
    debugLog('Top100 - Search details:', {
      selectedTopPlayed,
      searchTerm,
      allSongsCount: allSongs.length
    });
    
    const filteredSongs = filterSongs(allSongs, searchTerm);
    
    debugLog('Top100 - Search results:', {
      filteredSongsCount: filteredSongs.length,
      firstFewResults: filteredSongs.slice(0, 3).map(s => `${s.artist} - ${s.title}`)
    });
    
    return filteredSongs;
  }, [selectedTopPlayed, allSongs]);

  const handleAddToQueue = useCallback(async (song: Song) => {
    try {
      await addToQueue(song);
      showSuccess('Song added to queue');
    } catch {
      showError('Failed to add song to queue');
    }
  }, [addToQueue, showSuccess, showError]);



  // Use real Firebase data from the hook
  const displayItems = topPlayedItems;
  const displayCount = topPlayedItems.length;
  const displayHasMore = hasMore;

  debugLog('Top100 component - Real Firebase data:', { 
    displayItems: displayItems.length, 
    displayCount, 
    displayHasMore,
    firstItem: displayItems[0],
    totalTopPlayedCount: topPlayedCount,
    hasMore,
    isLoading
  });

  debugLog('Top100 component - About to render JSX');

  return (
    <>
      <InfiniteScrollList<TopPlayed>
        items={displayItems}
        isLoading={isLoading}
        hasMore={displayHasMore}
        onLoadMore={loadMore}
        renderItem={(item, index) => (
          <ListItem
            primaryText={item.title}
            secondaryText={item.artist}
            showNumber={true}
            number={index + 1}
            onClick={() => handleTopPlayedClick(item)}
            endContent={
              <>
                <IonChip color="primary">
                  {item.count} plays
                </IonChip>
                <IonIcon icon={list} color="primary" />
              </>
            }
          />
        )}
        emptyTitle="No top played songs"
        emptyMessage="Play some songs to see the top played list"
      />

      {/* Top Played Songs Modal */}
      <IonModal 
        isOpen={!!selectedTopPlayed} 
        onDidDismiss={handleCloseModal}
        breakpoints={[0, 0.5, 0.8]}
        initialBreakpoint={0.8}
      >
        <IonHeader>
          <IonToolbar>
            <IonTitle>{selectedTopPlayed?.artist}</IonTitle>
            <IonButton slot="end" fill="clear" onClick={handleCloseModal}>
              <IonIcon icon={close} />
            </IonButton>
          </IonToolbar>
        </IonHeader>
        
        <IonContent>
          <IonList>
            {selectedSongs.map((song) => (
              <SongItem
                key={song.key || `${song.title}-${song.artist}`}
                song={song}
                context="search"
                onAddToQueue={() => handleAddToQueue(song)}
                onSelectSinger={() => {}} // Info button functionality
                showAddButton={true}
                showInfoButton={true}
                showFavoriteButton={false}
              />
            ))}
          </IonList>
        </IonContent>
      </IonModal>
    </>
  );
};

export default Top100; 