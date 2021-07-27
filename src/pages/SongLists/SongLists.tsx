import React from "react";
import Page from "../../components/Page/Page"
import { useSelector } from "react-redux";
import { selectSongLists } from "../../store/store";
import { ISongList } from "../../services/models";
import ScrollingGrid from "../../components/ScrollingGrid/ScrollingGrid";
import { pageCount } from "../../globalConfig";
import "./SongLists.css"

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
            <div key={item.key} className="row">
              {item.title}
            </div>
          )
        }}
      />
    </Page>
  );
};

export default SongLists;