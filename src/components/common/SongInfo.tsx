import React, { useState } from 'react';
import { 
  IonModal, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonButton, IonIcon, IonList, IonItem, IonLabel
} from '@ionic/react';
import { 
  add, heart, heartOutline, ban, checkmark, close, people
} from 'ionicons/icons';
import { useAppSelector } from '../../redux';
import { selectIsAdmin, selectFavorites, selectSongs, selectQueue } from '../../redux';
import { useSongOperations } from '../../hooks/useSongOperations';
import { useDisabledSongs } from '../../hooks/useDisabledSongs';
import { useSelectSinger } from '../../hooks/useSelectSinger';
import { useToast } from '../../hooks/useToast';
import SelectSinger from './SelectSinger';
import { SongInfoDisplay } from './SongItem';
import type { Song, QueueItem } from '../../types';

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
  const { toggleFavorite } = useSongOperations();
  const { isSongDisabled, addDisabledSong, removeDisabledSong } = useDisabledSongs();
  const { showSuccess, showError } = useToast();
  
  const { 
    isOpen: isSelectSingerOpen, 
    selectedSong: selectSingerSong, 
    openSelectSinger, 
    closeSelectSinger 
  } = useSelectSinger();
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

  const handleToggleFavorite = async () => {
    try {
      await toggleFavorite(song);
      showSuccess(isInFavorites ? 'Removed from favorites' : 'Added to favorites');
    } catch {
      showError('Failed to update favorites');
    }
  };

  const handleToggleDisabled = async () => {
    try {
      if (isDisabled) {
        await removeDisabledSong(song);
        showSuccess('Song enabled');
      } else {
        await addDisabledSong(song);
        showSuccess('Song disabled');
      }
    } catch {
      showError('Failed to update song status');
    }
  };

  return (
    <>
      {/* Main Song Info Modal */}
      <IonModal 
        isOpen={isOpen} 
        onDidDismiss={onClose}
        breakpoints={[0, 0.5, 0.8]}
        initialBreakpoint={0.8}
      >
        <IonHeader>
          <IonToolbar>
            <IonTitle>Song Info</IonTitle>
            <IonButton slot="end" fill="clear" onClick={onClose}>
              <IonIcon icon={close} />
            </IonButton>
          </IonToolbar>
        </IonHeader>
        
        <IonContent>
          <div className="p-4">
            {/* Song Information using SongInfoDisplay component */}
            <div className="mb-6">
              <div style={{ padding: '16px', marginBottom: '20px' }}>
                <SongInfoDisplay
                  song={song}
                  showPath={true}
                  showCount={false}
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
                onClick={handleToggleFavorite}
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
                  onClick={handleToggleDisabled}
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

      {/* Select Singer Modal */}
      {selectSingerSong && (
        <SelectSinger
          isOpen={isSelectSingerOpen}
          onClose={closeSelectSinger}
          song={selectSingerSong}
        />
      )}

      {/* Artist Songs Modal */}
      <IonModal 
        isOpen={showArtistSongs} 
        onDidDismiss={() => setShowArtistSongs(false)}
        breakpoints={[0, 0.5, 0.8]}
        initialBreakpoint={0.8}
      >
        <IonHeader>
          <IonToolbar>
            <IonTitle>Songs by {song.artist}</IonTitle>
            <IonButton slot="end" fill="clear" onClick={() => setShowArtistSongs(false)}>
              <IonIcon icon={close} />
            </IonButton>
          </IonToolbar>
        </IonHeader>
        
        <IonContent>
          <div className="p-4">
            {artistSongs.length > 0 ? (
              <IonList>
                {artistSongs.map((artistSong) => (
                  <IonItem key={artistSong.path}>
                    <IonLabel>
                      <div className="text-base font-bold">{artistSong.title}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{artistSong.path}</div>
                    </IonLabel>
                  </IonItem>
                ))}
              </IonList>
            ) : (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No other songs found by this artist
              </div>
            )}
          </div>
        </IonContent>
      </IonModal>
    </>
  );
};

export default SongInfo; 