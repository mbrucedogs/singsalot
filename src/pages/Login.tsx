import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useState } from 'react';
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import { micOutline } from "ionicons/icons";
import { IonItem, IonLabel, IonInput, IonButton, IonIcon, IonAlert } from '@ionic/react';
import { useLocation } from 'react-router';

interface LoginProps {
    onLogin: (isAdmin: boolean, controllerId:string, singerName: string)=>Promise<boolean>;
}
  
const Login: React.FC<LoginProps> = ({onLogin}) => {
    const [partyId, setPartyId] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [iserror, setIserror] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    let query = useQuery();
    function useQuery() {
      return new URLSearchParams(useLocation().search);
    }  
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
        setIsLoading(true);
        let q = query.get("admin") ?? "";
        let isAdmin: boolean = q ? q == "true" ? true : false : false;
        let promise = onLogin(isAdmin, partyId, firstName);
        promise.then( success => {
            if(!success){
                setMessage("Your Party Id wasn't found, please try again.");
                setIserror(true);
                setIsLoading(false);
            }
        });
    };

    return (
        <IonPage>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large" className="subtitle">Login</IonTitle>
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
                            <IonCol size="2">
                                <IonIcon
                                    style={{ fontSize: "70px", color: "#0040ff" }}
                                    icon={micOutline}
                                />
                            </IonCol>                           
                            <IonCol>
                                <h1>Sings-A-Lot</h1>
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
                            <IonCol hidden={isLoading}>
                                <IonButton expand="block" onClick={handleLogin}>Login</IonButton>
                            </IonCol>
                            <IonCol hidden={!isLoading}>
                                <IonLabel><h1 style={{padding: '10px'}}>Loading Party!!!</h1></IonLabel>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </div>
            </IonContent>
        </IonPage>

    );
};

export default Login;
