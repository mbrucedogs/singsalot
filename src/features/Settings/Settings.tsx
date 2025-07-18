import React, { useState } from 'react';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonToggle, IonButton, IonIcon, IonModal, IonSearchbar } from '@ionic/react';
import { ban, trash } from 'ionicons/icons';
import { useAppSelector } from '../../redux';
import { selectIsAdmin, selectSettings } from '../../redux';
import { useDisabledSongs } from '../../hooks';
import { InfiniteScrollList, ActionButton } from '../../components/common';
import { filterSongs } from '../../utils/dataProcessing';
import { setDebugEnabled, isDebugEnabled, debugLog } from '../../utils/logger';
import type { Song } from '../../types';

interface DisabledSongDisplay {
  key?: string;
  path: string;
  artist: string;
  title: string;
  disabledAt: string;
}

const Settings: React.FC = () => {
  const isAdmin = useAppSelector(selectIsAdmin);
  const playerSettings = useAppSelector(selectSettings);
  const { 
    disabledSongs, 
    loading, 
    removeDisabledSong
  } = useDisabledSongs();
  
  const [showDisabledSongsModal, setShowDisabledSongsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Convert disabled songs object to array for display
  const disabledSongsArray: DisabledSongDisplay[] = Object.entries(disabledSongs).map(([key, disabledSong]) => ({
    key: disabledSong.key || key,
    path: disabledSong.path,
    artist: disabledSong.artist,
    title: disabledSong.title,
    disabledAt: disabledSong.disabledAt,
  }));

  // Filter disabled songs by search term
  const filteredDisabledSongs: DisabledSongDisplay[] = searchTerm.trim() 
    ? filterSongs(disabledSongsArray, searchTerm) as DisabledSongDisplay[]
    : disabledSongsArray;

  const handleToggleSetting = async (setting: string, value: boolean) => {
    // This would need to be implemented with the settings service
    debugLog(`Toggle ${setting} to ${value}`);
  };

  const handleToggleDebug = (enabled: boolean) => {
    setDebugEnabled(enabled);
  };

  const handleRemoveDisabledSong = async (song: DisabledSongDisplay) => {
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
              <IonButton 
                slot="end" 
                fill="clear" 
                onClick={() => setShowDisabledSongsModal(false)}
              >
                Close
              </IonButton>
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
            <InfiniteScrollList<DisabledSongDisplay>
              items={filteredDisabledSongs}
              isLoading={loading}
              hasMore={false}
              onLoadMore={() => {}}
              renderItem={(song) => (
                <IonItem>
                  <IonLabel>
                    <h3 className="text-sm font-medium text-gray-900">
                      {song.title || 'Unknown Title'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {song.artist || 'Unknown Artist'}
                    </p>
                    <p className="text-xs text-gray-400 break-words">
                      {song.path}
                    </p>
                    <p className="text-xs text-gray-400">
                      Disabled: {new Date(song.disabledAt || '').toLocaleDateString()}
                    </p>
                  </IonLabel>
                  
                  <div slot="end" className="flex items-center gap-2 ml-2">
                    <div onClick={(e) => e.stopPropagation()}>
                      <ActionButton
                        onClick={() => handleRemoveDisabledSong(song)}
                        variant="danger"
                        size="sm"
                      >
                        <IonIcon icon={trash} />
                      </ActionButton>
                    </div>
                  </div>
                </IonItem>
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