import { IonCheckbox, IonContent, IonItem, IonLabel, IonSegment, IonSegmentButton } from "@ionic/react";
import React from "react";
import { usePlayer } from "../hooks";
import { Page } from "../components"

const Settings: React.FC = () => {
  const { settings, updateSettings } = usePlayer();

  return (
    <Page name="Settings">
      <IonContent>
        <IonItem>
          <IonLabel>Auto Advance</IonLabel>
          <IonCheckbox checked={settings.autoadvance} onIonChange={e => updateSettings(e.detail.checked)} />
        </IonItem>
      </IonContent>
    </Page>
  );
};

export default Settings;