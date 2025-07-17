import React, { useState, useEffect, useRef } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonModal, IonButton, IonIcon, IonChip, IonAccordion, IonAccordionGroup } from '@ionic/react';
import { close, documentText, add, heart, heartOutline } from 'ionicons/icons';
import { useSongLists } from '../../hooks';
import { useAppSelector } from '../../redux';
import { selectSongList } from '../../redux';
import type { SongListSong, Song } from '../../types';

const SongLists: React.FC = () => {
  const {
    songLists,
    allSongLists,
    hasMore,
    loadMore,
    checkSongAvailability,
    handleAddToQueue,
    handleToggleFavorite,
  } = useSongLists();

  const songListData = useAppSelector(selectSongList);
  const songListCount = Object.keys(songListData).length;
  const observerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for infinite scrolling
  useEffect(() => {
    console.log('SongLists - Setting up observer:', { hasMore, songListCount, itemsLength: songLists.length });
    
    const observer = new IntersectionObserver(
      (entries) => {
        console.log('SongLists - Intersection detected:', { 
          isIntersecting: entries[0].isIntersecting, 
          hasMore, 
          songListCount 
        });
        
        if (entries[0].isIntersecting && hasMore && songListCount > 0) {
          console.log('SongLists - Loading more items');
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [loadMore, hasMore, songListCount]);
  const [selectedSongList, setSelectedSongList] = useState<string | null>(null);

  // Debug logging - only log when data changes
  useEffect(() => {
    console.log('SongLists component - songList count:', songListCount);
    console.log('SongLists component - songLists:', songLists);
  }, [songListCount, songLists.length]);

  const handleSongListClick = (songListKey: string) => {
    console.log('SongLists - handleSongListClick called with key:', songListKey);
    setSelectedSongList(songListKey);
  };

  const handleCloseSongList = () => {
    setSelectedSongList(null);
  };

  const finalSelectedList = selectedSongList
    ? allSongLists.find(list => list.key === selectedSongList)
    : null;
  
  // Debug logging for modal
  useEffect(() => {
    console.log('SongLists - Modal state check:', { 
      selectedSongList, 
      finalSelectedList: !!finalSelectedList,
      songListsLength: songLists.length 
    });
    if (selectedSongList) {
      console.log('SongLists - Modal opened for song list:', selectedSongList);
      console.log('SongLists - Selected list data:', finalSelectedList);
      console.log('SongLists - About to render modal, finalSelectedList:', !!finalSelectedList);
    }
  }, [selectedSongList, finalSelectedList, songLists.length]);

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            Song Lists
            <IonChip color="primary" className="ml-2">
              {songLists.length}
            </IonChip>
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">
            {songLists.length} song list{songLists.length !== 1 ? 's' : ''} available
          </p>
          
          {/* Debug info */}
          <div className="mb-4 text-sm text-gray-500">
            Song lists loaded: {songListCount}
          </div>

          {/* Song Lists */}
          <div className="bg-white rounded-lg shadow">
            {songListCount === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="h-12 w-12 mx-auto animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Loading song lists...</h3>
                <p className="text-sm text-gray-500">Please wait while song lists are being loaded</p>
              </div>
            ) : songLists.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No song lists available</h3>
                <p className="text-sm text-gray-500">Song lists will appear here when they're available</p>
              </div>
            ) : (
              <IonList>
                {songLists.map((songList) => (
                  <IonItem key={songList.key} button onClick={() => handleSongListClick(songList.key!)}>
                    <IonIcon icon={documentText} slot="start" color="primary" />
                    <IonLabel>
                      <h3 className="text-sm font-medium text-gray-900">
                        {songList.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {songList.songs.length} song{songList.songs.length !== 1 ? 's' : ''}
                      </p>
                    </IonLabel>
                    <IonChip slot="end" color="primary">
                      View Songs
                    </IonChip>
                  </IonItem>
                ))}
                
                {/* Infinite scroll trigger */}
                {hasMore && (
                  <div 
                    ref={observerRef}
                    className="py-4 text-center text-gray-500"
                  >
                    <div className="inline-flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading more song lists...
                    </div>
                  </div>
                )}
              </IonList>
            )}
          </div>
        </div>
      </IonContent>

      {/* Song List Modal */}
      <IonModal isOpen={!!finalSelectedList} onDidDismiss={handleCloseSongList}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>{finalSelectedList?.title}</IonTitle>
            <IonButton slot="end" fill="clear" onClick={handleCloseSongList}>
              <IonIcon icon={close} />
            </IonButton>
          </IonToolbar>
        </IonHeader>
        
        <IonContent>
          <IonAccordionGroup>
            {finalSelectedList?.songs.map((songListSong: SongListSong, idx) => {
              const availableSongs = checkSongAvailability(songListSong);
              const isAvailable = availableSongs.length > 0;

              return (
                <IonAccordion key={songListSong.key || `${songListSong.title}-${songListSong.position}-${idx}`} value={songListSong.key}>
                  <IonItem slot="header" className={!isAvailable ? 'opacity-50' : ''}>
                    <IonLabel>
                      <h3 className="text-sm font-medium text-gray-900">
                        {songListSong.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {songListSong.artist} • Position {songListSong.position}
                      </p>
                      {!isAvailable && (
                        <p className="text-xs text-red-500 mt-1">
                          Not available in catalog
                        </p>
                      )}
                    </IonLabel>
                    {isAvailable && (
                      <IonChip slot="end" color="success">
                        {availableSongs.length} version{availableSongs.length !== 1 ? 's' : ''}
                      </IonChip>
                    )}
                  </IonItem>

                  <div slot="content">
                    {isAvailable ? (
                      <IonList>
                        {availableSongs.map((song: Song, sidx) => (
                          <IonItem key={song.key || `${song.title}-${song.artist}-${sidx}`}>
                            <IonLabel>
                              <h3 className="text-sm font-medium text-gray-900">
                                {song.title}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {song.artist}
                              </p>
                            </IonLabel>
                            <div slot="end" className="flex gap-2">
                              <IonButton
                                fill="clear"
                                size="small"
                                onClick={() => handleAddToQueue(song)}
                              >
                                <IonIcon icon={add} slot="icon-only" />
                              </IonButton>
                              <IonButton
                                fill="clear"
                                size="small"
                                onClick={() => handleToggleFavorite(song)}
                              >
                                <IonIcon icon={song.favorite ? heart : heartOutline} slot="icon-only" />
                              </IonButton>
                            </div>
                          </IonItem>
                        ))}
                      </IonList>
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        No matching songs found in catalog
                      </div>
                    )}
                  </div>
                </IonAccordion>
              );
            })}
          </IonAccordionGroup>
        </IonContent>
      </IonModal>
    </>
  );
};

export default SongLists; 