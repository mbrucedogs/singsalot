import React from "react";
import { pageCount } from "../globalConfig";
import Page from "../components/Page"
import ScrollingGrid from "../components/ScrollingGrid";
import { isEmpty } from "lodash";
import { useSingers } from "../hooks/useSingers";

const Singers: React.FC = () => {
  const {singers, addSinger} = useSingers();
  const pageName: string = "Singers";

  if(isEmpty(singers)) { 
    return <Page name={pageName}><h2 style={{padding:'10px'}}>Loading or there are no {pageName}...</h2></Page>
  }

  return (
    <Page name={pageName}>
      <ScrollingGrid
        pageCount={pageCount}
        pageName={pageName}
        listItems={singers}
        getRow={(singer) => {
          return (
            <div key={singer.key} className="row-single">
              <div style={{flex: "1 1 auto"}}>{singer.name}</div>
            </div>
          )
        }}
      />
    </Page>
  );
};

export default Singers;