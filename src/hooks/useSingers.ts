import { useCallback } from "react";
import { useSelector } from "react-redux";
import { Singer } from "../models/Singer";
import FirebaseService from "../services/FirebaseService";
import {  selectSingers } from "../store/store";

export function useSingers(): {
    singers: Singer[];
    addSinger: (name: string) => void;
} {
    const singers = useSelector(selectSingers);

    const addSinger = useCallback((name: string) => {
        console.log("useSingers - addSinger", name);
        FirebaseService.addPlayerSinger({name: name})
    }, []);

    return { singers, addSinger }
}