import React from "react";
import Page from "../../components/Page/Page"
import { useSelector } from "react-redux";
import { selectArtists } from "../../store/store";
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import { Table } from "../../components/Table/Table";
import { IArtist } from "../../services/models";

const Artists: React.FC = () => {
  const listItems: IArtist[] = useSelector(selectArtists);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        columns: [
          {
            accessor: 'name',
          }
        ],
      }
    ],
    []
  )

  return (
      <Page name="Artists">
          <Table columns={columns} data={listItems}/>
      </Page>
  );
};

export default Artists;