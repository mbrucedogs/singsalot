import React, {useState, useEffect} from "react";
import { useSelector } from "react-redux";
import { selectArtists } from "../store/store";
import { IArtist } from "../services/models";
import { pageCount } from "../globalConfig";
import Page from "../components/Page"
import ScrollingGrid from "../components/ScrollingGrid";

const Artists: React.FC = () => {
  const pageName: string = "Artists";
  const listItems: IArtist[] = useSelector(selectArtists);

  return (
      <Page name={pageName}>
        <ScrollingGrid 
          pageCount={pageCount} 
          pageName={pageName} 
          listItems={listItems}
          getRow={(item) => {
            return(
              <div key={item.name} className="one-line">
                {item.name}
              </div>
            ); 
          }}
        />
      </Page>
  );
};

export default Artists;