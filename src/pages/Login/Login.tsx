import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useState } from 'react';
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import { personCircle } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { IonItem, IonLabel, IonInput, IonButton, IonIcon, IonAlert } from '@ionic/react';
import './Login.css';

const Login: React.FC = () => {
    const history = useHistory();
    const [partyId, setPartyId] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [iserror, setIserror] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const handleLogin = () => {
        if (!partyId) {
            setMessage("Please enter a valid partyId");
            setIserror(true);
            return;
        }

        if (!firstName || firstName.length < 6) {
            setMessage("Please enter your First Name");
            setIserror(true);
            return;
        }

        const loginData = {
            "partyId": partyId,
            "firstName": firstName
        }

    };

    return (
        <IonPage>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large" className="title">Login</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <div className="wrapper"> asdf
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
