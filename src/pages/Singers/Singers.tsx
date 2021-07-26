import React from "react";
import Page from "../../components/Page/Page"
import { ISinger } from "../../services/models";
import { useSelector } from "react-redux";
import { selectSingers } from "../../store/store";

const Singers: React.FC = () => {
  const listItems: ISinger[] = useSelector(selectSingers);
  
  return (
      <Page name="Singers">
          <div>
          {listItems.map(item => {
             return <div key={item.key}>
                      <div>{item.name}</div>
                    </div>          
          })}
          </div>
      </Page>
  );
};

export default Singers;