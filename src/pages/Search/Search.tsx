import React from "react";
import { useParams } from 'react-router';
import Page from "../../components/Page/Page"

const Search: React.FC = () => {
  const { query } = useParams<{ query: string; }>();

  return (
      <Page name="Search">
        <div>Search for: {query}</div>
      </Page>
  );
};

export default Search;