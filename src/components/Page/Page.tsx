import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonSearchbar } from '@ionic/react';
import { useParams, useHistory } from 'react-router';
import React, { KeyboardEvent, useState } from 'react';
import './Page.css';

interface ContainerProps {
  children?: JSX.Element;
}
//
const Page: React.FC<ContainerProps> = ( { children = null} ) => {

  const history = useHistory();
  const { name } = useParams<{ name: string; }>();
  const [searchText, setSearchText] = useState('');

  const handleLoginKeyUp = (e: KeyboardEvent<HTMLIonSearchbarElement>) => {
    let key = e.key;
    console.log("handleKeyup", key);
    if(key === 'Enter'){
      history.push(`/page/Search/${searchText}`);
      setSearchText('');
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
        <div className="container">
          {children}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Page;

