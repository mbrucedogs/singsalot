import React from 'react';
import { IonItem, IonLabel, IonIcon, IonItemSliding, IonItemOptions, IonItemOption } from '@ionic/react';
import { trash } from 'ionicons/icons';
import { InfiniteScrollList, PageHeader } from '../../components/common';
import { useSingers } from '../../hooks';
import { useAppSelector } from '../../redux';
import { selectSingers } from '../../redux';
import type { Singer } from '../../types';

const Singers: React.FC = () => {
  const {
    singers,
    isAdmin,
    handleRemoveSinger,
  } = useSingers();

  const singersData = useAppSelector(selectSingers);
  const singersCount = Object.keys(singersData).length;

  // Debug logging
  console.log('Singers component - singers count:', singersCount);
  console.log('Singers component - singers:', singers);

  // Render singer item for InfiniteScrollList
  const renderSingerItem = (singer: Singer) => (
    <IonItemSliding key={singer.key}>
      <IonItem detail={false}>
        <IonLabel>
          <h3 className="text-sm font-medium text-gray-900">
            {singer.name}
          </h3>
        </IonLabel>
      </IonItem>

      {/* Swipe to Remove (Admin Only) */}
      {isAdmin && (
        <IonItemOptions side="end">
          <IonItemOption 
            color="danger" 
            onClick={() => handleRemoveSinger(singer)}
          >
            <IonIcon icon={trash} slot="icon-only" />
          </IonItemOption>
        </IonItemOptions>
      )}
    </IonItemSliding>
  );

  return (
    <>
      <PageHeader
        title="Singers"
        subtitle={`${singersCount} singers in the party`}
      />

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
    </>
  );
};

export default Singers; 