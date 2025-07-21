import React, { useState } from 'react';
import { 
  IonModal, IonContent, 
  IonButton, IonIcon
} from '@ionic/react';
import { 
  add, heart, heartOutline, ban, checkmark, people
} from 'ionicons/icons';
import { useAppSelector } from '../../redux';
import { selectIsAdmin, selectFavorites, selectSongs, selectQueue } from '../../redux';
import { useActions } from '../../hooks/useActions';
import { useModal } from '../../hooks/useModalContext';

import { ModalHeader, InfiniteScrollList, SongItem } from './index';
import { SongInfoDisplay } from './SongItem';
import type { Song, QueueItem } from '../../types';
import { SongItemContext } from '../../types';

interface SongInfoProps {
  isOpen: boolean;
  onClose: () => void;
  song: Song;
}

const SongInfo: React.FC<SongInfoProps> = ({ isOpen, onClose, song }) => {
  const isAdmin = useAppSelector(selectIsAdmin);
  const favorites = useAppSelector(selectFavorites);
  const allSongs = useAppSelector(selectSongs);
  const queue = useAppSelector(selectQueue);
  const { handleToggleFavorite, handleToggleDisabled, isSongDisabled } = useActions();
  
  const { openSelectSinger } = useModal();
  const [showArtistSongs, setShowArtistSongs] = useState(false);

  const isInFavorites = (Object.values(favorites) as Song[]).some(favSong => favSong.path === song.path);
  const isDisabled = isSongDisabled(song);
  const isInQueue = (Object.values(queue) as QueueItem[]).some(queueItem => queueItem.song && queueItem.song.path === song.path);

  const artistSongs = (Object.values(allSongs) as Song[]).filter(s => 
    s.artist.toLowerCase() === song.artist.toLowerCase() && s.path !== song.path
  );

  const handleQueueSong = () => {
    openSelectSinger(song);
  };

  const handleArtistSongs = () => {
    setShowArtistSongs(true);
  };

  const handleToggleFavoriteClick = async () => {
    await handleToggleFavorite(song);
  };

  const handleToggleDisabledClick = async () => {
    await handleToggleDisabled(song);
  };

  return (
    <>
      {/* Main Song Info Modal */}
      <IonModal 
        isOpen={isOpen} 
        onDidDismiss={onClose}
        breakpoints={[0, 0.5, 0.8]}
        initialBreakpoint={0.8}
        keepContentsMounted={false}
        backdropDismiss={true}
      >
        <ModalHeader title="Song Info" onClose={onClose} />
        
        <IonContent>
          <div className="p-4">
            {/* Song Information using SongInfoDisplay component */}
            <div className="mb-6">
              <div style={{ padding: '16px', marginBottom: '20px' }}>
                <SongInfoDisplay
                  song={song}
                  showPath={true}
                  showCount={false}
                  showFullPath={true}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col items-center space-y-4">
              {/* Queue Song Button */}
              {!isInQueue && (
                <IonButton 
                  fill="solid" 
                  color="primary"
                  onClick={handleQueueSong}
                  className="h-12 w-80"
                  style={{ width: '320px' }}
                >
                  <IonIcon icon={people} slot="start" />
                  Queue Song
                </IonButton>
              )}

              {/* Artist Songs Button */}
              <IonButton 
                fill="solid" 
                color="primary"
                onClick={handleArtistSongs}
                className="h-12 w-80"
                style={{ width: '320px' }}
              >
                <IonIcon icon={add} slot="start" />
                Artist Songs
              </IonButton>

              {/* Favorite/Unfavorite Button */}
              <IonButton 
                fill="solid" 
                color={isInFavorites ? "danger" : "primary"}
                onClick={handleToggleFavoriteClick}
                className="h-12 w-80"
                style={{ width: '320px' }}
              >
                <IonIcon icon={isInFavorites ? heart : heartOutline} slot="start" />
                {isInFavorites ? 'Unfavorite Song' : 'Favorite Song'}
              </IonButton>

              {/* Disable/Enable Button (Admin Only) */}
              {isAdmin && (
                <IonButton 
                  fill="solid" 
                  color={isDisabled ? "success" : "warning"}
                  onClick={handleToggleDisabledClick}
                  className="h-12 w-80"
                  style={{ width: '320px' }}
                >
                  <IonIcon icon={isDisabled ? checkmark : ban} slot="start" />
                  {isDisabled ? 'Enable Song' : 'Disable Song'}
                </IonButton>
              )}
            </div>
          </div>
        </IonContent>
      </IonModal>

      {/* Artist Songs Modal */}
      <IonModal 
        isOpen={showArtistSongs} 
        onDidDismiss={() => setShowArtistSongs(false)}
        breakpoints={[0, 0.5, 0.8]}
        initialBreakpoint={0.8}
      >
        <ModalHeader 
          title={`Songs by ${song.artist}`} 
          onClose={() => setShowArtistSongs(false)} 
        />
        
        <IonContent>
          <InfiniteScrollList
            items={artistSongs}
            isLoading={false}
            hasMore={false}
            onLoadMore={() => {}}
            renderItem={(song) => (
              <SongItem
                song={song}
                context={SongItemContext.SEARCH}
                showAddButton={true}
                showInfoButton={true}
                showFavoriteButton={false}
              />
            )}
            emptyTitle="No songs found"
            emptyMessage="No other songs found by this artist"
          />
        </IonContent>
      </IonModal>
    </>
  );
};

export default SongInfo; 