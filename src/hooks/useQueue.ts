import { isEmpty } from "lodash";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { QueueItem } from "../models/QueueItem";
import { Singer } from "../models/Singer";
import FirebaseService from "../services/FirebaseService";
import { selectQueue, selectSingers } from "../store/store";
import { Song } from "../models/Song";

export function useQueue(): {
    queue: QueueItem[];
    addToQueue: (singer: Singer, song: Song) => Promise<boolean>;
    deleteFromQueue: (item: QueueItem) => Promise<boolean>;
    reorderQueue: (fromIndex: number, toIndex: number, toQueue: QueueItem[]) => Promise<boolean>;
} {
    const queue = useSelector(selectQueue);
    const singers = useSelector(selectSingers);
    const orderMultiplier = 10;

    const deleteFromQueue = useCallback((item: QueueItem): Promise<boolean> => {
        //console.log("useQueue - deleteFromQueue - queueItem", item);
        return new Promise((resolve, reject) => {
            FirebaseService
                .deletePlayerQueue(item)
                .then(_ => resolve(true))
                .catch(error => reject(error));
        });
    }, [queue]);

    const reorderQueue = useCallback((fromIndex: number, toIndex: number, toQueue: QueueItem[]): Promise<boolean> => {
        let reordered = moveItem(fromIndex, toIndex, toQueue);
        return FirebaseService.setPlayerQueue(reordered);
    }, [queue, singers]);

    const addToQueue = useCallback((singer: Singer, song: Song): Promise<boolean> => {
        //get the index for the order
        let order = getFairQueueIndex(singer, queue, singers);
        console.log('onSongPick - singer', singer);

        let newSinger: Singer = {
            ...singer,
            songCount: singer.songCount + 1
        }

        let queueItem: QueueItem = {
            key: queue.length.toString(),
            order: queue.length,
            singer: newSinger,
            song: song
        }

        //update the singers for the queue so you get the latest counts
        let queueWithSingersUpdate = queue.map(qi => {
            let s = singers.find(singer => singer.name === qi.singer.name);
            if (isEmpty(s)) {
                return qi;
            } else {
                let nqi: QueueItem = {
                    ...qi,
                    singer: s!.name === singer.name ? singer : s!,
                };
                return nqi;
            }
        });

        return doAddToQueue(queueItem, queueWithSingersUpdate);
    }, [queue, singers]);

    const doAddToQueue = async (queueItem: QueueItem, cachedQueue: QueueItem[]): Promise<boolean> => {
        try {
            await FirebaseService.updatePlayerSinger(queueItem.singer);
            let q = [queueItem, ...cachedQueue];
            let sorted = q.sort((a: QueueItem, b: QueueItem) => {
                return a.order - b.order;
            });
            let reordered = sorted.map((qi, index) => {
                let order = index * orderMultiplier;
                let item: QueueItem = {
                    ...qi,
                    order: order
                };
                return item;
            });
            await FirebaseService.setPlayerQueue(reordered);
            return true;
        } catch (error) {
            return false;
        }
    };

    //Private Functions
    const moveItem = useCallback((fromIndex: number, toIndex: number, toQueue: QueueItem[]): QueueItem[] => {
        //console.log(`moveItem fromIndex: ${fromIndex}, toIndex: ${toIndex}, toQueue:`, queue);
        let ordered = toQueue.slice(0);
        const itemToMove = ordered.splice(fromIndex, 1)[0];
        //console.log('moveItem itemToMove;',itemToMove);
        //console.log("moveItem before", ordered);
        ordered.splice(toIndex, 0, itemToMove);
        let reordered = ordered.map((qi, index) => {
            let order = index * orderMultiplier;
            let item: QueueItem = {
                ...qi,
                order: order,
            };
            return item;
        });
        //console.log("moveItem send", reordered);
        return reordered;
    }, [queue, singers]);

    const getFairQueueIndex = (newSinger: Singer, cachedQueue: QueueItem[], singers: Singer[]) => {
        if (isEmpty(cachedQueue)) return 0;
        if (cachedQueue.length == 1) return orderMultiplier + 1;
        let nsc = newSinger.songCount;
        let index = cachedQueue.length;
        if (isEmpty(cachedQueue.find(qi => qi.singer.name.toLowerCase() === newSinger.name.toLowerCase()))) {
            index = cachedQueue.findIndex(function (e, idx, arr) {
                if (idx == arr.length - 1) {
                    return true;
                } else {
                    let foundSinger = singers.find(s => s.name === arr[idx].singer.name);
                    if (isEmpty(foundSinger)) {
                        return false;
                    }
                    let s1c = foundSinger?.songCount ?? 0;
                    let value = nsc < s1c;
                    return value;
                }
            });
        } else {

        }
        let final = (index * orderMultiplier) + 1;
        // console.log(`-- getFairQueueIndex - RESULT - foundIndex: ${index} finalIndex: ${final} `);
        // console.log(`**********************************************************`);
        // console.log(`getFairQueueIndex end`);
        // console.log(`**********************************************************`);
        return final;
    };

    return { queue, addToQueue, deleteFromQueue, reorderQueue }
}