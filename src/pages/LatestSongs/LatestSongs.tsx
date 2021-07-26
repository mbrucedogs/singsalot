import React from "react";
import Page from "../../components/Page/Page"
import { ISong } from "../../services/models";
import { useSelector } from "react-redux";
import { selectLatestSongs } from "../../store/store";

const LatestSongs: React.FC = () => {
  const listItems: ISong[] = useSelector(selectLatestSongs);
  return (
      <Page name="Latest Songs">
          <div>
          {listItems.map(item => {
             return <div key={item.key}>
                      <div>{item.artist}</div>
                      <div>{item.title}</div>   
                    </div>          
          })}
          </div>
      </Page>
  );
};

export default LatestSongs;