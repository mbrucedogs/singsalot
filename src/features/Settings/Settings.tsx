import React, { useState } from 'react';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonToggle, IonButton, IonIcon, IonModal, IonSearchbar } from '@ionic/react';
import { ban } from 'ionicons/icons';
import { useAppSelector } from '../../redux';
import { selectIsAdmin, selectSettings, updateController, selectControllerName } from '../../redux';
import { useDispatch } from 'react-redux';
import { settingsService } from '../../firebase/services';
import { useDisabledSongs } from '../../hooks';
import { InfiniteScrollList, ActionButton, SongItem } from '../../components/common';
import { ActionButtonVariant, ActionButtonSize, ActionButtonIconSlot } from '../../types';
import { Icons } from '../../constants';
import { filterSongs } from '../../utils/dataProcessing';
import { setDebugEnabled, isDebugEnabled, debugLog } from '../../utils/logger';
import type { Song, DisabledSong } from '../../types';

const Settings: React.FC = () => {
  const isAdmin = useAppSelector(selectIsAdmin);
  const playerSettings = useAppSelector(selectSettings);
  const dispatch = useDispatch();
  const { 
    disabledSongs, 
    loading, 
    removeDisabledSong
  } = useDisabledSongs();
  
  const [showDisabledSongsModal, setShowDisabledSongsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const controllerNameRedux = useAppSelector(selectControllerName);
  const existingPlayer = useAppSelector(state => state.controller.data?.player) || {};

  // Convert disabled songs object to array for display
  const disabledSongsArray: DisabledSong[] = Object.entries(disabledSongs).map(([key, disabledSong]) => ({
    key: disabledSong.key || key,
    path: disabledSong.path,
    artist: disabledSong.artist,
    title: disabledSong.title,
    disabledAt: disabledSong.disabledAt,
  }));

  // Filter disabled songs by search term
  const filteredDisabledSongs: DisabledSong[] = searchTerm.trim() 
    ? filterSongs(disabledSongsArray, searchTerm) as DisabledSong[]
    : disabledSongsArray;

  const handleToggleSetting = async (setting: string, value: boolean) => {
    debugLog(`Toggle ${setting} to ${value}`);
    const controllerName = controllerNameRedux;
    if (controllerName) {
      await settingsService.updateSetting(controllerName, setting, value);
      dispatch(updateController({
        controllerName,
        updates: {
          player: {
            ...existingPlayer,
            settings: {
              ...existingPlayer.settings,
              [setting]: value
            }
          }
        }
      }));
    }
  };

  const handleToggleDebug = (enabled: boolean) => {
    setDebugEnabled(enabled);
  };

  const handleRemoveDisabledSong = async (song: DisabledSong) => {
    // Create a minimal song object with the path for removal
    const songForRemoval: Song = {
      path: song.path,
      artist: song.artist,
      title: song.title,
      key: song.key,
    };
    await removeDisabledSong(songForRemoval);
  };

  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p className="text-gray-500">Admin access required to view settings.</p>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 settings-container">
        {/* Player Settings */}
        <div className="mb-8">
          <h2 className="text-large font-semibold mb-4">Player Settings</h2>
                                  <IonList className="rounded-lg overflow-hidden">
              <IonItem>
                <IonLabel>Auto Advance</IonLabel>
                <IonToggle
                  slot="end"
                  checked={playerSettings?.autoadvance || false}
                  onIonChange={(e) => handleToggleSetting('autoadvance', e.detail.checked)}
                />
              </IonItem>
              <IonItem>
                <IonLabel>User Pick</IonLabel>
                <IonToggle
                  slot="end"
                  checked={playerSettings?.userpick || false}
                  onIonChange={(e) => handleToggleSetting('userpick', e.detail.checked)}
                />
              </IonItem>
              <IonItem>
                <IonLabel>Show Toasts</IonLabel>
                <IonToggle
                  slot="end"
                  checked={playerSettings?.showToasts ?? true}
                  onIonChange={(e) => handleToggleSetting('showToasts', e.detail.checked)}
                />
              </IonItem>
              <IonItem>
                <IonLabel>Debug Logging</IonLabel>
                <IonToggle
                  slot="end"
                  checked={isDebugEnabled()}
                  onIonChange={(e) => handleToggleDebug(e.detail.checked)}
                />
              </IonItem>
            </IonList>
        </div>

        {/* Disabled Songs Management */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Disabled Songs Management</h2>
            <IonButton
              fill="outline"
              onClick={() => setShowDisabledSongsModal(true)}
              disabled={loading}
            >
              <IonIcon icon={ban} slot="start" />
              Manage Disabled Songs ({disabledSongsArray.length})
            </IonButton>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">
              Songs marked as disabled will be hidden from search results, favorites, and other song lists.
            </p>
            <p className="text-sm text-gray-600">
              Use the search page to mark individual songs as disabled, or manage all disabled songs here.
            </p>
          </div>
        </div>
      </div>

        {/* Disabled Songs Modal */}
        <IonModal 
          isOpen={showDisabledSongsModal} 
          onDidDismiss={() => setShowDisabledSongsModal(false)}
          breakpoints={[0, 0.5, 0.8]}
          initialBreakpoint={0.8}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>Disabled Songs ({filteredDisabledSongs.length})</IonTitle>
              <div slot="end">
                <ActionButton
                  onClick={() => setShowDisabledSongsModal(false)}
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
            <div className="p-4">
              {/* Search */}
              <IonSearchbar
                placeholder="Search disabled songs..."
                value={searchTerm}
                onIonInput={(e) => setSearchTerm(e.detail.value || '')}
                debounce={300}
                showClearButton="focus"
              />
            </div>

            {/* Disabled Songs List */}
            <InfiniteScrollList<DisabledSong>
              items={filteredDisabledSongs}
              isLoading={loading}
              hasMore={false}
              onLoadMore={() => {}}
              renderItem={(song) => (
                <div className="flex items-center">
                  <div className="flex-1">
                    <SongItem
                      song={song}
                      context="history"
                      showDeleteButton={true}
                      showInfoButton={false}
                      showAddButton={false}
                      showFavoriteButton={false}
                      onDeleteItem={() => handleRemoveDisabledSong(song)}
                      showFullPath={true}
                    />
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    {/* Delete button is now handled by SongItem */}
                  </div>
                </div>
              )}
              emptyTitle="No disabled songs"
              emptyMessage="Songs marked as disabled will appear here"
              loadingTitle="Loading disabled songs..."
              loadingMessage="Please wait while disabled songs are being loaded"
            />
          </IonContent>
        </IonModal>
      </>
    );
};

export default Settings; 