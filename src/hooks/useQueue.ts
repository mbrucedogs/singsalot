import { endsWith, isEmpty } from "lodash";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { QueueItem } from "../models/QueueItem";
import { Singer } from "../models/Singer";
import FirebaseService from "../services/FirebaseService";
import { selectQueue, selectSingers } from "../store/store";

export function useQueue(): {
    queue: QueueItem[];
    addToQueue: (queueItem: QueueItem) => Promise<boolean>;
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

    }, [queue, singers]);

    const reorderQueue = useCallback((fromIndex: number, toIndex: number, toQueue: QueueItem[]): Promise<boolean> => {
        let reordered = moveItem(fromIndex, toIndex, toQueue);
        return orderQueue(reordered);
    }, [queue, singers]);

    const addToQueue = useCallback((queueItem: QueueItem): Promise<boolean> => {
        console.log("*******************************************************************");
        console.log("useQueue - addToQueue - entry", queueItem);
        console.log("*******************************************************************");
        console.log("useQueue - addToQueue - queue before ", queue);
        console.log("useQueue - addToQueue - singers ", singers);
        let index = getFairQueueIndex(queueItem.singer, queue, singers);
        queueItem.order = index;
        console.log("useQueue - addToQueue - getFairQueueIndex ", index);
        console.log("useQueue - addToQueue - updatedItem", queueItem);
        console.log("*******************************************************************");

        return FirebaseService.addPlayerQueue(queueItem);
        //return new Promise<boolean>((resolve) => resolve(true));
    }, [queue, singers]);

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
                key: qi.key,
                order: order,
                singer: qi.singer,
                song: qi.song
            };
            return item;
        });
        //console.log("moveItem send", reordered);
        return reordered;
    }, [queue, singers]);

    const getFairQueueIndex = (newSinger: Singer, cachedQueue: QueueItem[], singers: Singer[]) => {
        if (isEmpty(cachedQueue)) return 0;
        let index = cachedQueue.findIndex(function (e, index, arr) {
            return (index == arr.length - 1) ? true : isBetween(singers, newSinger.name.toLowerCase(), arr[index].singer.name.toLowerCase(), arr[index + 1].singer.name.toLowerCase());;
        });
        let final = (index * orderMultiplier) + 1;
        console.log(`-- getFairQueueIndex - RESULT - foundIndex: ${index} finalIndex: ${final} `);
        return  final;
    };

    const isBetween = (arr: Singer[], targetSinger: string, startSinger: string, endSinger: string) => {
        var startIndex = arr.findIndex(function (e) {return e.name === startSinger;});
        var endIndex = arr.findIndex(function (e) { return e.name == endSinger });
        var targetIndex = arr.findIndex(function (e) { return e.name == targetSinger });

        console.log(`-- -- isBetween -  startSinger: ${startSinger} startIndex: ${startIndex}`)
        console.log(`-- -- isBetween -    endSinger: ${endSinger} endIndex: ${endIndex}`)
        console.log(`-- -- isBetween - targetSinger: ${targetSinger} targetIndex: ${targetIndex}`)

        let value = (startIndex < endIndex) ? (targetIndex > startIndex && targetIndex < endIndex) : (targetIndex > startIndex || targetIndex < endIndex);
        return value;
    };

    return { queue, addToQueue, deleteFromQueue, reorderQueue }
}