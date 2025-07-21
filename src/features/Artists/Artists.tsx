import React, { useState } from 'react';
import { IonSearchbar, IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonItem } from '@ionic/react';
import { list } from 'ionicons/icons';
import { InfiniteScrollList, SongItem, ListItem, NumberDisplay, ActionButton } from '../../components/common';
import { ActionButtonVariant, ActionButtonSize, ActionButtonIconSlot } from '../../types';
import { Icons } from '../../constants';
import { useArtists } from '../../hooks';
import { useAppSelector } from '../../redux';
import { selectSongs } from '../../redux';
import { debugLog } from '../../utils/logger';


const Artists: React.FC = () => {
  const {
    artists,
    searchTerm,
    hasMore,
    loadMore,
    handleSearchChange,
    getSongsByArtist,
    getSongCountByArtist,
  } = useArtists();

  const songs = useAppSelector(selectSongs);
  const songsCount = Object.keys(songs).length;
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);
  // Debug logging
  debugLog('Artists component - artists count:', artists.length);
  debugLog('Artists component - selected artist:', selectedArtist);
  debugLog('Artists component - songs count:', songsCount);
  debugLog('Artists component - search term:', searchTerm);

  const handleArtistClick = (artist: string) => {
    setSelectedArtist(artist);
  };

  const handleCloseArtistSongs = () => {
    setSelectedArtist(null);
  };

  const selectedArtistSongs = selectedArtist ? getSongsByArtist(selectedArtist) : [];

  // Render artist item for InfiniteScrollList
  const renderArtistItem = (artist: string) => (
    <ListItem
      primaryText={artist}
      secondaryText={`${getSongCountByArtist(artist)} song${getSongCountByArtist(artist) !== 1 ? 's' : ''}`}
      icon={list}
      onClick={() => handleArtistClick(artist)}
    />
  );

  return (
    <>
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          {/* Search Input */}
          <IonSearchbar
            placeholder="Search artists..."
            value={searchTerm}
            onIonInput={(e) => handleSearchChange(e.detail.value || '')}
            debounce={300}
            showClearButton="focus"
          />
        </div>

        {/* Artists List */}
        <InfiniteScrollList<string>
          items={artists}
          isLoading={songsCount === 0}
          hasMore={hasMore}
          onLoadMore={loadMore}
          renderItem={renderArtistItem}
          emptyTitle={searchTerm ? "No artists found" : "No artists available"}
          emptyMessage={searchTerm ? "Try adjusting your search terms" : "Artists will appear here once songs are loaded"}
          loadingTitle="Loading artists..."
          loadingMessage="Please wait while songs are being loaded from the database"
        />

        {/* Artist Songs Modal */}
        <IonModal 
          isOpen={!!selectedArtist} 
          onDidDismiss={handleCloseArtistSongs}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>Songs by {selectedArtist}</IonTitle>
              <div slot="end">
                <ActionButton
                  onClick={handleCloseArtistSongs}
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
            <div style={{ padding: '10px' }}>
              <InfiniteScrollList
                items={selectedArtistSongs}
                isLoading={false}
                hasMore={false}
                onLoadMore={() => {}}
                renderItem={(song, index) => (
                  <IonItem 
                    key={song.key} 
                    detail={false} 
                    style={{ 
                      '--min-height': '60px', 
                      '--border-style': 'none',
                      '--padding-start': '0',
                      '--padding-end': '0',
                      '--inner-padding-start': '0',
                      '--inner-padding-end': '0',
                      '--padding-top': '0',
                      '--padding-bottom': '0',
                      margin: '5px 0',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {/* Number */}
                    <div style={{ 
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <NumberDisplay number={index + 1} />
                    </div>
                    
                    {/* Song Item Content - placed directly after NumberDisplay like in ListItem */}
                    <div style={{ 
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <div style={{ width: '100%' }}>
                        <SongItem
                          song={song}
                          context="search"
                          showAddButton={true}
                          showInfoButton={true}
                          showFavoriteButton={false}
                        />
                      </div>
                    </div>
                  </IonItem>
                )}
                emptyTitle="No songs found"
                emptyMessage="This artist has no songs in the catalog"
              />
            </div>
          </IonContent>
        </IonModal>

      </div>
    </>
  );
};

export default Artists; 