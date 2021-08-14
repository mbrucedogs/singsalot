import React, { useState, useEffect } from "react";
import { isEmpty } from "lodash";
import { SubmitHandler, useForm } from 'react-hook-form';
import { IonModal, IonHeader, IonToolbar, IonTitle, IonInput, IonButtons, IonButton, IonContent, IonItem, IonLabel, IonIcon, IonGrid, IonRow, IonCol } from "@ionic/react";
import { add, addOutline, closeOutline, close } from "ionicons/icons";
import { pageCount } from "../globalConfig";
import { Singer } from "../models";
import { useAuthentication, usePlayer } from "../hooks";
import { Page, ScrollingGrid } from "../components"

interface AddSingerForm {
  name: string;
}

export const Singers: React.FC = () => {
  const { singers, addSinger, deleteSinger } = usePlayer();
  const { isAdmin } = useAuthentication();
  const pageName: string = "Singers";

  //add singer
  const [showModal, setShowModal] = useState<boolean>(false);
  const { register, handleSubmit } = useForm<AddSingerForm>();
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
        .catch(error => {
          //console.log("onAddSinger error:", error)
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
    if (!showModal) {
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
              <div key={index} className="row-single" style={{ padding: '10px', display: 'grid', gridTemplateColumns: 'auto 25px' }}>
                <div>
                  <div>{singer.name} ({singer.songCount})</div>
                </div>
                <div>
                  <IonIcon hidden={!isAdmin} ios={closeOutline} md={close} onClick={(e) => onDelete(singer)} />
                </div>
              </div>
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
                  <IonInput type="text" value={singer} {...register('name')} />
                </IonItem>
                <IonItem>
                  <IonLabel style={{ color: 'red' }}>{error}</IonLabel>
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