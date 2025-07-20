import React from 'react';
import { IonChip, IonIcon } from '@ionic/react';
import { time } from 'ionicons/icons';
import { InfiniteScrollList, SongItem } from '../../components/common';
import { useHistory } from '../../hooks';
import { useAppSelector } from '../../redux';
import { selectHistory, selectIsAdmin } from '../../redux';
import { debugLog } from '../../utils/logger';
import { formatDate } from '../../utils/dataProcessing';
import type { Song } from '../../types';

const History: React.FC = () => {
  const {
    historyItems,
    hasMore,
    loadMore,
    handleAddToQueue,
    handleDeleteFromHistory,
  } = useHistory();

  const history = useAppSelector(selectHistory);
  const isAdmin = useAppSelector(selectIsAdmin);
  const historyCount = Object.keys(history).length;

  // Debug logging
  debugLog('History component - history count:', historyCount);
  debugLog('History component - history items:', historyItems);

  // Render extra content for history items (play date)
  const renderExtraContent = (item: Song) => {
    if (item.date) {
      return (
        <IonChip color="medium" className="ml-2">
          <IonIcon icon={time} />
          {formatDate(item.date)}
        </IonChip>
      );
    }
    return null;
  };

  return (
    <>
      <InfiniteScrollList<Song>
        items={historyItems}
        isLoading={historyCount === 0}
        hasMore={hasMore}
        onLoadMore={loadMore}
        renderItem={(song) => (
          <div className="flex items-center">
            <div className="flex-1">
              <SongItem
                song={song}
                context="history"
                onAddToQueue={() => handleAddToQueue(song)}
                onSelectSinger={() => {}} // Info button functionality
                onDeleteItem={() => handleDeleteFromHistory(song)}
                isAdmin={isAdmin}
                showAddButton={true}
                showInfoButton={true}
                showDeleteButton={true}
                showFavoriteButton={false}
              />
            </div>
            {renderExtraContent(song)}
          </div>
        )}
        emptyTitle="No history yet"
        emptyMessage="Songs will appear here after they've been played"
        loadingTitle="Loading history..."
        loadingMessage="Please wait while history data is being loaded"
      />
    </>
  );
};

export default History; 