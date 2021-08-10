import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';

interface ContainerProps {
  name: String,
  children?: JSX.Element;
  endButtons?: JSX.Element;
}
//
export const Page: React.FC<ContainerProps> = ({ name, children = null, endButtons = null }) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          {endButtons}
          <IonTitle style={{paddingLeft: '5px', paddingTop: '10px'}}>{name}</IonTitle>
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

