import React from "react";
import Page from "../../components/Page/Page"
import { useSelector } from "react-redux";
import { ISong } from "../../services/models";
import { selectHistory } from "../../store/store";
import { pageCount } from "../../globalConfig";
import ScrollingGrid from "../../components/ScrollingGrid/ScrollingGrid";
import Song from "../../components/Song/Song";

const History: React.FC = () => {
  const listItems: ISong[] = useSelector(selectHistory);
  const pageName: string = "History";

  return (
    <Page name={pageName}>
      <ScrollingGrid
        pageCount={pageCount}
        pageName={pageName}
        listItems={listItems}
        getRow={(song) => { return <Song song={song} /> }}
      />
    </Page>
  );
};

export default History;