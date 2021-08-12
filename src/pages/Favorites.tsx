import React from "react";
import { pageCount } from "../globalConfig";
import { isEmpty } from "lodash";
import { useFavorites } from "../hooks";
import { Page, ScrollingGrid, SongDiv, SongDivItem } from "../components"
import { IonIcon } from "@ionic/react";
import { close, closeOutline } from "ionicons/icons";

export const Favorites: React.FC = () => {
  const pageName: string = "Favorites";
  const { favorites, deleteFavorite } = useFavorites();

  if(isEmpty(favorites)) { 
    return <Page name={pageName}><h2 style={{padding:'10px'}}>Loading or there are no {pageName}...</h2></Page>
  }

  return (
    <Page name={pageName}>
      <ScrollingGrid
        pageCount={pageCount}
        pageName={pageName}
        listItems={favorites}
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
                onClick={() => { deleteFavorite(song) }}>
                <IonIcon ios={closeOutline} md={close} />
              </div>
            </div>
          )
        }}
      />
    </Page>
  );
};

export default Favorites;