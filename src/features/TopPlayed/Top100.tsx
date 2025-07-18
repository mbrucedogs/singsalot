import React from 'react';
import { useTopPlayed } from '../../hooks';
import { useAppSelector } from '../../redux';
import { selectTopPlayed } from '../../redux';
import { InfiniteScrollList, PageHeader } from '../../components/common';
import type { TopPlayed } from '../../types';

const Top100: React.FC = () => {
  console.log('Top100 component - RENDERING START');

  const {
    topPlayedItems,
    loadMore,
  } = useTopPlayed();

  const topPlayed = useAppSelector(selectTopPlayed);
  const topPlayedCount = Object.keys(topPlayed).length;

  console.log('Top100 component - Redux data:', { topPlayedCount, topPlayedItems: topPlayedItems.length });

  // Mock data for testing - these are artist/title combinations, not individual songs
  const mockTopPlayedItems: TopPlayed[] = [
    {
      key: 'mock-1',
      title: 'CAN\'T STOP THE FEELING',
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
          <div style={{ display: 'flex', alignItems: 'flex-start', padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>
            <div style={{ width: '80px', textAlign: 'right', paddingRight: '16px', flexShrink: 0 }}>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#374151' }}>
                {index + 1})
              </span>
            </div>
            <div style={{ width: '16px', flexShrink: 0 }}></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>
                {item.title} ({item.count})
              </div>
              <div style={{ fontSize: '16px', fontStyle: 'italic', color: '#4b5563' }}>
                {item.artist}
              </div>
            </div>
          </div>
        )}
        emptyTitle="No top played songs"
        emptyMessage="Play some songs to see the top played list"
      />
    </>
  );
};

export default Top100; 