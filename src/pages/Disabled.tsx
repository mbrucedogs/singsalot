import React from "react";
import { pageCount } from "../globalConfig";
import { isEmpty } from "lodash";
import { useSongs } from "../hooks";
import { ActionRow, Page, InfiniteList, SongDivItem } from "../components"
import { close, closeOutline } from "ionicons/icons";
import { ActionButton } from "../components/ActionButton";

export const Disabled = () => {
  const pageName: string = "Disabled";
  const { disabled, deleteDisabled } = useSongs();

  if (isEmpty(disabled)) {
    return <Page name={pageName}><h2 style={{ padding: '10px' }}>Loading or there are no {pageName}...</h2></Page>
  }

  return (
    <Page name={pageName}>
      <InfiniteList
        pageCount={pageCount}
        pageName={pageName}
        listItems={disabled}
        getRow={(song, index) => {
          return (
            <ActionRow
              key={index}
              gridTemplateColumns='auto 60px'
              columns={[
                <SongDivItem
                  song={song}
                  showArtist={true}
                  showPath={true}
                />]}
              actionButtons={[
                <ActionButton
                  image={close}
                  imageOutline={closeOutline}
                  onClick={() => { deleteDisabled(song) }}
                />]}
            />

          )
        }}
      />
    </Page>
  );
};

export default Disabled;