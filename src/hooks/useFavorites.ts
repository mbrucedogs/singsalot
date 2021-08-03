import { useCallback } from "react";
import { useSelector } from "react-redux";
import { Song } from "../models/Song";
import FirebaseService from "../services/FirebaseService";
import { selectFavorites } from "../store/store";

export function useFavorites(): {
    favorites: Song[];
    addFavorite: (song: Song) => void;
    deleteFavorite: (song: Song) => void;
} {
    const favorites = useSelector(selectFavorites);

    const addFavorite = useCallback((song: Song) => {
        console.log("useFavorites - addFavorite", song);
        FirebaseService.addFavorite(song);      
    }, []);

    const deleteFavorite = useCallback((song: Song) => {
        console.log("useFavorites - deleteFavorite", song);
        FirebaseService.deleteFavorite(song);      
    }, []);

    return { favorites, addFavorite, deleteFavorite }
}