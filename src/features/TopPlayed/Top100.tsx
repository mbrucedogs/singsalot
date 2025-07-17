import React from 'react';
import { IonHeader, IonToolbar, IonTitle, IonChip, IonButton } from '@ionic/react';
import { useTopPlayed } from '../../hooks';
import { useAppSelector } from '../../redux';
import { selectTopPlayed } from '../../redux';
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

      <div className="max-w-4xl mx-auto p-6">
        {/* Debug info */}
        <div className="mt-2 text-sm text-gray-500 mb-4">
          Top played items loaded: {displayCount} (Mock Data)
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow">
          {displayCount === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="h-12 w-12 mx-auto animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Loading top played songs...</h3>
              <p className="text-sm text-gray-500">Please wait while top played data is being loaded</p>
            </div>
          ) : displayItems.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No top played songs</h3>
              <p className="text-sm text-gray-500">Play some songs to see the top played list</p>
            </div>
          ) : (
            <div className="w-full">
              {displayItems.map((item, index) => (
                <div key={item.key} style={{ display: 'flex', alignItems: 'flex-start', padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>
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
              ))}
              
              {/* Load more button */}
              {displayHasMore && (
                <div className="p-4 text-center">
                  <IonButton
                    fill="outline"
                    onClick={loadMore}
                  >
                    Load More
                  </IonButton>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Stats */}
        {displayItems.length > 0 && (
          <div className="mt-4 text-sm text-gray-500 text-center">
            Showing {displayItems.length} item{displayItems.length !== 1 ? 's' : ''}
            {displayHasMore && ` • Click "Load More" to see more`}
          </div>
        )}
      </div>
    </>
  );
};

export default Top100; 