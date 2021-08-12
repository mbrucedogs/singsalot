import React from "react";
import { pageCount } from "../globalConfig";
import { isEmpty } from "lodash";
import { useDisabled } from "../hooks";
import { Page, ScrollingGrid, SongDiv } from "../components"

export const Disabled: React.FC = () => {
  const pageName: string = "Disabled";
  const { disabled, addDisabled, deleteDisabled } = useDisabled();

  if(isEmpty(disabled)) { 
    return <Page name={pageName}><h2 style={{padding:'10px'}}>Loading or there are no {pageName}...</h2></Page>
  }

  return (
    <Page name={pageName}>
      <ScrollingGrid
        pageCount={pageCount}
        pageName={pageName}
        listItems={disabled}
        getRow={(song) => { return <SongDiv key={song.key} song={song}/> }}
      />
    </Page>
  );
};

export default Disabled;