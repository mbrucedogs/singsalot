import React from 'react';
import { IonLabel } from '@ionic/react';

interface TwoLineDisplayProps {
  primaryText: string;
  secondaryText: string;
  primaryColor?: string;
  secondaryColor?: string;
  primarySize?: string;
  secondarySize?: string;
}

// Two Line Display Component
// NOTE: This component should match the styling of the first two lines (title and artist) in SongInfoDisplay
// If you change the styling here, also update SongInfoDisplay to keep them in sync
export const TwoLineDisplay: React.FC<TwoLineDisplayProps> = ({
  primaryText,
  secondaryText,
  primaryColor = 'var(--ion-color-dark)',
  secondaryColor = 'var(--ion-color-medium)',
  primarySize = '1rem',
  secondarySize = '0.875rem'
}) => {
  return (
    <IonLabel>
      {/* Primary Text - styled like song title */}
      <div 
        className="ion-text-bold"
        style={{ 
          fontWeight: 'bold', 
          fontSize: primarySize, 
          color: primaryColor,
          lineHeight: '1.5',
          marginBottom: '4px'
        }}
      >
        {primaryText}
      </div>
      {/* Secondary Text - styled like artist name */}
      <div 
        className="ion-text-italic ion-color-medium"
        style={{ 
          fontSize: secondarySize, 
          fontStyle: 'italic', 
          color: secondaryColor,
          lineHeight: '1.5'
        }}
      >
        {secondaryText}
      </div>
    </IonLabel>
  );
}; 