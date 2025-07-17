import React, { useState, useEffect, useRef } from 'react';
import { IonSearchbar, IonList, IonItem, IonLabel, IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonChip } from '@ionic/react';
import { close, add, heart, heartOutline } from 'ionicons/icons';
import { useArtists } from '../../hooks';
import { useAppSelector } from '../../redux';
import { selectSongs } from '../../redux';

const Artists: React.FC = () => {
  const {
    artists,
    allArtists,
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
  const observerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for infinite scrolling
  useEffect(() => {
    console.log('Artists - Setting up observer:', { hasMore, songsCount, itemsLength: artists.length });
    
    const observer = new IntersectionObserver(
      (entries) => {
        console.log('Artists - Intersection detected:', { 
          isIntersecting: entries[0].isIntersecting, 
          hasMore, 
          songsCount 
        });
        
        if (entries[0].isIntersecting && hasMore && songsCount > 0) {
          console.log('Artists - Loading more items');
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [loadMore, hasMore, songsCount, artists.length]);

  // Debug logging
  useEffect(() => {
    console.log('Artists component - artists count:', artists.length);
    console.log('Artists component - selected artist:', selectedArtist);
  }, [artists.length, selectedArtist]);

  const handleArtistClick = (artist: string) => {
    setSelectedArtist(artist);
  };

  const handleCloseArtistSongs = () => {
    setSelectedArtist(null);
  };

  const selectedArtistSongs = selectedArtist ? getSongsByArtist(selectedArtist) : [];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Artists</h1>
        
        {/* Search Input */}
        <IonSearchbar
          placeholder="Search artists..."
          value={searchTerm}
          onIonInput={(e) => handleSearchChange(e.detail.value || '')}
          debounce={300}
          showClearButton="focus"
        />

        {/* Debug info */}
        <div className="mt-2 text-sm text-gray-500">
          Total songs loaded: {songsCount} | Showing: {artists.length} of {allArtists.length} artists | Search term: "{searchTerm}"
        </div>
      </div>

      {/* Artists List */}
      <div className="bg-white rounded-lg shadow">
        {songsCount === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="h-12 w-12 mx-auto animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading artists...</h3>
            <p className="text-sm text-gray-500">Please wait while songs are being loaded from the database</p>
          </div>
        ) : artists.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? "No artists found" : "No artists available"}
            </h3>
            <p className="text-sm text-gray-500">
              {searchTerm ? "Try adjusting your search terms" : "Artists will appear here once songs are loaded"}
            </p>
          </div>
        ) : (
          <IonList>
            {artists.map((artist) => (
              <IonItem key={artist} button onClick={() => handleArtistClick(artist)}>
                <IonLabel>
                  <h3 className="text-sm font-medium text-gray-900">
                    {artist}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {getSongCountByArtist(artist)} song{getSongCountByArtist(artist) !== 1 ? 's' : ''}
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
                  Loading more artists...
                </div>
              </div>
            )}
          </IonList>
        )}
      </div>

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
        
        <IonContent>
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
        </IonContent>
      </IonModal>
    </div>
  );
};

export default Artists; 