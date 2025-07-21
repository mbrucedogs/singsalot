import React, { useState, useMemo, useCallback } from 'react';
import { IonItem, IonModal, IonHeader, IonToolbar, IonTitle, IonChip, IonContent, IonList, IonAccordionGroup, IonAccordion } from '@ionic/react';
import { list } from 'ionicons/icons';
import { InfiniteScrollList, SongItem, ListItem, TwoLineDisplay, NumberDisplay, ActionButton } from '../../components/common';
import { ActionButtonVariant, ActionButtonSize, ActionButtonIconSlot } from '../../types';
import { Icons } from '../../constants';
import { useSongLists } from '../../hooks';
import { useAppSelector } from '../../redux';
import { selectSongList } from '../../redux';
import type { SongListSong, SongList, Song } from '../../types';
import { debugLog } from '../../utils/logger';

const SongLists: React.FC = () => {
  const {
    songLists,
    allSongLists,
    hasMore,
    loadMore,
    checkSongAvailability,
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

  const handleSongItemClick = useCallback((songKey: string) => {
    setExpandedSongKey(expandedSongKey === songKey ? null : songKey);
  }, [expandedSongKey]);



  const finalSelectedList = selectedSongList
    ? allSongLists.find(list => list.key === selectedSongList)
    : null;

  // Pre-calculate available songs for the selected list to avoid repeated calculations
  const selectedListWithAvailability = useMemo(() => {
    if (!finalSelectedList) return null;
    
    return {
      ...finalSelectedList,
      songs: finalSelectedList.songs.map(songListSong => ({
        ...songListSong,
        availableSongs: checkSongAvailability(songListSong)
      }))
    };
  }, [finalSelectedList, checkSongAvailability]);

  // Render song list item for InfiniteScrollList
  const renderSongListItem = (songList: SongList) => (
    <ListItem 
      primaryText={songList.title}
      secondaryText={`${songList.songs.length} song${songList.songs.length !== 1 ? 's' : ''}`}
      icon={list}
      onClick={() => handleSongListClick(songList.key!)}
    />
  );

  return (
    <>
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
              <div slot="end">
                <ActionButton
                  onClick={handleCloseSongList}
                  variant={ActionButtonVariant.SECONDARY}
                  size={ActionButtonSize.SMALL}
                  icon={Icons.CLOSE}
                  iconSlot={ActionButtonIconSlot.ICON_ONLY}
                  fill="clear"
                />
              </div>
            </IonToolbar>
          </IonHeader>
          
          <IonContent>
            <IonAccordionGroup value={expandedSongKey}>
              {selectedListWithAvailability?.songs.map((songListSong: SongListSong & { availableSongs: Song[] }, index) => {
                const availableSongs = songListSong.availableSongs;
                const isAvailable = availableSongs.length > 0;
                const songKey = songListSong.key || `${songListSong.title}-${songListSong.position}-${index}`;

                if (isAvailable) {
                  // Available songs get an accordion that expands
                  return (
                    <IonAccordion key={songKey} value={songKey}>
                      <ListItem
                        primaryText={songListSong.title}
                        secondaryText={songListSong.artist}
                        showNumber={true}
                        number={index + 1}
                        slot="header"
                        detail={false}
                        button={true}
                        className="list-item"
                        style={{ '--min-height': '60px' } as React.CSSProperties}
                        onClick={() => handleSongItemClick(songKey)}
                        endContent={
                          <IonChip color="primary">
                            {availableSongs.length} version{availableSongs.length !== 1 ? 's' : ''}
                          </IonChip>
                        }
                      />

                      <div slot="content" className="bg-gray-50 border-l-4 border-primary">
                        <IonList>
                          {availableSongs.map((song: Song, sidx) => (
                            <SongItem
                              key={song.key || `${song.title}-${song.artist}-${sidx}`}
                              song={song}
                              context="search"
                              showAddButton={true}
                              showInfoButton={true}
                              showFavoriteButton={false}
                            />
                          ))}
                        </IonList>
                      </div>
                    </IonAccordion>
                  );
                } else {
                  // Unavailable songs get a simple item
                  debugLog('Non-accordion item:', {
                    title: songListSong.title,
                    artist: songListSong.artist,
                    index: index + 1
                  });
                  
                  return (
                    <IonItem 
                      key={songKey}
                      detail={false}
                      className="opacity-50"
                    >
                      {/* Number */}
                      <NumberDisplay number={index + 1} />

                      {/* Use TwoLineDisplay for consistent formatting with disabled styling */}
                      <TwoLineDisplay
                        primaryText={songListSong.title}
                        secondaryText={songListSong.artist}
                        primaryColor="var(--ion-color-medium)"
                        secondaryColor="var(--ion-color-medium)"
                      />
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