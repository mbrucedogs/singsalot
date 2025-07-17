import React from 'react';
import { IonHeader, IonToolbar, IonTitle, IonChip, IonIcon } from '@ionic/react';
import { trophy } from 'ionicons/icons';
import { InfiniteScrollList } from '../../components/common';
import { useTopPlayed } from '../../hooks';
import { useAppSelector } from '../../redux';
import { selectTopPlayed } from '../../redux';
import type { TopPlayed, Song } from '../../types';

const Top100: React.FC = () => {
  console.log('Top100 component - RENDERING START');

  const {
    topPlayedItems,
    loadMore,
    handleAddToQueue,
    handleToggleFavorite,
  } = useTopPlayed();

  const topPlayed = useAppSelector(selectTopPlayed);
  const topPlayedCount = Object.keys(topPlayed).length;

  console.log('Top100 component - Redux data:', { topPlayedCount, topPlayedItems: topPlayedItems.length });

  // Mock data for testing
  const mockTopPlayedItems: TopPlayed[] = [
    {
      key: 'mock-1',
      title: 'Bohemian Rhapsody',
      artist: 'Queen',
      count: 156
    },
    {
      key: 'mock-2',
      title: 'Sweet Caroline',
      artist: 'Neil Diamond',
      count: 142
    },
    {
      key: 'mock-3',
      title: 'Don\'t Stop Believin\'',
      artist: 'Journey',
      count: 128
    },
    {
      key: 'mock-4',
      title: 'Livin\' on a Prayer',
      artist: 'Bon Jovi',
      count: 115
    },
    {
      key: 'mock-5',
      title: 'Wonderwall',
      artist: 'Oasis',
      count: 98
    },
    {
      key: 'mock-6',
      title: 'Hotel California',
      artist: 'Eagles',
      count: 87
    },
    {
      key: 'mock-7',
      title: 'Stairway to Heaven',
      artist: 'Led Zeppelin',
      count: 76
    },
    {
      key: 'mock-8',
      title: 'Imagine',
      artist: 'John Lennon',
      count: 65
    },
    {
      key: 'mock-9',
      title: 'Hey Jude',
      artist: 'The Beatles',
      count: 54
    },
    {
      key: 'mock-10',
      title: 'Yesterday',
      artist: 'The Beatles',
      count: 43
    }
  ];

  // Convert TopPlayed items to Song format for consistent UI
  const songItems: Song[] = mockTopPlayedItems.map((item: TopPlayed) => ({
    ...item,
    path: '', // TopPlayed doesn't have path
    disabled: false,
    favorite: false,
  }));

  // Use mock data for now
  const displayItems = songItems;
  const displayCount = songItems.length;
  const displayHasMore = false; // No more mock data to load

  console.log('Top100 component - Mock data:', { 
    displayItems: displayItems.length, 
    displayCount, 
    displayHasMore,
    firstItem: displayItems[0]
  });

  console.log('Top100 component - About to render JSX');

  // Wrapper functions to handle type conversion
  const handleAddToQueueWrapper = (song: Song) => {
    console.log('Top100 component - Add to Queue clicked:', song);
    const topPlayedItem = mockTopPlayedItems.find(item => item.key === song.key);
    if (topPlayedItem) {
      handleAddToQueue(topPlayedItem);
    }
  };

  const handleToggleFavoriteWrapper = (song: Song) => {
    console.log('Top100 component - Remove clicked:', song);
    const topPlayedItem = mockTopPlayedItems.find(item => item.key === song.key);
    if (topPlayedItem) {
      handleToggleFavorite(topPlayedItem);
    }
  };

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            Top 100 Played
            <IonChip color="primary" className="ml-2">
              {displayItems.length}
            </IonChip>
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <InfiniteScrollList
        items={displayItems}
        isLoading={displayCount === 0}
        hasMore={displayHasMore}
        onLoadMore={loadMore}
        onAddToQueue={handleAddToQueueWrapper}
        onToggleFavorite={handleToggleFavoriteWrapper}
        context="topPlayed"
        title=""
        subtitle=""
        emptyTitle="No top played songs"
        emptyMessage="Play some songs to see the top played list"
        loadingTitle="Loading top played songs..."
        loadingMessage="Please wait while top played data is being loaded"
        debugInfo={`Top played items loaded: ${displayCount} (Mock Data)`}
        renderExtraContent={(item: Song, index: number) => (
          <div className="flex items-center space-x-2 px-4 py-2">
            <div className="flex items-center text-sm text-gray-500">
              <IonIcon icon={trophy} className="mr-1" />
              <span>#{index + 1}</span>
            </div>
            <IonChip color="primary">
              {item.count} play{item.count !== 1 ? 's' : ''}
            </IonChip>
          </div>
        )}
      />
    </>
  );
};

export default Top100; 