import { IonButton, IonCheckbox, IonContent, IonItem, IonLabel } from "@ionic/react";
import React, { useCallback, useState } from "react";
import { usePlayer } from "../hooks";
import { Page } from "../components"
import { useHistory } from "react-router";

export const Settings = () => {
  const { settings, updateSettings, reset } = usePlayer();
  const history = useHistory();
  let hasFocus = false;

  const submit = useCallback((checked: boolean) => {
    hasFocus = false;
    updateSettings(checked);
  },[settings]);

  console.log("settings.autoadvance", settings.autoadvance);
  
  return (
    <Page name="Settings">
      <IonContent>
        <IonItem>
          <IonLabel>Auto Advance</IonLabel>
          <IonCheckbox checked={settings.autoadvance} onFocus={() => hasFocus = !hasFocus } onIonChange={e => hasFocus && submit(e.detail.checked as boolean)} />
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