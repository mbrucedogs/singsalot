import React, { useState } from 'react';
import { 
  IonModal, 
  IonContent, 
  IonList, 
  IonItem, 
  IonLabel
} from '@ionic/react';
import { useAppSelector } from '../../redux';
import { selectSingersArray, selectControllerName, selectQueueObject } from '../../redux';
import { queueService } from '../../firebase/services';
import { useToast } from '../../hooks/useToast';
import { ModalHeader } from './ModalHeader';
import type { Song, Singer, QueueItem } from '../../types';

interface SelectSingerProps {
  isOpen: boolean;
  onClose: () => void;
  song: Song;
}

const SelectSinger: React.FC<SelectSingerProps> = ({ isOpen, onClose, song }) => {
  const singers = useAppSelector(selectSingersArray);
  const controllerName = useAppSelector(selectControllerName);
  const currentQueue = useAppSelector(selectQueueObject);
  const { showSuccess, showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectSinger = async (singer: Singer) => {
    if (!controllerName) {
      showError('Controller not found');
      return;
    }

    setIsLoading(true);
    try {
      // Calculate the next order by finding the highest order value and adding 1
      const queueItems = Object.values(currentQueue) as QueueItem[];
      const maxOrder = queueItems.length > 0 
        ? Math.max(...queueItems.map(item => item.order || 0))
        : 0;
      const nextOrder = maxOrder + 1;

      const queueItem: Omit<QueueItem, 'key'> = {
        order: nextOrder,
        singer: {
          name: singer.name,
          lastLogin: singer.lastLogin,
        },
        song: song,
      };

      await queueService.addToQueue(controllerName, queueItem);
      showSuccess(`${song.title} added to queue for ${singer.name}`);
      onClose();
    } catch (error) {
      console.error('Failed to add song to queue:', error);
      showError('Failed to add song to queue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IonModal 
      isOpen={isOpen} 
      onDidDismiss={onClose}
      breakpoints={[0, 0.5, 0.8]}
      initialBreakpoint={0.8}
      keepContentsMounted={false}
      backdropDismiss={true}
    >
                    <ModalHeader title="Select Singer" onClose={onClose} />
      
      <IonContent>
        {/* Song Information */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-2">{song.title}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-1">{song.artist}</p>
          <p className="text-xs text-gray-500 dark:text-gray-500">{song.path}</p>
        </div>

        {/* Singers List */}
        <IonList>
          {singers.map((singer) => (
            <IonItem 
              key={singer.key} 
              button 
              onClick={() => handleSelectSinger(singer)}
              disabled={isLoading}
            >
              <IonLabel>
                <h2>{singer.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Last login: {new Date(singer.lastLogin).toLocaleDateString()}
                </p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>

        {singers.length === 0 && (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            No singers available
          </div>
        )}
      </IonContent>
    </IonModal>
  );
};

export default SelectSinger; 