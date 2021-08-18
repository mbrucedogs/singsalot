import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import { ActionButton } from './ActionButton';

interface EndButton {
  onClick: () => void;
  ios: string,
  standard: string
}

interface PageProps {
  name: String,
  children?: JSX.Element;
  endButton?: EndButton;
}

export const Page = ({ name, children, endButton }: PageProps) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          {endButton && <IonButtons slot="end" style={{ paddingRight: '10px' }}>
            <ActionButton
              onClick={endButton.onClick}
              imageOutline={endButton.ios}
              image={endButton.standard}
            />
          </IonButtons>
          }
          <IonTitle style={{ paddingLeft: '5px', paddingTop: '10px' }}>{name}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <>
          {children}
        </>
      </IonContent>
    </IonPage>
  );
};

export default Page;

