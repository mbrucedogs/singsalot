import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonSearchbar } from '@ionic/react';
import { useHistory } from 'react-router';
import React, { KeyboardEvent, useState } from 'react';
import { isPlatform } from '@ionic/react';

interface ContainerProps {
  name: String,
  children?: JSX.Element;
}
//
const Page: React.FC<ContainerProps> = ({ name, children = null }) => {

  const history = useHistory();
 
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{isPlatform('ios') ? '' : name}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{name}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <>
          {children}
        </>
      </IonContent>
    </IonPage>
  );
};

export default Page;

