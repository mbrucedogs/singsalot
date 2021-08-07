import { isEmpty, reject, trim } from "lodash";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { Singer } from "../models/Singer";
import { convertToArray } from "../services/firebaseHelpers";
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

    const addSinger = useCallback(async (name: string): Promise<boolean> => {
        let trimmed = name.trim().toLowerCase();
        let cached = singers;
        if (isEmpty(cached)) {
            let fb = await FirebaseService.getPlayerSingers().get();
            cached = await convertToArray<Singer>(fb);
        }
        let found = cached.filter(singer => {
            console.log(`name compare singer ${singer.name.toLowerCase()} === ${trimmed}: `, singer.name.toLowerCase() === trimmed)
            return singer.name.toLowerCase() === trimmed
        });

        return new Promise((resolve, reject) => {
            if (isEmpty(found)) {
                let singer = { songCount: 0, name: name.trim() }
                FirebaseService
                    .addPlayerSinger(singer)
                    .then(_ => resolve(true))
                    .catch(error => reject(error));

            } else {
                resolve(true);
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