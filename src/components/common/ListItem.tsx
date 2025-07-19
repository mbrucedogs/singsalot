import React from 'react';
import { IonItem, IonIcon, IonChip } from '@ionic/react';
import { TwoLineDisplay } from './TwoLineDisplay';

interface ListItemProps {
  primaryText: string;
  secondaryText: string;
  onClick?: () => void;
  icon?: string;
  iconColor?: string;
  className?: string;
  showNumber?: boolean;
  number?: number;
  endContent?: React.ReactNode;
  chip?: string;
  chipColor?: string;
  disabled?: boolean;
}

export const ListItem: React.FC<ListItemProps> = ({
  primaryText,
  secondaryText,
  onClick,
  icon,
  iconColor = 'primary',
  className = '',
  showNumber = false,
  number,
  endContent,
  chip,
  chipColor = 'primary',
  disabled = false
}) => {
  const itemClassName = `list-item ${className}`.trim();
  
  // Determine end content
  let finalEndContent = endContent;
  if (!finalEndContent) {
    if (chip) {
      finalEndContent = (
        <>
          <IonChip color={chipColor}>
            {chip}
          </IonChip>
          {icon && <IonIcon icon={icon} color={iconColor} />}
        </>
      );
    } else if (icon) {
      finalEndContent = <IonIcon icon={icon} color={iconColor} />;
    }
  }
  
  return (
    <IonItem 
      button={!!onClick && !disabled}
      onClick={onClick}
      detail={false}
      className={itemClassName}
      style={{ '--min-height': '60px' }}
    >
      {/* Number (if enabled) */}
      {showNumber && (
        <div slot="start" className="ion-text-center" style={{ marginLeft: '-8px', marginRight: '12px' }}>
          <div className="ion-text-bold ion-color-medium" style={{ fontSize: '1rem', minWidth: '2rem' }}>
            {number}
          </div>
        </div>
      )}

      {/* Main content */}
      <TwoLineDisplay
        primaryText={primaryText}
        secondaryText={secondaryText}
        primaryColor={disabled ? 'var(--ion-color-medium)' : undefined}
        secondaryColor={disabled ? 'var(--ion-color-light)' : undefined}
      />

      {/* End content - render directly without wrapper div */}
      {finalEndContent}
    </IonItem>
  );
}; 