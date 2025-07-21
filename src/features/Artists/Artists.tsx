import React, { useState } from 'react';
import { IonSearchbar, IonModal, IonContent } from '@ionic/react';
import { list } from 'ionicons/icons';
import { InfiniteScrollList, SongItem, ListItem, ModalHeader } from '../../components/common';
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
          <ModalHeader title={`Songs by ${selectedArtist}`} onClose={handleCloseArtistSongs} />
          
          <IonContent>
            <InfiniteScrollList
              items={selectedArtistSongs}
              isLoading={false}
              hasMore={false}
              onLoadMore={() => {}}
              renderItem={(song) => (
                <SongItem
                  song={song}
                  context="search"
                  showAddButton={true}
                  showInfoButton={true}
                  showFavoriteButton={false}
                />
              )}
              emptyTitle="No songs found"
              emptyMessage="This artist has no songs in the catalog"
            />
          </IonContent>
        </IonModal>

      </div>
    </>
  );
};

export default Artists; 