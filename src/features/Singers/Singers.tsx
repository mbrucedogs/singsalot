import React, { useState } from 'react';
import { IonItem, IonLabel, IonIcon, IonModal, IonHeader, IonToolbar, IonTitle, IonButton, IonContent, IonInput, IonLabel as IonInputLabel } from '@ionic/react';
import { trash, add, close } from 'ionicons/icons';
import { InfiniteScrollList, ActionButton } from '../../components/common';
import { useSingers } from '../../hooks';
import { useAppSelector } from '../../redux';
import { selectSingers } from '../../redux';
import type { Singer } from '../../types';

const Singers: React.FC = () => {
  const {
    singers,
    isAdmin,
    handleRemoveSinger,
    handleAddSinger,
  } = useSingers();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newSingerName, setNewSingerName] = useState('');

  const singersData = useAppSelector(selectSingers);

  const handleOpenAddModal = () => {
    setShowAddModal(true);
    setNewSingerName('');
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewSingerName('');
  };

  const handleSubmitAddSinger = async () => {
    if (newSingerName.trim()) {
      await handleAddSinger(newSingerName);
      handleCloseAddModal();
    }
  };
  const singersCount = Object.keys(singersData).length;

  // Debug logging
  console.log('Singers component - singers count:', singersCount);
  console.log('Singers component - singers:', singers);

  // Render singer item for InfiniteScrollList
  const renderSingerItem = (singer: Singer) => (
    <IonItem detail={false}>
      <IonLabel>
        <h3 className="text-sm font-medium text-gray-900">
          {singer.name}
        </h3>
      </IonLabel>

      {/* Delete Button (Admin Only) */}
      {isAdmin && (
        <div slot="end" className="flex items-center gap-2 ml-2">
          <div onClick={(e) => e.stopPropagation()}>
            <ActionButton
              onClick={() => handleRemoveSinger(singer)}
              variant="danger"
              size="sm"
            >
              <IonIcon icon={trash} />
            </ActionButton>
          </div>
        </div>
      )}
    </IonItem>
  );

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        {isAdmin && (
          <IonButton 
            fill="clear" 
            onClick={handleOpenAddModal}
            className="text-primary"
          >
            <IonIcon icon={add} slot="icon-only" />
          </IonButton>
        )}
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <InfiniteScrollList<Singer>
          items={singers}
          isLoading={singersCount === 0}
          hasMore={false}
          onLoadMore={() => {}}
          renderItem={renderSingerItem}
          emptyTitle="No singers yet"
          emptyMessage="Singers will appear here when they join the party"
          loadingTitle="Loading singers..."
          loadingMessage="Please wait while singers data is being loaded"
        />
      </div>

      {/* Add Singer Modal */}
      <IonModal isOpen={showAddModal} onDidDismiss={handleCloseAddModal}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Add New Singer</IonTitle>
            <IonButton slot="end" fill="clear" onClick={handleCloseAddModal}>
              <IonIcon icon={close} />
            </IonButton>
          </IonToolbar>
        </IonHeader>
        
        <IonContent className="ion-padding">
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <IonInputLabel className="bold-label">
                Singer Name
              </IonInputLabel>
              <IonInput
                className="visible-input"
                value={newSingerName}
                onIonInput={(e) => setNewSingerName(e.detail.value || '')}
                placeholder="Enter singer name"
                clearInput={true}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmitAddSinger();
                  }
                }}
              />
            </div>
            
            <div className="flex gap-2">
              <IonButton 
                expand="block" 
                onClick={handleSubmitAddSinger}
                disabled={!newSingerName.trim()}
              >
                Add Singer
              </IonButton>
              <IonButton 
                expand="block" 
                fill="outline" 
                onClick={handleCloseAddModal}
              >
                Cancel
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonModal>
    </>
  );
};

export default Singers; 