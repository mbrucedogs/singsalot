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
  const [searchText, setSearchText] = useState('');

  const handleLoginKeyUp = (e: KeyboardEvent<HTMLIonSearchbarElement>) => {
    let key = e.key;
    console.log("handleKeyup", key);
    if (key === 'Enter') {
      history.push(`/Search/${searchText}`);
    }
  }
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonSearchbar onKeyUp={handleLoginKeyUp} value={searchText} onIonChange={(e) => setSearchText(e.detail.value!)} ></IonSearchbar>
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

