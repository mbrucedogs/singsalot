import { isEmpty, reject } from "lodash";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { Singer } from "../models/Singer";
import FirebaseService from "../services/FirebaseService";
import queue from "../store/slices/queue";
import { selectSingers } from "../store/store";

export function useSingers(): {
    singers: Singer[];
    addSinger: (name: string) => Promise<boolean>;
    updateSinger: (singer: Singer) => Promise<boolean>;
    deleteSinger: (singer: Singer) => Promise<boolean>;
} {
    const singers = useSelector(selectSingers);

    const addSinger = useCallback((name: string): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            let trimmed = name.trim();
            let found = singers.filter(singer => singer.name.toLowerCase() === trimmed.toLowerCase());
            if (isEmpty(found)) {
                let singer = { key: singers.length.toString(), songCount:0, name: trimmed }
                FirebaseService
                    .addPlayerSinger(singer)
                    .then(_ => resolve(true))
                    .catch(error => reject(error));

            } else {
                reject("Singer already exists");
            }
        });
    }, [singers]);

    const updateSinger = useCallback((singer: Singer): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            FirebaseService
                .updatePlayerSinger(singer)
                .then(_ => resolve(true))
                .catch(error => reject(error));
        });
    }, [singers]);

    const deleteSinger = useCallback((singer: Singer): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            FirebaseService
                .deletePlayerSinger(singer)
                .then(_ => resolve(true))
                .catch(error => reject(error));
        });
    }, [singers]);

    return { singers, addSinger, updateSinger, deleteSinger }
}