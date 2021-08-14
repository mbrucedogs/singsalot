import React from "react";
import { pageCount } from "../globalConfig";
import { isEmpty } from "lodash";
import { useSongs } from "../hooks";
import { Page, ScrollingGrid, SongActionDiv, SongDivItem } from "../components"
import { close, closeOutline } from "ionicons/icons";
import { IonButtons } from "@ionic/react";

export const Disabled: React.FC = () => {
  const pageName: string = "Disabled";
  const { disabled, deleteDisabled } = useSongs();

  if (isEmpty(disabled)) {
    return <Page name={pageName}><h2 style={{ padding: '10px' }}>Loading or there are no {pageName}...</h2></Page>
  }

  return (
    <Page name={pageName}>
      <ScrollingGrid
        pageCount={pageCount}
        pageName={pageName}
        listItems={disabled}
        getRow={(song, index) => {
          return (
            <div key={index} className="row" style={{ padding: '10px', display: 'grid', gridTemplateColumns: 'auto 60px' }}>
              <SongDivItem
                song={song}
                showArtist={true}
                showPath={true}
              />
              <IonButtons slot="end">
                <SongActionDiv
                  image={close}
                  imageOutline={closeOutline}
                  onClick={() => { deleteDisabled(song) }}
                />
              </IonButtons>
            </div>
          )
        }}
      />
    </Page>
  );
};

export default Disabled;