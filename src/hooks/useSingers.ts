import { isEmpty, reject } from "lodash";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { Singer } from "../models/Singer";
import FirebaseService from "../services/FirebaseService";
import { selectSingers } from "../store/store";

export function useSingers(): {
    singers: Singer[];
    addSinger: (key: number, name: string) => Promise<boolean>;
    deleteSinger: (singer: Singer) => Promise<boolean>;
} {
    const singers = useSelector(selectSingers);

    const addSinger = useCallback((key: number, name: string): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            let trimmed = name.trim();
            let found = singers.filter(singer => singer.name.toLowerCase() === trimmed.toLowerCase());
            if (isEmpty(found)) {
                let singer = { key: key.toString(), name: trimmed }
                FirebaseService
                    .addPlayerSinger(singer)
                    .then(_ => resolve(true))
                    .catch(error => reject(error));

            } else {
                reject("Singer already exists");
            }
        });
    }, []);

    const deleteSinger = useCallback((singer: Singer): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            FirebaseService
                .deletePlayerSinger(singer)
                .then(_ => resolve(true))
                .catch(error => reject(error));
        });
    }, []);

    return { singers, addSinger, deleteSinger }
}