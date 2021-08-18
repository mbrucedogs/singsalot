import React from "react";
import { isEmpty } from "lodash";
import Collapsible from "react-collapsible";
import { useTopPlayed } from "../hooks";
import { ActionButton, ActionRow, Page, InfiniteList, SongDiv } from "../components"
import { chevronForward, chevronForwardOutline } from "ionicons/icons";

export const TopSongs: React.FC = () => {
  const { topPlayed } = useTopPlayed();
  const amount: number = 100;
  const pageName: string = `Top ${amount} Played`;

  if (isEmpty(topPlayed)) {
    return <Page name={pageName}><h2 style={{ padding: '10px' }}>There are no {pageName}...</h2></Page>
  }

  return (
    <Page name={pageName}>
      <InfiniteList
        pageCount={topPlayed.length}
        pageName={pageName}
        listItems={topPlayed}
        getRow={(history, idx) => {
          return (<Collapsible key={idx} trigger={
            <ActionRow
            gridTemplateColumns='50px auto 60px'
            columns={[
              <div className="title">{idx! + 1})</div>,
              <div>
                <div className="title multi">{history.title} ({history.count})</div>
                <div className="subtitle">{history.artist}</div>
              </div>
            ]}
            actionButtons={[
              <ActionButton
                onClick={() => { }}
                imageOutline={chevronForwardOutline}
                image={chevronForward} />
            ]}
          />
          }>
            {history.songs.map((song, index) => {
              return (
                <SongDiv
                  key={index}
                  paddingLeft={50}
                  song={song}
                  showCount={true}
                  showPath={true} />
              )
            })}
          </Collapsible>)
        }}
      />
    </Page>
  );
};

export default TopSongs;