import React, { useState, useMemo, useCallback } from 'react';
import { IonItem, IonLabel, IonChip, IonModal, IonHeader, IonToolbar, IonTitle, IonButton, IonIcon, IonContent, IonList } from '@ionic/react';
import { close, list } from 'ionicons/icons';
import { useTopPlayed } from '../../hooks';
import { useAppSelector } from '../../redux';
import { selectTopPlayed, selectSongsArray } from '../../redux';
import { InfiniteScrollList, PageHeader, SongItem } from '../../components/common';
import { filterSongs } from '../../utils/dataProcessing';
import { useSongOperations } from '../../hooks';
import { useToast } from '../../hooks';
import type { TopPlayed, Song } from '../../types';

const Top100: React.FC = () => {
  console.log('Top100 component - RENDERING START');

  const {
    topPlayedItems,
    loadMore,
  } = useTopPlayed();

  const topPlayed = useAppSelector(selectTopPlayed);
  const topPlayedCount = Object.keys(topPlayed).length;
  const allSongs = useAppSelector(selectSongsArray);
  const { addToQueue, toggleFavorite } = useSongOperations();
  const { showSuccess, showError } = useToast();
  const [selectedTopPlayed, setSelectedTopPlayed] = useState<TopPlayed | null>(null);

  console.log('Top100 component - Redux data:', { topPlayedCount, topPlayedItems: topPlayedItems.length });

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
    
    console.log('Top100 - Search details:', {
      selectedTopPlayed,
      searchTerm,
      allSongsCount: allSongs.length
    });
    
    const filteredSongs = filterSongs(allSongs, searchTerm);
    
    console.log('Top100 - Search results:', {
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

  const handleToggleFavorite = useCallback(async (song: Song) => {
    try {
      await toggleFavorite(song);
      showSuccess(song.favorite ? 'Removed from favorites' : 'Added to favorites');
    } catch {
      showError('Failed to update favorites');
    }
  }, [toggleFavorite, showSuccess, showError]);

  // Mock data for testing - these are artist/title combinations, not individual songs
  const mockTopPlayedItems: TopPlayed[] = [
    {
      key: 'mock-1',
      title: 'CAN T STOP THE FEELING',
      artist: 'Justin Timberlake',
      count: 63
    },
    {
      key: 'mock-2',
      title: 'SWEET CAROLINE',
      artist: 'Neil Diamond',
      count: 58
    },
    {
      key: 'mock-3',
      title: 'DON\'T STOP BELIEVIN\'',
      artist: 'Journey',
      count: 52
    },
    {
      key: 'mock-4',
      title: 'LIVIN\' ON A PRAYER',
      artist: 'Bon Jovi',
      count: 47
    },
    {
      key: 'mock-5',
      title: 'WONDERWALL',
      artist: 'Oasis',
      count: 41
    },
    {
      key: 'mock-6',
      title: 'HOTEL CALIFORNIA',
      artist: 'Eagles',
      count: 38
    },
    {
      key: 'mock-7',
      title: 'STAIRWAY TO HEAVEN',
      artist: 'Led Zeppelin',
      count: 35
    },
    {
      key: 'mock-8',
      title: 'IMAGINE',
      artist: 'John Lennon',
      count: 32
    },
    {
      key: 'mock-9',
      title: 'HEY JUDE',
      artist: 'The Beatles',
      count: 29
    },
    {
      key: 'mock-10',
      title: 'YESTERDAY',
      artist: 'The Beatles',
      count: 26
    }
  ];

  // Use mock data for now
  const displayItems = mockTopPlayedItems;
  const displayCount = displayItems.length;
  const displayHasMore = false; // No more mock data to load

  console.log('Top100 component - Mock data:', { 
    displayItems: displayItems.length, 
    displayCount, 
    displayHasMore,
    firstItem: displayItems[0]
  });

  console.log('Top100 component - About to render JSX');

  return (
    <>
      <PageHeader
        title="Top 100 Played"
        subtitle={`${displayCount} items loaded (Mock Data)`}
      />

      <InfiniteScrollList<TopPlayed>
        items={displayItems}
        isLoading={false}
        hasMore={displayHasMore}
        onLoadMore={loadMore}
        renderItem={(item, index) => (
          <IonItem 
            button 
            onClick={() => handleTopPlayedClick(item)} 
            detail={false}
          >
            {/* Number */}
            <div slot="start" className="flex-shrink-0 w-12 h-12 flex items-center justify-center text-gray-600 font-medium">
              {index + 1})
            </div>

            <IonLabel>
              <h3 className="text-sm font-medium text-gray-900">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500">
                {item.artist}
              </p>
            </IonLabel>

            <IonChip slot="end" color="primary">
              {item.count} plays
            </IonChip>

            <IonIcon icon={list} slot="end" color="primary" />
          </IonItem>
        )}
        emptyTitle="No top played songs"
        emptyMessage="Play some songs to see the top played list"
      />

      {/* Top Played Songs Modal */}
      <IonModal 
        isOpen={!!selectedTopPlayed} 
        onDidDismiss={handleCloseModal}
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
                onToggleFavorite={() => handleToggleFavorite(song)}
              />
            ))}
          </IonList>
        </IonContent>
      </IonModal>
    </>
  );
};

export default Top100; 