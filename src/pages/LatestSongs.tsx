import React from "react";
import { pageCount } from "../globalConfig";
import { isEmpty } from "lodash";
import { useLatestSongs } from "../hooks";
import { Page, InfiniteList, SongDiv } from "../components"

export const LatestSongs = () => {
  const pageName: string = "Latest Songs";
  const { latestSongs } = useLatestSongs();
  if (isEmpty(latestSongs)) {
    return <Page name={pageName}><h2 style={{ padding: '10px' }}>There are no {pageName}...</h2></Page>
  }

  return (
    <Page name={pageName}>
      <InfiniteList
        pageCount={pageCount}
        pageName={pageName}
        listItems={latestSongs}
        getRow={(item, index) => { 
          return <div key={index}><SongDiv key={index} song={item} allowFavorites={false}/></div>
        }}
      />
    </Page>
  );
};

export default LatestSongs;