import React, { useState, useEffect } from "react";
import { pageCount } from "../globalConfig";
import Page from "../components/Page"
import ScrollingGrid from "../components/ScrollingGrid";
import { isEmpty } from "lodash";
import { SubmitHandler, useForm } from 'react-hook-form';
import { IonModal, IonHeader, IonToolbar, IonTitle, IonInput, IonButtons, IonButton, IonContent, IonItem, IonLabel, IonIcon, IonGrid, IonRow, IonCol } from "@ionic/react";
import { add, addOutline, closeOutline, close } from "ionicons/icons";
import { Singer } from "../models/Singer";
import { usePlayer } from "../hooks/usePlayer";

interface AddSingerForm {
  name: string;
}

const Singers: React.FC = () => {
  const { singers, addSinger, deleteSinger } = usePlayer();
  const pageName: string = "Singers";

  //add singer
  const [showModal, setShowModal] = useState<boolean>(false);
  const { register, handleSubmit, formState: { errors } } = useForm<AddSingerForm>();
  const [singer, setSinger] = useState<string>("");
  const [error, setError] = useState<string>("");

  const onSubmit: SubmitHandler<AddSingerForm> = data => {
    setSinger(data.name);
    if (!isEmpty(data.name)) {
      addSinger(data.name)
        .then(success => {
          if (success) {
            setShowModal(false);
            setSinger('');
            setError('');
          }
        })
        .catch(error =>{
          console.log("onAddSinger error:", error)
          setError(error)
        }
        );
    }
  };

  const onDelete = (singer: Singer) => {
    deleteSinger(singer)
      .catch(error => console.log("onDeleteSinger error:", error));
  };
  
  useEffect(() => {
    if(!showModal){
      setSinger('');
      setError('');
    }
  }, [showModal]);

  return (
    <Page name={pageName} endButtons={<IonIcon style={{ paddingRight: '20px' }} ios={addOutline} md={add} slot="end" onClick={() => setShowModal(true)}>Add</IonIcon>}>
      <>
        {isEmpty(singers) && <h2 style={{ padding: '10px' }}>Loading or there are no {pageName}...</h2>}

        {!isEmpty(singers) && (<ScrollingGrid
          pageCount={pageCount}
          pageName={pageName}
          listItems={singers}
          getRow={(singer, index) => {
            return (
              <IonGrid key={index}>
                <IonRow className="row-single">
                  <IonCol size="11">
                    <div>
                      <div style={{ flex: "1 1 auto" }}>{singer.name} ({singer.songCount})</div>
                    </div>
                  </IonCol>
                  <IonCol size="1" style={{textAlign:'center'}}>
                    <IonIcon ios={closeOutline} md={close} onClick={(e) => onDelete(singer)} />
                  </IonCol>
                </IonRow>
              </IonGrid>
            )
          }}
        />
        )
        }

        <IonModal isOpen={showModal}
          swipeToClose={true}
          presentingElement={undefined}
          onDidDismiss={() => setShowModal(false)}
          cssClass="singer-form">
          <>
            <IonHeader>
              <IonToolbar>
                <IonTitle>Add Singer</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={() => setShowModal(false)}>Close</IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <IonItem>
                  <IonLabel position="floating">Name</IonLabel>
                  <IonInput type="text" value={singer} {...register('name')}/>
                </IonItem>
                <IonItem>
                  <IonLabel style={{color: 'red'}}>{error}</IonLabel>
                </IonItem>
                <div style={{ padding: '10px' }}>
                  <IonButton expand="block" type="submit">Add Singer</IonButton>
                </div>
              </form>
            </IonContent>
          </>
        </IonModal>
      </>
    </Page>
  );
};

export default Singers;