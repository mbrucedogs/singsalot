import React from 'react';
import { IonHeader, IonToolbar, IonTitle, IonList, IonItem, IonLabel, IonItemSliding, IonItemOptions, IonItemOption, IonIcon, IonChip } from '@ionic/react';
import { people, trash, time } from 'ionicons/icons';
import { EmptyState } from '../../components/common';
import { useSingers } from '../../hooks';
import { useAppSelector } from '../../redux';
import { selectSingers } from '../../redux';
import { formatDate } from '../../utils/dataProcessing';

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

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            Singers
            <IonChip color="primary" className="ml-2">
              {singers.length}
            </IonChip>
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <div className="p-4">
        <p className="text-sm text-gray-600 mb-4">
          {singers.length} singer{singers.length !== 1 ? 's' : ''} in the party
        </p>
        
        {/* Debug info */}
        <div className="mb-4 text-sm text-gray-500">
          Singers loaded: {singersCount}
        </div>

        {/* Singers List */}
        <div className="bg-white rounded-lg shadow">
          {singersCount === 0 ? (
            <EmptyState
              title="No singers yet"
              message="Singers will appear here when they join the party"
              icon={
                <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              }
            />
          ) : singers.length === 0 ? (
            <EmptyState
              title="Loading singers..."
              message="Please wait while singers data is being loaded"
              icon={
                <svg className="h-12 w-12 text-gray-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              }
            />
          ) : (
            <IonList>
              {singers.map((singer) => (
                <IonItemSliding key={singer.key}>
                  <IonItem>
                    <IonIcon icon={people} slot="start" color="primary" />
                    <IonLabel>
                      <h3 className="text-sm font-medium text-gray-900">
                        {singer.name}
                      </h3>
                      <div className="flex items-center mt-1">
                        <IonChip color="medium">
                          <IonIcon icon={time} />
                          {formatDate(singer.lastLogin)}
                        </IonChip>
                      </div>
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
              ))}
            </IonList>
          )}
        </div>
      </div>
    </>
  );
};

export default Singers; 