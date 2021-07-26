import React from "react";
import Page from "../../components/Page/Page";
import { selectFavorites } from "../../store/store";
import { useSelector } from "react-redux";
import { ISong } from "../../services/models";

const Favorites: React.FC = () => {
  const listItems: ISong[] = useSelector(selectFavorites)

  return (
      <Page name="Favorites">
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

export default Favorites;