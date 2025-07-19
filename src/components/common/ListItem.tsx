import React from 'react';
import { IonItem, IonIcon, IonChip } from '@ionic/react';
import { TwoLineDisplay } from './TwoLineDisplay';
import { NumberDisplay } from './NumberDisplay';

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
  // Additional IonItem props that can be passed through
  slot?: string;
  detail?: boolean;
  button?: boolean;
  style?: React.CSSProperties;
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
  disabled = false,
  slot,
  detail = false,
  button,
  style
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
      button={button !== undefined ? button : (!!onClick && !disabled)}
      onClick={onClick}
      detail={detail}
      className={itemClassName}
      style={{ '--min-height': '60px', ...style }}
      slot={slot}
    >
      {/* Number (if enabled) */}
      {showNumber && (
        <NumberDisplay number={number!} />
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