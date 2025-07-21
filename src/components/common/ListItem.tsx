import React, { forwardRef, useMemo } from 'react';
import { IonItem, IonLabel, IonIcon } from '@ionic/react';
import { chevronForward } from 'ionicons/icons';
import type { Song } from '../../types';
import { NumberDisplay } from './NumberDisplay';

// Generic ListItem interface for different types of data
interface GenericListItemProps {
  primaryText: string;
  secondaryText?: string;
  onClick?: () => void;
  showChevron?: boolean;
  className?: string;
  children?: React.ReactNode;
  showNumber?: boolean;
  number?: number;
  slot?: string;
  detail?: boolean;
  button?: boolean;
  style?: React.CSSProperties;
  endContent?: React.ReactNode;
  showSeparator?: boolean;
}

// Song-specific ListItem interface
interface SongListItemProps {
  song: Song;
  onClick?: () => void;
  showPath?: boolean;
  showCount?: boolean;
  showChevron?: boolean;
  className?: string;
  children?: React.ReactNode;
}

// Utility function to extract filename from path
const extractFilename = (path: string): string => {
  if (!path) return '';
  
  // Handle different path separators (Windows backslash, Unix forward slash)
  const normalizedPath = path.replace(/\\/g, '/');
  const parts = normalizedPath.split('/');
  return parts[parts.length - 1] || '';
};

// Generic ListItem component for different types of data
export const ListItem = React.memo(forwardRef<HTMLIonItemElement, GenericListItemProps>(({
  primaryText,
  secondaryText,
  onClick,
  showChevron = false,
  className = '',
  children,
  showNumber = false,
  number,
  slot,
  detail = false,
  button = false,
  style,
  endContent,
  showSeparator, // keep for API compatibility, but not used
}, ref) => {
  return (
    <IonItem
      ref={ref}
      className={className}
      onClick={onClick}
      button={button || !!onClick}
      detail={detail}
      slot={slot}
      style={{
        ...style,
        minHeight: '60px',
        '--padding-start': '16px', // Add left padding for classic Ionic look
        '--min-height': '60px',
      }}
    >
      {/* Number (if enabled) */}
      {showNumber && number !== undefined && (
        <NumberDisplay number={number} />
      )}
      {/* Main content */}
      <IonLabel>
        <div style={{ fontWeight: 'bold', fontSize: '1rem', color: 'var(--ion-color-dark)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', wordBreak: 'break-word' }}>
          {primaryText}
        </div>
        {secondaryText && (
          <div style={{ fontSize: '0.875rem', fontStyle: 'italic', color: 'var(--ion-color-medium)', overflow: 'hidden', textOverflow: 'ellipsis', wordBreak: 'break-word' }}>
            {secondaryText}
          </div>
        )}
      </IonLabel>
      {/* End content */}
      {children && <div style={{ flex: '0 0 auto', marginRight: 8 }}>{children}</div>}
      {endContent && <div style={{ flex: '0 0 auto' }}>{endContent}</div>}
      {showChevron && (
        <IonIcon
          slot="end"
          icon={chevronForward}
          className="ion-color-medium"
        />
      )}
    </IonItem>
  );
}));

// Song-specific ListItem component
export const SongListItem = React.memo(forwardRef<HTMLIonItemElement, SongListItemProps>(({
  song,
  onClick,
  showPath = false,
  showCount = false,
  showChevron = false,
  className = '',
  children
}, ref) => {
  // Memoize the filename extraction
  const filename = useMemo(() => extractFilename(song.path), [song.path]);

  return (
    <IonItem 
      ref={ref}
      className={className}
      onClick={onClick}
      button={!!onClick}
    >
      <IonLabel>
        <div 
          className="ion-text-bold"
          style={{ 
            fontWeight: 'bold', 
            fontSize: '1rem', 
            color: 'var(--ion-color-dark)',
            marginBottom: '4px'
          }}
        >
          {song.title}
        </div>
        <div 
          className="ion-text-italic ion-color-medium"
          style={{ 
            fontSize: '0.875rem', 
            fontStyle: 'italic', 
            color: 'var(--ion-color-medium)',
            marginBottom: '4px'
          }}
        >
          {song.artist}
        </div>
        {/* Show filename if showPath is true */}
        {showPath && song.path && (
          <div 
            className="ion-text-sm ion-color-medium"
            style={{ 
              fontSize: '0.75rem', 
              color: 'var(--ion-color-medium)'
            }}
          >
            {filename}
          </div>
        )}
        {/* Show play count if showCount is true */}
        {showCount && song.count && (
          <div 
            className="ion-text-sm ion-color-medium"
            style={{ 
              fontSize: '0.75rem', 
              color: 'var(--ion-color-medium)'
            }}
          >
            Played {song.count} times
          </div>
        )}
      </IonLabel>
      
      {children}
      
      {showChevron && (
        <IonIcon 
          slot="end" 
          icon={chevronForward} 
          className="ion-color-medium"
        />
      )}
    </IonItem>
  );
}));

ListItem.displayName = 'ListItem';
SongListItem.displayName = 'SongListItem';

export default ListItem; 