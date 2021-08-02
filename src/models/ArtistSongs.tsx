import { isEmpty } from "lodash";
import { Fabricable } from "./Fabricable";
import { Song } from "./Song";

export interface ArtistSongs extends Fabricable {
    artist: string; songs: Song[];
}

export const convertToAristSongs = (songs: Song[]): ArtistSongs[] => {
    let noArtist: ArtistSongs = { artist: "None", songs: [] };
    let results: ArtistSongs[] = [];
    songs.map(song => {
      let artist = song.artist;
      let key = artist.trim().toLowerCase();
      if (isEmpty(artist)) {
        noArtist.songs.push(song);
      } else {
        let found = results.filter(item => item.key === key)?.[0];
        if (isEmpty(found)) {
          found = { key: key, artist: song.artist, songs: [song] }
          results.push(found);
        } else {
          found.songs.push(song);
        }
      }
    });

    let sorted = results.sort((a: ArtistSongs, b: ArtistSongs) => {
      return a.artist.localeCompare(b.artist);
    });

    sorted.forEach(item => {
      if (item.songs.length > 1) {
        let sorted = item.songs.sort((a: Song, b: Song) => {
          return a.title.localeCompare(b.title)
        });
        item.songs = sorted;
      }
    })

    if (!isEmpty(noArtist.songs)) {
      sorted.push(noArtist, ...sorted);
    }

    return sorted;
}