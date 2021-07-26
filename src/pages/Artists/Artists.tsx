import React from "react";
import Page from "../../components/Page/Page"
import { useSelector } from "react-redux";
import { selectArtists } from "../../store/store";

const Artists: React.FC = () => {
  const listItems: string[] = useSelector(selectArtists);

  return (
      <Page name="Artists">
          <div>
          {listItems.map(item => {
             return <div key={item}>
                      <div>{item}</div>
                    </div>          
          })}
          </div>
      </Page>
  );
};

export default Artists;