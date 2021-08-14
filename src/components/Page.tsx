import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';

interface EndButton {
  onClick: () => void;
  ios: string,
  standard: string,
  buttonText?: string
}

interface ContainerProps {
  name: String,
  children?: JSX.Element;
  endButton?: EndButton;
}

export const Page: React.FC<ContainerProps> = ({ name, children = null, endButton = null }) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          {endButton && <IonButtons slot="end"style={{ paddingRight: '10px' }}>
            <IonButton onClick={endButton.onClick}>
              <IonIcon
                size="large"
                ios={endButton.ios}
                md={endButton.standard} slot="end">{endButton.buttonText}</IonIcon>
            </IonButton>
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

