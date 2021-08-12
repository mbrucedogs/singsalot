import { useCallback } from "react";
import { useSelector } from "react-redux";
import { Song } from "../models";
import { FirebaseService } from "../services";
import { selectDisabled } from "../store/store";

export const useDisabled = (): {
    disabled: Song[];
    addDisabled: (song: Song) => void;
    deleteDisabled: (song: Song) => void;
} => {
    const disabled = useSelector(selectDisabled);

    const addDisabled = useCallback((song: Song) => {
        console.log("useDisabled - addFavorite", song);
        FirebaseService.addDisabled(song);      
    }, [disabled]);

    const deleteDisabled = useCallback((song: Song) => {
        console.log("useDisabled - deleteDisabled", song);
        FirebaseService.deleteDisabled(song);      
    }, [disabled]);

    return { disabled, addDisabled, deleteDisabled }
}