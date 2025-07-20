import React, { useState } from 'react';
import { IonItem, IonLabel, IonModal, IonHeader, IonToolbar, IonTitle, IonButton, IonContent, IonInput, IonLabel as IonInputLabel } from '@ionic/react';
import { InfiniteScrollList, ActionButton, NumberDisplay } from '../../components/common';
import { useSingers } from '../../hooks';
import { useAppSelector } from '../../redux';
import { selectSingers } from '../../redux';
import { debugLog } from '../../utils/logger';
import type { Singer } from '../../types';
import { ActionButtonVariant, ActionButtonSize, ActionButtonIconSlot } from '../../types';
import { Icons } from '../../constants';

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
  debugLog('Singers component - singers count:', singersCount);
  debugLog('Singers component - singers:', singers);

  // Render singer item for InfiniteScrollList
  const renderSingerItem = (singer: Singer, index: number) => (
    <IonItem detail={false} style={{ '--padding-start': '0px', '--min-height': '60px' }}>
      {/* Order Number */}
      <NumberDisplay number={index + 1} />

      {/* Singer Name */}
      <IonLabel>
        <div className="ion-text-bold ion-color-primary" style={{ lineHeight: '1.5', fontSize: '1rem' }}>
          {singer.name}
        </div>
      </IonLabel>

      {/* Delete Button (Admin Only) */}
      {isAdmin && (
        <div slot="end" style={{ marginRight: '-16px' }}>
          <ActionButton
            onClick={() => handleRemoveSinger(singer)}
            variant={ActionButtonVariant.DANGER}
            size={ActionButtonSize.SMALL}
            icon={Icons.TRASH}
            iconSlot={ActionButtonIconSlot.ICON_ONLY}
          />
        </div>
      )}
    </IonItem>
  );

  return (
    <>
      <div className="ion-padding ion-text-end">
        {isAdmin && (
          <ActionButton
            onClick={handleOpenAddModal}
            variant={ActionButtonVariant.PRIMARY}
            size={ActionButtonSize.SMALL}
            icon={Icons.ADD}
            iconSlot={ActionButtonIconSlot.ICON_ONLY}
            fill="clear"
          />
        )}
      </div>

      <div className="ion-padding">
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
          showItemCount={false}
        />
      </div>

      {/* Add Singer Modal */}
      <IonModal 
        isOpen={showAddModal} 
        onDidDismiss={handleCloseAddModal}
        breakpoints={[0, 0.5, 0.8]}
        initialBreakpoint={0.8}
      >
        <IonHeader>
          <IonToolbar>
            <IonTitle>Add New Singer</IonTitle>
            <ActionButton
              onClick={handleCloseAddModal}
              variant={ActionButtonVariant.SECONDARY}
              size={ActionButtonSize.SMALL}
              icon={Icons.CLOSE}
              iconSlot={ActionButtonIconSlot.ICON_ONLY}
            />
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