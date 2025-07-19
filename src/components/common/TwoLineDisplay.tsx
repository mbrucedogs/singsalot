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

export const TwoLineDisplay: React.FC<TwoLineDisplayProps> = ({
  primaryText,
  secondaryText,
  primaryColor = 'black',
  secondaryColor = '#6b7280',
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
          lineHeight: '1.5'
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