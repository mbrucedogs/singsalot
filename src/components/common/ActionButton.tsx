import React from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import type { ActionButtonProps } from '../../types';
import { ActionButtonVariant, ActionButtonSize, ActionButtonIconSlot, ActionButtonIconSize } from '../../types';

const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  children,
  variant = ActionButtonVariant.PRIMARY,
  size = ActionButtonSize.MEDIUM,
  disabled = false,
  className = '',
  icon,
  iconSlot = ActionButtonIconSlot.START,
  iconSize = ActionButtonIconSize.LARGE,
  fill = 'solid',
  'aria-label': ariaLabel
}) => {
  const getVariant = () => {
    switch (variant) {
      case ActionButtonVariant.PRIMARY:
        return 'primary';
      case ActionButtonVariant.SECONDARY:
        return 'medium';
      case ActionButtonVariant.DANGER:
        return 'danger';
      default:
        return 'primary';
    }
  };

  const getSize = () => {
    switch (size) {
      case ActionButtonSize.SMALL:
        return 'small';
      case ActionButtonSize.MEDIUM:
        return 'default';
      case ActionButtonSize.LARGE:
        return 'large';
      default:
        return 'default';
    }
  };

  const isIconOnly = icon && iconSlot === ActionButtonIconSlot.ICON_ONLY && !children;
  
  return (
    <IonButton
      onClick={onClick}
      disabled={disabled}
      fill={fill}
      color={getVariant()}
      size={getSize()}
      className={className}
      aria-label={ariaLabel}
      style={{
        minWidth: isIconOnly ? '40px' : '40px',
        minHeight: '40px',
        width: isIconOnly ? '40px' : 'auto',
        height: isIconOnly ? '40px' : 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isIconOnly ? '0' : undefined
      }}
    >
      {icon && <IonIcon 
        icon={icon} 
        slot={iconSlot} 
        size={typeof iconSize === 'number' ? undefined : iconSize}
        style={typeof iconSize === 'number' ? { fontSize: `${iconSize}px` } : undefined}
      />}
      {children}
    </IonButton>
  );
};

export default ActionButton; 