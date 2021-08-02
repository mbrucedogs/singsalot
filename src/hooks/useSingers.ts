import { useCallback } from "react";
import { useSelector } from "react-redux";
import { Singer } from "../models/Singer";
import {  selectSingers } from "../store/store";

export function useSingers(): {
    singers: Singer[];
    addSinger: (name: string) => void;
} {
    const singers = useSelector(selectSingers);

    const addSinger = useCallback((name: string) => {
        console.log("useSingers - addSinger", name);
    }, []);

    return { singers, addSinger }
}