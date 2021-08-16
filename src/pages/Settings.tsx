import { IonButton, IonCheckbox, IonContent, IonItem, IonLabel } from "@ionic/react";
import React from "react";
import { usePlayer } from "../hooks";
import { Page } from "../components"
import { useHistory } from "react-router";

export const Settings: React.FC = () => {
  const { settings, updateSettings, reset } = usePlayer();
  const history = useHistory();
  return (
    <Page name="Settings">
      <IonContent>
        <IonItem>
          <IonLabel>Auto Advance</IonLabel>
          <IonCheckbox checked={settings.autoadvance} onIonChange={e => updateSettings(e.detail.checked)} />
        </IonItem>
        <IonItem>
        <IonButton onClick={() => { history.push("/Disabled") }}>Disabled Songs</IonButton>
        <IonButton onClick={() => { reset() }}>Reset Player</IonButton>
        </IonItem>
      </IonContent>
    </Page>
  );
};

export default Settings;