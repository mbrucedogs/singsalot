import { isEmpty } from "lodash";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { Singer } from "../models/Singer";
import { convertToArray } from "../services/firebaseHelpers";
import FirebaseService from "../services/FirebaseService";
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
        })[0];

        return new Promise((resolve, reject) => {
            if (found) {
                let foundDate = new Date(found.lastLogin);
                let yesterday = new Date(Math.round(new Date().getTime() / 1000) - (24 * 3600) * 1000);
                let within24hrs = foundDate.getTime() > yesterday.getTime();
                if (within24hrs) {
                    resolve(true);
                } else {
                    let updated = { ...found, lastLogin: new Date().toUTCString(), songCount: 0 };
                    FirebaseService
                        .updatePlayerSinger(updated)
                        .then(_ => resolve(true))
                        .catch(error => reject(error));
                }
            } else {
                let singer = { name: name.trim(), lastLogin: new Date().toUTCString(), songCount: 0 }
                FirebaseService
                    .addPlayerSinger(singer)
                    .then(_ => resolve(true))
                    .catch(error => reject(error));
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