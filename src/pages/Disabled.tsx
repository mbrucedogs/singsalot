import React from "react";
import { pageCount } from "../globalConfig";
import { isEmpty } from "lodash";
import { useDisabled } from "../hooks";
import { Page, ScrollingGrid, SongDiv, SongDivItem } from "../components"
import { IonIcon } from "@ionic/react";
import { close, closeOutline } from "ionicons/icons";

export const Disabled: React.FC = () => {
  const pageName: string = "Disabled";
  const { disabled, deleteDisabled } = useDisabled();

  if (isEmpty(disabled)) {
    return <Page name={pageName}><h2 style={{ padding: '10px' }}>Loading or there are no {pageName}...</h2></Page>
  }

  return (
    <Page name={pageName}>
      <ScrollingGrid
        pageCount={pageCount}
        pageName={pageName}
        listItems={disabled}
        getRow={(song) => {
          return (
            <div className="row" style={{ padding: '10px', display: 'grid', gridTemplateColumns: 'auto 60px' }}>
              <SongDivItem
                song={song}
                showArtist={true}
                showPath={true}
              />
              <div
                style={{ textAlign: 'center' }}
                onClick={() => { deleteDisabled(song) }}>
                <IonIcon ios={closeOutline} md={close} />
              </div>
            </div>
          )
        }}
      />
    </Page>
  );
};

export default Disabled;