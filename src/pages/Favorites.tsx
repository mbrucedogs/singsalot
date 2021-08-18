import React from "react";
import { pageCount } from "../globalConfig";
import { isEmpty } from "lodash";
import { useSongs } from "../hooks";
import { Page, InfiniteList, ActionButton, SongContainer, SongDivItem, ActionRow } from "../components"
import { close, closeOutline, informationCircle, informationCircleOutline } from "ionicons/icons";
import { IonButtons } from "@ionic/react";

export const Favorites = () => {
  const pageName: string = "Favorites";
  const { favorites, deleteFavorite } = useSongs();

  if (isEmpty(favorites)) {
    return <Page name={pageName}><h2 style={{ padding: '10px' }}>There are no {pageName}...</h2></Page>
  }

  return (
    <Page name={pageName}>
      <InfiniteList
        pageCount={pageCount}
        pageName={pageName}
        listItems={favorites}
        getRow={(song, index) => {
          return (
            <SongContainer
              key={index}
              song={song}
              render={(song, onSongPick, onSongInfo) => {
                return (
                  <ActionRow
                    gridTemplateColumns='auto 120px'
                    columns={[
                      <SongDivItem
                        song={song}
                        showArtist={true}
                        showPath={true}
                        onClick={() => { onSongPick() }}
                      />
                    ]}
                    actionButtons={[
                      <ActionButton
                        image={informationCircle}
                        imageOutline={informationCircleOutline}
                        onClick={() => { onSongInfo(); }}
                      />,
                      <ActionButton
                        image={close}
                        imageOutline={closeOutline}
                        onClick={() => { deleteFavorite(song) }}
                      />
                    ]}
                  />
                )
              }}
            />
          )
        }}
      />
    </Page>
  );
};

export default Favorites;