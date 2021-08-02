import { useCallback } from "react";
import { useSelector } from "react-redux";
import { Song } from "../models/Song";
import { selectFavorites } from "../store/store";

export function useFavorites(): {
    favorites: Song[];
    addFavorite: (song: Song) => void;
} {
    const favorites = useSelector(selectFavorites);

    const addFavorite = useCallback((song: Song) => {
        console.log("useFavorites - addFavorite", song);
    }, []);

    return { favorites, addFavorite }
}