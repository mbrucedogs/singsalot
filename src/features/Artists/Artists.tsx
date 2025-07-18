import React, { useState } from 'react';
import { IonSearchbar, IonItem, IonLabel, IonModal, IonHeader, IonToolbar, IonTitle, IonButton, IonIcon, IonContent } from '@ionic/react';
import { close, list } from 'ionicons/icons';
import { InfiniteScrollList, SongItem } from '../../components/common';
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
    handleAddToQueue,
    handleToggleFavorite,
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
    <IonItem button onClick={() => handleArtistClick(artist)} detail={false}>
      <IonLabel>
        <h3 className="text-sm font-medium text-gray-900">
          {artist}
        </h3>
        <p className="text-sm text-gray-500">
          {getSongCountByArtist(artist)} song{getSongCountByArtist(artist) !== 1 ? 's' : ''}
        </p>
      </IonLabel>
      <IonIcon icon={list} slot="end" color="primary" />
    </IonItem>
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
          breakpoints={[0, 0.5, 0.8]}
          initialBreakpoint={0.8}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>Songs by {selectedArtist}</IonTitle>
              <IonButton slot="end" fill="clear" onClick={handleCloseArtistSongs}>
                <IonIcon icon={close} />
              </IonButton>
            </IonToolbar>
          </IonHeader>
          
          <IonContent>
            <div className="p-4">
              {selectedArtistSongs.map((song) => (
                <SongItem
                  key={song.key}
                  song={song}
                  context="search"
                  onAddToQueue={() => handleAddToQueue(song)}
                  onToggleFavorite={() => handleToggleFavorite(song)}
                />
              ))}
            </div>
          </IonContent>
        </IonModal>
      </div>
    </>
  );
};

export default Artists; 