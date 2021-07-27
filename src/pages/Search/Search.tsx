import React, { useEffect, useState } from "react";
import { useParams } from 'react-router';
import Page from "../../components/Page/Page"
import { useSelector } from "react-redux";
import { selectSongs } from "../../store/store";
import { ISong } from "../../services/models";
import ScrollingGrid from "../../components/ScrollingGrid/ScrollingGrid";
import Song from "../../components/Song/Song";
import { pageCount } from "../../globalConfig";
import "./Search.css"
import { isEmpty, result } from "lodash";

const Search: React.FC = () => {

  const { query } = useParams<{ query: string; }>();
  const songs: ISong[] = useSelector(selectSongs);
  const [listItems, setListItems] = useState<ISong[]>([]);
  const pageName: string = "Search";

  useEffect(() => {
    console.log("searching term: ", query);
    console.log("searching in songs: ", songs.length);
    if (isEmpty(query) || isEmpty(songs)) return;

    let results: ISong[] = [];
    let terms: string[] = query.split(" ");
    let success: boolean = false;
    for (let key in songs) {
      success = true;
      for (let j: number = 0; j < terms.length; j++) {
        if (
          (songs[key].artist == undefined || !songs[key].artist.toLowerCase().includes(terms[j].toLowerCase()))
          &&
          (songs[key].title == undefined || !songs[key].title.toLowerCase().includes(terms[j].toLowerCase()))
        ) success = false;
      }
      if (success && (songs[key].disabled == undefined || songs[key].disabled == false)) {
        results.push(songs[key])
      };
    }

    let s = results.sort((a: ISong, b: ISong) => {
      var a1: string = a.title.toLowerCase();
      var a2: string = b.title.toLowerCase();
      if (a1 < a2) return -1;
      if (a1 > a2) return 1;
      return 0;
    });

    console.log("query:", query);
    console.log("found:", results);
    console.log("sorted:", s);

    setListItems(results);

  }, [query, songs]);

  return (
    <Page name={pageName}>
      <ScrollingGrid
        pageCount={pageCount}
        pageName={pageName}
        listItems={listItems}
        getRow={(song) => { return <Song song={song} /> }}
      />
    </Page>
  );
};

export default Search;