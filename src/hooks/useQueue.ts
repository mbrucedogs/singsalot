import { isEmpty } from "lodash";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { QueueItem } from "../models/QueueItem";
import { Singer } from "../models/Singer";
import FirebaseService from "../services/FirebaseService";
import { selectQueue } from "../store/store";

export function useQueue(): {
    queue: QueueItem[];
    addToQueue: (queueItem: QueueItem) => Promise<boolean>;
    deleteFromQueue: (item: QueueItem) => Promise<boolean>;
    reorderQueue: (fromIndex: number, toIndex: number, toQueue: QueueItem[]) => Promise<boolean>;
} {
    const queue = useSelector(selectQueue);

    const deleteFromQueue = useCallback((item: QueueItem): Promise<boolean> => {
        //console.log("useQueue - deleteFromQueue - queueItem", item);
        return new Promise((resolve, reject) => {
            FirebaseService
                .deletePlayerQueue(item)
                .then(_ => resolve(true))
                .catch(error => reject(error));
        });
    }, [queue]);

    const orderQueue = useCallback((items: QueueItem[]): Promise<boolean> => {
        //console.log("useQueue - orderQueue - in", items);   
        //console.log("useQueue - orderQueue - ordered", items);

        let promQI: Promise<boolean>[] = items.map(item => {
            return new Promise((resolve, reject) => {
                FirebaseService
                    .updatePlayerQueue(item)
                    .then(_ => resolve(true))
                    .catch(error => reject(error));
            });
        });

        return new Promise((resolve, reject) => {
            Promise.allSettled(promQI)
                .then((results) => {
                    let failure = results.map(result => result.status === "rejected");
                    if (!isEmpty(failure)) {
                        resolve(false);
                        reject("Error occured");
                    } else {
                        resolve(true);
                    }
                })
                .catch(error => reject(error));
        });

    }, [queue]);

    const reorderQueue = useCallback((fromIndex: number, toIndex: number, toQueue: QueueItem[]): Promise<boolean> => {
        let reordered = moveItem(fromIndex, toIndex, toQueue);
        return orderQueue(reordered);
    }, [queue]);

    const addToQueue = useCallback((queueItem: QueueItem): Promise<boolean> => {
        let index = getFairQueueIndex(queueItem.singer);
        let finalQueue = moveItem(0, index, [queueItem, ...queue]);
        return orderQueue(finalQueue);
    }, [queue]);

    const moveItem = useCallback((fromIndex: number, toIndex: number, toQueue: QueueItem[]): QueueItem[] => {
        //console.log(`moveItem fromIndex: ${fromIndex}, toIndex: ${toIndex}, toQueue:`, queue);
        let ordered = toQueue.slice(0);
        const itemToMove = ordered.splice(fromIndex,1)[0];
        //console.log('moveItem itemToMove;',itemToMove);
        //console.log("moveItem before", ordered);
        ordered.splice(toIndex, 0, itemToMove);
        let reordered = ordered.map((qi, index) => {
            let item: QueueItem = {
                key: qi.key,
                order: index,
                singer: qi.singer,
                song: qi.song
            };
            return item;
        });
        //console.log("moveItem send", reordered);
        return reordered;
    }, [queue]);

    const getFairQueueIndex = useCallback((newSinger: Singer) => {
        if (isEmpty(queue)) return 0;
        return queue.findIndex(function (e, index, arr) {
            return (index == arr.length - 1) ? true : isBetween(queue, newSinger.name, arr[index].singer.name, arr[index + 1].singer.name);
        }) + 1;
    }, [queue]);

    const isBetween = useCallback((arr: QueueItem[], targetSinger: string, startSinger: string, endSinger: string) => {
        var start = arr.findIndex(function (e) { return e.singer.name === startSinger });
        var end = arr.findIndex(function (e) { return e.singer.name == endSinger });
        var target = arr.findIndex(function (e) { return e.singer.name == targetSinger });
        return (start < end) ? (target > start && target < end) : (target > start || target < end);
    }, [queue]);

    return { queue, addToQueue, deleteFromQueue, reorderQueue }
}