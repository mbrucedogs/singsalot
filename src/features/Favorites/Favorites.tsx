import React, { useState } from 'react';
import { InfiniteScrollList, SongItem, SongInfo } from '../../components/common';
import { useFavorites } from '../../hooks';
import { useAppSelector } from '../../redux';
import { selectFavorites } from '../../redux';
import { debugLog } from '../../utils/logger';
import type { Song } from '../../types';

const Favorites: React.FC = () => {
  const {
    favoritesItems,
    hasMore,
    loadMore,
    handleToggleFavorite,
  } = useFavorites();

  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isSongInfoOpen, setIsSongInfoOpen] = useState(false);

  const favorites = useAppSelector(selectFavorites);
  const favoritesCount = Object.keys(favorites).length;

  // Debug logging
  debugLog('Favorites component - favorites count:', favoritesCount);
  debugLog('Favorites component - favorites items:', favoritesItems);

  const handleSongInfo = (song: Song) => {
    setSelectedSong(song);
    setIsSongInfoOpen(true);
  };

  const handleCloseSongInfo = () => {
    setIsSongInfoOpen(false);
    setSelectedSong(null);
  };

  return (
    <>
      <InfiniteScrollList<Song>
        items={favoritesItems}
        isLoading={favoritesCount === 0}
        hasMore={hasMore}
        onLoadMore={loadMore}
        renderItem={(song) => (
          <SongItem
            song={song}
            context="favorites"
            showInfoButton={true}
            showAddButton={false}
            showDeleteButton={true}
            onSelectSinger={() => handleSongInfo(song)}
            onDeleteItem={() => handleToggleFavorite(song)}
          />
        )}
        emptyTitle="No favorites yet"
        emptyMessage="Add songs to your favorites to see them here"
        loadingTitle="Loading favorites..."
        loadingMessage="Please wait while favorites data is being loaded"
      />

      {/* Song Info Modal */}
      {selectedSong && (
        <SongInfo
          isOpen={isSongInfoOpen}
          onClose={handleCloseSongInfo}
          song={selectedSong}
        />
      )}
    </>
  );
};

export default Favorites; 