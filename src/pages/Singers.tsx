import React from "react";
import { ISinger } from "../services/models";
import { useSelector } from "react-redux";
import { selectSingers } from "../store/store";
import { pageCount } from "../globalConfig";
import Page from "../components/Page"
import ScrollingGrid from "../components/ScrollingGrid";
import { isEmpty } from "lodash";

const Singers: React.FC = () => {
  const listItems: ISinger[] = useSelector(selectSingers);
  const pageName: string = "Singers";

  if(isEmpty(listItems)) { 
    return <Page name={pageName}><h2 style={{padding:'10px'}}>Loading or there are no {pageName}...</h2></Page>
  }

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