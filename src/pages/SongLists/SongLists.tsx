import React from "react";
import Page from "../../components/Page/Page"
import { useSelector } from "react-redux";
import { selectSongLists } from "../../store/store";
import { ISongList } from "../../services/models";

const SongLists: React.FC = () => {
  const listItems: ISongList[] = useSelector(selectSongLists);

  return (
      <Page name="SongLists">
          <div>
          {listItems.map(item => {
             return <div key={item.title}>
                      <div>{item.title}</div>
                    </div>          
          })}
          </div>
      </Page>
  );
};

export default SongLists;