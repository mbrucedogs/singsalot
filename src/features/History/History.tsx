import React from 'react';
import { IonHeader, IonToolbar, IonTitle, IonChip, IonIcon } from '@ionic/react';
import { time } from 'ionicons/icons';
import { InfiniteScrollList } from '../../components/common';
import { useHistory } from '../../hooks';
import { useAppSelector } from '../../redux';
import { selectHistory } from '../../redux';
import { formatDate } from '../../utils/dataProcessing';
import type { Song } from '../../types';

const History: React.FC = () => {
  const {
    historyItems,
    hasMore,
    loadMore,
    handleAddToQueue,
    handleToggleFavorite,
  } = useHistory();

  const history = useAppSelector(selectHistory);
  const historyCount = Object.keys(history).length;

  // Debug logging
  console.log('History component - history count:', historyCount);
  console.log('History component - history items:', historyItems);

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
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            Recently Played
            <IonChip color="primary" className="ml-2">
              {historyItems.length}
            </IonChip>
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <div style={{ height: '100%', overflowY: 'auto' }}>
        <InfiniteScrollList
          items={historyItems}
          isLoading={historyCount === 0}
          hasMore={hasMore}
          onLoadMore={loadMore}
          onAddToQueue={handleAddToQueue}
          onToggleFavorite={handleToggleFavorite}
          context="history"
          title=""
          subtitle=""
          emptyTitle="No history yet"
          emptyMessage="Songs will appear here after they've been played"
          loadingTitle="Loading history..."
          loadingMessage="Please wait while history data is being loaded"
          debugInfo={`History items loaded: ${historyCount}`}
          renderExtraContent={renderExtraContent}
        />
      </div>
    </>
  );
};

export default History; 