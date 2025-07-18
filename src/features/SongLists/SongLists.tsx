import React, { useState } from 'react';
import { IonItem, IonLabel, IonModal, IonHeader, IonToolbar, IonTitle, IonButton, IonIcon, IonChip, IonContent, IonList, IonAccordionGroup, IonAccordion } from '@ionic/react';
import { close, list } from 'ionicons/icons';
import { InfiniteScrollList, PageHeader, SongItem } from '../../components/common';
import { useSongLists } from '../../hooks';
import { useAppSelector } from '../../redux';
import { selectSongList } from '../../redux';
import type { SongListSong, SongList, Song } from '../../types';

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
  const [selectedSongList, setSelectedSongList] = useState<string | null>(null);
  const [expandedSongKey, setExpandedSongKey] = useState<string | null>(null);



  const handleSongListClick = (songListKey: string) => {
    setSelectedSongList(songListKey);
    setExpandedSongKey(null); // Reset expansion when opening a new song list
  };

  const handleCloseSongList = () => {
    setSelectedSongList(null);
    setExpandedSongKey(null); // Reset expansion when closing
  };

  const handleSongItemClick = (songKey: string) => {
    setExpandedSongKey(expandedSongKey === songKey ? null : songKey);
  };

  const finalSelectedList = selectedSongList
    ? allSongLists.find(list => list.key === selectedSongList)
    : null;

  // Render song list item for InfiniteScrollList
  const renderSongListItem = (songList: SongList) => (
    <IonItem button onClick={() => handleSongListClick(songList.key!)} detail={false}>
      <IonLabel>
        <h3 className="text-sm font-medium text-gray-900">
          {songList.title}
        </h3>
        <p className="text-sm text-gray-500">
          {songList.songs.length} song{songList.songs.length !== 1 ? 's' : ''}
        </p>
      </IonLabel>
      <IonIcon icon={list} slot="end" color="primary" />
    </IonItem>
  );

  return (
    <>
      <PageHeader
        title="Song Lists"
        subtitle={`${songListCount} items loaded`}
      />

      <div className="max-w-4xl mx-auto p-6">
        <InfiniteScrollList<SongList>
          items={songLists}
          isLoading={songListCount === 0}
          hasMore={hasMore}
          onLoadMore={loadMore}
          renderItem={renderSongListItem}
          emptyTitle="No song lists available"
          emptyMessage="Song lists will appear here when they're available"
          loadingTitle="Loading song lists..."
          loadingMessage="Please wait while song lists are being loaded"
        />

        {/* Song List Modal */}
        <IonModal 
          isOpen={!!finalSelectedList} 
          onDidDismiss={handleCloseSongList}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>{finalSelectedList?.title}</IonTitle>
              <IonButton slot="end" fill="clear" onClick={handleCloseSongList}>
                <IonIcon icon={close} />
              </IonButton>
            </IonToolbar>
          </IonHeader>
          
          <IonContent>
            <IonAccordionGroup value={expandedSongKey}>
              {finalSelectedList?.songs.map((songListSong: SongListSong, index) => {
                const availableSongs = checkSongAvailability(songListSong);
                const isAvailable = availableSongs.length > 0;
                const songKey = songListSong.key || `${songListSong.title}-${songListSong.position}-${index}`;

                if (isAvailable) {
                  // Available songs get an accordion that expands
                  return (
                    <IonAccordion key={songKey} value={songKey} style={{ '--border-style': 'none' } as React.CSSProperties}>
                      <IonItem 
                        slot="header" 
                        detail={false} 
                        button 
                        onClick={() => handleSongItemClick(songKey)}
                        style={{ 
                          '--border-style': 'solid',
                          '--border-width': '0 0 1px 0',
                          '--border-color': 'rgba(0, 0, 0, 0.13)'
                        } as React.CSSProperties}
                      >
                        {/* Number */}
                        <div slot="start" className="flex-shrink-0 w-12 h-12 flex items-center justify-center text-gray-600 font-medium">
                          {index + 1})
                        </div>

                        <IonLabel>
                          <h3 className="text-sm font-medium text-gray-900">
                            {songListSong.artist}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {songListSong.title}
                          </p>
                        </IonLabel>

                        <IonChip slot="end" color="success">
                          {availableSongs.length} version{availableSongs.length !== 1 ? 's' : ''}
                        </IonChip>
                      </IonItem>

                      <div slot="content" className="bg-gray-50 border-l-4 border-primary">
                        <IonList>
                          {availableSongs.map((song: Song, sidx) => (
                            <SongItem
                              key={song.key || `${song.title}-${song.artist}-${sidx}`}
                              song={song}
                              context="search"
                              onAddToQueue={() => handleAddToQueue(song)}
                              onToggleFavorite={() => handleToggleFavorite(song)}
                            />
                          ))}
                        </IonList>
                      </div>
                    </IonAccordion>
                  );
                } else {
                  // Unavailable songs get a simple item
                  return (
                    <IonItem 
                      key={songKey}
                      detail={false}
                      className="opacity-50"
                    >
                      {/* Number */}
                      <div slot="start" className="flex-shrink-0 w-12 h-12 flex items-center justify-center text-gray-600 font-medium">
                        {index + 1})
                      </div>

                      <IonLabel>
                        <h3 className="text-sm font-medium text-gray-400">
                          {songListSong.artist}
                        </h3>
                        <p className="text-sm text-gray-300">
                          {songListSong.title}
                        </p>
                      </IonLabel>
                    </IonItem>
                  );
                }
              })}
            </IonAccordionGroup>
          </IonContent>
        </IonModal>
      </div>
    </>
  );
};

export default SongLists; 