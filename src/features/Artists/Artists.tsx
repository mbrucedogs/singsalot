import React, { useState } from 'react';
import { IonSearchbar, IonList, IonItem, IonLabel, IonModal, IonHeader, IonToolbar, IonTitle, IonButton, IonIcon } from '@ionic/react';
import { close, add, heart, heartOutline, list } from 'ionicons/icons';
import { InfiniteScrollList, PageHeader } from '../../components/common';
import { useArtists } from '../../hooks';
import { useAppSelector } from '../../redux';
import { selectSongs } from '../../redux';

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
  console.log('Artists component - artists count:', artists.length);
  console.log('Artists component - selected artist:', selectedArtist);
  console.log('Artists component - songs count:', songsCount);
  console.log('Artists component - search term:', searchTerm);

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
      <IonHeader>
        <IonToolbar>
          <IonTitle>Artists</IonTitle>
        </IonToolbar>
      </IonHeader>

      <PageHeader
        title="Artists"
        subtitle="Browse songs by artist"
      />

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
        <IonModal isOpen={!!selectedArtist} onDidDismiss={handleCloseArtistSongs}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Songs by {selectedArtist}</IonTitle>
              <IonButton slot="end" fill="clear" onClick={handleCloseArtistSongs}>
                <IonIcon icon={close} />
              </IonButton>
            </IonToolbar>
          </IonHeader>
          
          <div className="p-4">
            <IonList>
              {selectedArtistSongs.map((song) => (
                <IonItem key={song.key}>
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
          </div>
        </IonModal>
      </div>
    </>
  );
};

export default Artists; 