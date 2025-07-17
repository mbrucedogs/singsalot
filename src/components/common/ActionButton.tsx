import React from 'react';
import { IonButton } from '@ionic/react';
import type { ActionButtonProps } from '../../types';

const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = ''
}) => {
  const getVariant = () => {
    switch (variant) {
      case 'primary':
        return 'primary';
      case 'secondary':
        return 'medium';
      case 'danger':
        return 'danger';
      default:
        return 'primary';
    }
  };

  const getSize = () => {
    switch (size) {
      case 'sm':
        return 'small';
      case 'md':
        return 'default';
      case 'lg':
        return 'large';
      default:
        return 'default';
    }
  };

  return (
    <IonButton
      onClick={onClick}
      disabled={disabled}
      fill="solid"
      color={getVariant()}
      size={getSize()}
      className={className}
    >
      {children}
    </IonButton>
  );
};

export default ActionButton; 