import React from "react";
import { useSelector } from "react-redux";
import { selectSongLists } from "../store/store";
import { ISongList } from "../services/models";
import { pageCount } from "../globalConfig";
import Page from "../components/Page"
import ScrollingGrid from "../components/ScrollingGrid";

const SongLists: React.FC = () => {
  const pageName: string = "Song Lists";
  const listItems: ISongList[] = useSelector(selectSongLists);

  return (
    <Page name={pageName}>
      <ScrollingGrid
        pageCount={pageCount}
        pageName={pageName}
        listItems={listItems}
        getRow={(item) => {
          return (
            <div key={item.key} className="one-line">
              {item.title}
            </div>
          )
        }}
      />
    </Page>
  );
};

export default SongLists;