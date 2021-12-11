import { isEmpty, reject } from "lodash";
import { useCallback } from "react";
import { useSongHistory } from "./useSongHistory";
import { selectPlayer } from "../store/store";
import { convertToArray, FirebaseService } from "../services";
import { QueueItem, Settings, Singer, Song } from "../models/types";
import { PlayerState } from "../models";
import { useAppSelector } from "./hooks";

export const usePlayer = (): {
    reset: ()=>void;

    //playerState
    playerState: PlayerState,
    setPlayerState: (playerState: PlayerState) => Promise<boolean>;

    //settings
    settings: Settings,
    updateSettings: (autoAdvance: boolean) => void;

    //queue
    queue: QueueItem[];
    addToQueue: (singer: Singer, song: Song) => Promise<boolean>;
    deleteFromQueue: (item: QueueItem) => Promise<boolean>;
    updateQueue: (items:QueueItem[])=> Promise<boolean>;

    //singers
    singers: Singer[];
    addSinger: (name: string) => Promise<boolean>;
    updateSinger: (singer: Singer) => Promise<boolean>;
    deleteSinger: (singer: Singer) => Promise<boolean>;
} => {
    //***************************************************************************************************** */
    //Properties */
    //***************************************************************************************************** */
    const { settings, playerState, singers, queue } = useAppSelector(selectPlayer);
    const { addSongHistory } = useSongHistory();

    const orderMultiplier = 10;

    const reset = () =>{ 
        FirebaseService.resetPlayer();
    }
    //***************************************************************************************************** */
    //PlayerState */
    //***************************************************************************************************** */
    const setPlayerState = (playerState: PlayerState) => {
        return FirebaseService.setPlayerState(playerState);
    };

    //***************************************************************************************************** */
    //Queue */
    //***************************************************************************************************** */
    const updateSettings = (autoAdvance: boolean) => {
        let updated: Settings = { ...settings, autoadvance: autoAdvance }
        console.log("update settings", updated);
        return FirebaseService.setPlayerSettings(updated);
    }

    //***************************************************************************************************** */
    //Queue */
    //***************************************************************************************************** */
    const updateQueue = useCallback((items: QueueItem[]): Promise<boolean> => {
        let reordered = items.map((qi, index) => {
            let order = (index + 1) * orderMultiplier;
            let item: QueueItem = {
                ...qi,
                order: order,
            };
            return item;
        });
        let sorted = reordered.sort((a: QueueItem, b: QueueItem) => {
            return a.order - b.order;
        });
        //console.log("reorderQueue", sorted);
        //return new Promise<boolean>(resolve => resolve(true))
        return FirebaseService.updatePlayerQueue(sorted).then(resolve => resolve(true)).catch(e => reject(e));
    }, []);

    const doAddToQueue = useCallback(async (queueItem: QueueItem): Promise<boolean> => {
        try {            
            //add new queueItem
            let sorted = [queueItem, ...queue].sort((a: QueueItem, b: QueueItem) => {
                return a.order - b.order;
            });

            //update with new multiplier
            let reordered = sorted.map((qi, index) => {
                let order = index * orderMultiplier;
                let item: QueueItem = {
                    ...qi,
                    key: index.toString(),
                    order: order
                };
                return item;
            });
            //console.log("doAddToQueue", reordered);
            await FirebaseService.setPlayerQueue(reordered);
            addSongHistory(queueItem.song);
            return true;

        } catch (error) {
            return false;
        }
    }, [addSongHistory, queue]);

    const doDeleteToQueue = useCallback(async (queueItem: QueueItem): Promise<boolean> => {
        try {
            //remove new queueItem
            //console.log("doDeleteToQueue queue", queue);
            let copy = [...queue];
            //console.log("doDeleteToQueue copy orig", copy);
            let delIdx = copy.findIndex(qi => qi === queueItem);
            //console.log("doDeleteToQueue delIndex", delIdx);
            copy.splice(delIdx, 1);

            let sorted = copy.sort((a: QueueItem, b: QueueItem) => {
                return a.order - b.order;
            });

            //update with new multiplier
            let reordered = sorted.map((qi, index) => {
                let order = index * orderMultiplier;
                let item: QueueItem = {
                    ...qi,
                    order: order
                };
                return item;
            });

            //console.log("doDeleteToQueue reordered", reordered);
            await FirebaseService.deletePlayerQueue(queueItem);
            await FirebaseService.setPlayerQueue(reordered);
            return true;
        } catch (error) {
            return false;
        }
    }, [queue]);

    const deleteFromQueue = useCallback((item: QueueItem): Promise<boolean> => {
        //console.log('deleteFromQueue', item)
        return doDeleteToQueue(item);
    }, [doDeleteToQueue]);

    //Private Functions
    const getFairQueueOrder = useCallback((newSinger: Singer) => {
        if (isEmpty(queue)) return 0;
        if (queue.length === 1) return orderMultiplier + 1;
        return (queue.length * orderMultiplier) + 1;
    }, [queue]);

    const addToQueue = useCallback((singer: Singer, song: Song): Promise<boolean> => {
        //get the index for the order
        let order = getFairQueueOrder(singer);

        //create the queue item 
        let queueItem: QueueItem = {
            order: order,
            singer: singer,
            song: song
        }
        //console.log("addToQueue: ", queueItem);
        //return new Promise<boolean>(resolve => resolve(true))
        return doAddToQueue(queueItem);
    }, [doAddToQueue, getFairQueueOrder]);

    //***************************************************************************************************** */
    //Singers */
    //***************************************************************************************************** */
    const addSinger = useCallback(async (name: string): Promise<boolean> => {
        let trimmed = name.trim().toLowerCase();
        let cached = singers;
        if (isEmpty(cached)) {
            let fb = await FirebaseService.getPlayerSingers().get();
            cached = await convertToArray<Singer>(fb);
        }
        let found = cached.filter(singer => {
            //console.log(`name compare singer ${singer.name.toLowerCase()} === ${trimmed}: `, singer.name.toLowerCase() === trimmed)
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
                let key = cached.length === 0 ? 0 : cached.length;
                let singer = { name: name.trim(), lastLogin: new Date().toUTCString(), songCount: 0, key: key.toString() };
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
    }, []);

    const deleteSinger = useCallback((singer: Singer): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            FirebaseService
                .deletePlayerSinger(singer)
                .then(_ => resolve(true))
                .catch(error => reject(error));
        });
    }, []);

    return {
        reset,

        //state
        playerState, setPlayerState,
        //settings
        settings,
        updateSettings,
        //queue
        queue, addToQueue, deleteFromQueue, updateQueue,
        //singers
        singers, addSinger, updateSinger, deleteSinger
    }
}