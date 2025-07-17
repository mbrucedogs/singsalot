import React, { useState } from 'react';
import { IonToast } from '@ionic/react';
import type { ToastProps } from '../../types';

const Toast: React.FC<ToastProps> = ({ 
  message, 
  type = 'info', 
  duration = 3000, 
  onClose 
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleDismiss = () => {
    setIsOpen(false);
    onClose();
  };

  const getColor = () => {
    switch (type) {
      case 'success':
        return 'success';
      case 'error':
        return 'danger';
      case 'info':
      default:
        return 'primary';
    }
  };

  return (
    <IonToast
      isOpen={isOpen}
      onDidDismiss={handleDismiss}
      message={message}
      duration={duration}
      color={getColor()}
      position="top"
      buttons={[
        {
          text: '×',
          role: 'cancel',
          handler: handleDismiss
        }
      ]}
    />
  );
};

export default Toast; 