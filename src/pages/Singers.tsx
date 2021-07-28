import React from "react";
import { ISinger } from "../services/models";
import { useSelector } from "react-redux";
import { selectSingers } from "../store/store";
import { pageCount } from "../globalConfig";
import Page from "../components/Page"
import ScrollingGrid from "../components/ScrollingGrid";

const Singers: React.FC = () => {
  const listItems: ISinger[] = useSelector(selectSingers);
  const pageName: string = "Singers";

  return (
    <Page name={pageName}>
      <ScrollingGrid
        pageCount={pageCount}
        pageName={pageName}
        listItems={listItems}
        getRow={(singer) => {
          return (
            <div key={singer.key} className="one-line">
              {singer.name}
            </div>
          )
        }}
      />
    </Page>
  );
};

export default Singers;