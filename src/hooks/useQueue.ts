import { isEmpty } from "lodash";
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

    const reorderQueue = useCallback((fromIndex: number, toIndex: number, toQueue: QueueItem[]): Promise<boolean> => {
        let reordered = moveItem(fromIndex, toIndex, toQueue);
        return orderQueue(reordered);
    }, [queue, singers]);

    const addToQueue = useCallback((queueItem: QueueItem): Promise<boolean> => {
        //get the index for the order
        queueItem.order = getFairQueueIndex(queueItem.singer, queue, singers);

        //update the singer songCount
        let singer = queueItem.singer;
        singer.songCount = singer.songCount + 1;
        queueItem.singer = singer;

        //update the singers for the queue so you get the latest counts
        let singerUpdated = queue.map(qi => {
            let s = singers.find(singer => singer.name === qi.singer.name);
            if (isEmpty(s)) {
                return qi;
            } else {
                let nqi: QueueItem = {
                    key: qi.key,
                    order: qi.order,
                    singer: s!.name === singer.name ? singer : s!,
                    song: qi.song
                };
                return nqi;
            }
        });

        return doAddToQueue(queueItem, singerUpdated);
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
                    key: qi.key,
                    order: order,
                    singer: qi.singer,
                    song: qi.song
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
        let nsc = newSinger.songCount;
        //let nsn = newSinger.name;
        // console.log(`**********************************************************`);
        // console.log(`getFairQueueIndex Start`);
        // console.log(`**********************************************************`);
        let index = cachedQueue.length;
        //if singer is in queue, then put at the end.
        if (isEmpty(cachedQueue.find(qi => qi.singer.name.toLowerCase() === newSinger.name.toLowerCase()))) {
            index = cachedQueue.findIndex(function (e, idx, arr) {
                //return (index == arr.length - 1) ? true : isBetween(singers, newSinger, arr[index].singer, arr[index + 1].singer);
                if (idx == arr.length - 1) {
                    return true;
                } else {
                    //console.log(`index: ${idx}`);                   
                    //console.log(`looking for singer1: ${arr[idx].singer.name}`);
                    let foundSinger = singers.find(s => s.name === arr[idx].singer.name);
                    if (isEmpty(foundSinger)) {
                        // console.log(`singer not in singers list: ${arr[idx].singer.name}`)
                        // console.log(`**********************************************************`);
                        return false;
                    }
                    let s1c = foundSinger?.songCount ?? 0;
                    let value = nsc < s1c;
                    //let s1n = foundSinger?.name
                    //let ns = `n-singer:${nsn}(${nsc})`;
                    //let s1 = `singer:${s1n}(${s1c})`;
                    // console.log(`----- newSinger:${nsn}(${nsc}) singer1:${s1n}(${s1c})`);
                    // console.log(`----- ${value} = ${nsc} < ${s1c}`);
                    // console.log(`**********************************************************`);
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

    const isBetween = (arr: Singer[], targetSinger: Singer, startSinger: Singer, endSinger: Singer) => {
        // var startIndex = arr.findIndex(function (e) {return e.name.toLowerCase() === startSinger.name.toLowerCase();});
        // var endIndex = arr.findIndex(function (e) { return e.name.toLowerCase() == endSinger.name.toLowerCase() });
        // var targetIndex = arr.findIndex(function (e) { return e.name.toLowerCase() == targetSinger.name.toLowerCase() });

        var startIndex = arr.findIndex(function (e) { return e.name.toLowerCase() === startSinger.name.toLowerCase(); });
        var endIndex = arr.findIndex(function (e) { return e.name.toLowerCase() == endSinger.name.toLowerCase() });
        var targetIndex = arr.findIndex(function (e) { return e.name.toLowerCase() == targetSinger.name.toLowerCase() });

        console.log(`-- -- isBetween -  startSinger: ${startSinger} startIndex: ${startIndex}`)
        console.log(`-- -- isBetween -    endSinger: ${endSinger} endIndex: ${endIndex}`)
        console.log(`-- -- isBetween - targetSinger: ${targetSinger} targetIndex: ${targetIndex}`)

        let value = (startIndex < endIndex) ? (targetIndex > startIndex && targetIndex < endIndex) : (targetIndex > startIndex || targetIndex < endIndex);
        return value;
    };

    return { queue, addToQueue, deleteFromQueue, reorderQueue }
}