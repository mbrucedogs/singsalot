import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useState } from 'react';
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import { personCircle } from "ionicons/icons";
import { IonItem, IonLabel, IonInput, IonButton, IonIcon, IonAlert } from '@ionic/react';
import './Login.css';

interface ContainerProps {
    onLogin: (controllerId:string, singerName: string)=>Promise<boolean>;
}
  
const Login: React.FC<ContainerProps> = ({onLogin}) => {
    const [partyId, setPartyId] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [iserror, setIserror] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const handleLogin = () => {
        if (!partyId) {
            setMessage("Please enter a valid Party Id");
            setIserror(true);
            return;
        }
        if (!firstName || firstName.length < 3) {
            setMessage("Please enter your First Name");
            setIserror(true);
            return;
        }

        let promise = onLogin(partyId, firstName);
        promise.then( success => {
            if(!success){
                setMessage("Your Party Id wasn't found, please try again.");
                setIserror(true);
            }
        });
    };

    return (
        <IonPage>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large" className="title">Login</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <div className="wrapper">
                    <IonGrid className="square">
                        <IonRow>
                            <IonCol>
                                <IonAlert
                                    isOpen={iserror}
                                    onDidDismiss={() => setIserror(false)}
                                    cssClass="my-custom-class"
                                    header={"Error!"}
                                    message={message}
                                    buttons={["Dismiss"]}
                                />
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonIcon
                                    style={{ fontSize: "70px", color: "#0040ff" }}
                                    icon={personCircle}
                                />
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonItem>
                                    <IonLabel position="floating">Party Id</IonLabel>
                                    <IonInput
                                        type="text"
                                        value={partyId}
                                        onIonChange={(e) => setPartyId(e.detail.value!)}
                                    >
                                    </IonInput>
                                </IonItem>
                            </IonCol>
                        </IonRow>

                        <IonRow>
                            <IonCol>
                                <IonItem>
                                    <IonLabel position="floating">FirstName</IonLabel>
                                    <IonInput
                                        type="text"
                                        value={firstName}
                                        onIonChange={(e) => setFirstName(e.detail.value!)}
                                    >
                                    </IonInput>
                                </IonItem>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonButton expand="block" onClick={handleLogin}>Login</IonButton>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </div>
            </IonContent>
        </IonPage>

    );
};

export default Login;
