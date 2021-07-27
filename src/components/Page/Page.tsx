import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonSearchbar } from '@ionic/react';
import { useHistory } from 'react-router';
import React, { KeyboardEvent, useState } from 'react';
import './Page.css';

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
          <IonSearchbar onKeyUp={handleLoginKeyUp} value={searchText} onIonChange={(e) => setSearchText(e.detail.value!)} ></IonSearchbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{name}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{name}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {children}
        </IonContent>
      </IonContent>
    </IonPage>
  );
};

export default Page;

