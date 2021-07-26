import React from "react";
import Page from "../../components/Page/Page"
import { useSelector } from "react-redux";
import { ISong } from "../../services/models";
import { selectHistory } from "../../store/store";

const History: React.FC = () => {
  const listItems: ISong[] = useSelector(selectHistory);

  return (
      <Page name="History">
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

export default History;