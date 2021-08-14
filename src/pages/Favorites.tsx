import React from "react";
import { pageCount } from "../globalConfig";
import { isEmpty } from "lodash";
import { useSongs } from "../hooks";
import { Page, ScrollingGrid, SongActionDiv, SongContainer, SongDivItem } from "../components"
import { close, closeOutline, informationCircle, informationCircleOutline } from "ionicons/icons";

export const Favorites: React.FC = () => {
  const pageName: string = "Favorites";
  const { favorites, deleteFavorite } = useSongs();

  if (isEmpty(favorites)) {
    return <Page name={pageName}><h2 style={{ padding: '10px' }}>Loading or there are no {pageName}...</h2></Page>
  }

  return (
    <Page name={pageName}>
      <ScrollingGrid
        pageCount={pageCount}
        pageName={pageName}
        listItems={favorites}
        getRow={(song, index) => {
          return (
            <SongContainer
              song={song}
              render={(song, onSongPick, onSongInfo) => {
                return (
                  <div key={index} className="row" style={{ padding: '10px', display: 'grid', gridTemplateColumns: 'auto 60px 60px' }}>
                    <SongDivItem
                      song={song}
                      showArtist={true}
                      showPath={true}
                      onClick={() => { onSongPick() }}
                    />
                    <SongActionDiv
                      image={informationCircle}
                      imageOutline={informationCircleOutline}
                      onClick={() => { onSongInfo();}}
                    />
                    <SongActionDiv
                      image={close}
                      imageOutline={closeOutline}
                      onClick={() => { deleteFavorite(song) }}
                    />
                  </div>
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