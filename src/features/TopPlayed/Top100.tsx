import React, { useState, useMemo, useCallback } from 'react';
import { IonChip, IonModal, IonIcon, IonContent, IonList, IonItem } from '@ionic/react';
import { list, star, layers } from 'ionicons/icons';
import { useTopPlayed } from '../../hooks';
import { useAppSelector } from '../../redux';
import { selectTopPlayed, selectSongsArray } from '../../redux';
import { InfiniteScrollList, SongItem, ListItem, ModalHeader } from '../../components/common';
import { filterSongs } from '../../utils/dataProcessing';
import { debugLog } from '../../utils/logger';


import type { TopPlayed } from '../../types';
import { SongItemContext } from '../../types';

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

  // Separate the most played song from other variations
  const mostPlayedSong = selectedSongs.find(song => song.path === selectedTopPlayed?.path);
  const otherVariations = selectedSongs.filter(song => song.path !== selectedTopPlayed?.path);


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
      >
        <ModalHeader title={selectedTopPlayed?.artist || ''} onClose={handleCloseModal} />
        
        <IonContent>
          {/* Most Played Section */}
          {mostPlayedSong && (
            <>
              <IonItem className="section-header" lines="none">
                <h3>
                  <IonIcon icon={star} color="warning" />
                  Most Played Version
                </h3>
              </IonItem>
              <IonList>
                <SongItem
                  key={mostPlayedSong.key || `${mostPlayedSong.title}-${mostPlayedSong.artist}`}
                  song={mostPlayedSong}
                  context={SongItemContext.SEARCH}
                  showAddButton={true}
                  showInfoButton={true}
                  showFavoriteButton={false}
                  className="highlighted-song"
                />
              </IonList>
            </>
          )}

          {/* Other Variations Section */}
          {otherVariations.length > 0 && (
            <>
              <IonItem className="section-header other-variations" lines="none">
                <h3>
                  <IonIcon icon={layers} color="medium" />
                  Other Variations ({otherVariations.length})
                </h3>
              </IonItem>
              <IonList>
                {otherVariations.map((song) => (
                  <SongItem
                    key={song.key || `${song.title}-${song.artist}`}
                    song={song}
                    context={SongItemContext.SEARCH}
                    showAddButton={true}
                    showInfoButton={true}
                    showFavoriteButton={false}
                  />
                ))}
              </IonList>
            </>
          )}

          {/* No variations found */}
          {selectedSongs.length === 0 && (
            <div className="ion-padding text-center text-gray-500 dark:text-gray-400">
              <IonIcon icon={list} size="large" color="medium" />
              <p className="mt-2">No other variations found for this song</p>
            </div>
          )}
        </IonContent>
      </IonModal>

    </>
  );
};

export default Top100; 