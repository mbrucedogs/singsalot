import React from 'react';
import { IonChip } from '@ionic/react';
import { getSongCountByArtistTitle } from '../../utils/dataProcessing';
import type { Song } from '../../types';

interface SongCountDisplayProps {
  songs: Song[];
  artist: string;
  title: string;
  showLabel?: boolean;
  color?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger' | 'medium' | 'light' | 'dark';
}

export const SongCountDisplay: React.FC<SongCountDisplayProps> = ({
  songs,
  artist,
  title,
  showLabel = true,
  color = 'primary'
}) => {
  const count = getSongCountByArtistTitle(songs, artist, title);
  
  if (count === 0) {
    return null;
  }

  const label = showLabel 
    ? `${count} version${count !== 1 ? 's' : ''}`
    : count.toString();

  return (
    <IonChip 
      color={color}
    >
      {label}
    </IonChip>
  );
};

export default SongCountDisplay; 