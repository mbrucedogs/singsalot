import React from 'react';
import { IonHeader, IonToolbar, IonTitle } from '@ionic/react';
import { ActionButton } from './index';
import { ActionButtonVariant, ActionButtonSize, ActionButtonIconSlot } from '../../types';
import { Icons } from '../../constants';

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
  className?: string;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({ 
  title, 
  onClose, 
  className = '' 
}) => {
  return (
    <IonHeader className={className}>
      <IonToolbar>
        <IonTitle>{title}</IonTitle>
        <div slot="end">
          <ActionButton
            onClick={onClose}
            variant={ActionButtonVariant.SECONDARY}
            size={ActionButtonSize.SMALL}
            icon={Icons.CLOSE}
            iconSlot={ActionButtonIconSlot.ICON_ONLY}
            fill="clear"
            aria-label={`Close ${title} modal`}
          />
        </div>
      </IonToolbar>
    </IonHeader>
  );
}; 