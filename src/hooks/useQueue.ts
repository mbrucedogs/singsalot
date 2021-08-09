import { isEmpty, reject } from "lodash";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { QueueItem } from "../models/QueueItem";
import { Singer } from "../models/Singer";
import FirebaseService from "../services/FirebaseService";
import { selectQueue, selectSingers } from "../store/store";
import { Song } from "../models/Song";
import { useAppDispatch } from "./hooks";
import { queueSelectedSongChange, queueSelectedSongInfoChange } from "../store/slices/queue";

export function useQueue(): {
    queue: QueueItem[];
    selectedSong?: Song,
    selectedSongInfo?: Song,
    addToQueue: (singer: Singer, song: Song) => Promise<boolean>;
    deleteFromQueue: (item: QueueItem) => Promise<boolean>;
    reorderQueue: (fromIndex: number, toIndex: number) => Promise<boolean>;
    setSelectedSong: (song?: Song) => void;
    setSelectedInfoSong: (song?: Song) => void;
} {
    const {queue, selectedSong, selectedSongInfo} = useSelector(selectQueue);
    const singers = useSelector(selectSingers);
    const orderMultiplier = 10;
    const dispatch = useAppDispatch();

    const setSelectedSong = (song?: Song) => {
        dispatch(queueSelectedSongChange({song:song}));
    };

    const setSelectedInfoSong = (song?: Song) => {
        dispatch(queueSelectedSongInfoChange({song:song}));
    };

    const deleteFromQueue = useCallback((item: QueueItem): Promise<boolean> => {
        //console.log('deleteFromQueue', item)
        return doDeleteToQueue(item);
    }, [queue]);

    const reorderQueue = useCallback((fromIndex: number, toIndex: number): Promise<boolean> => {
        let ordered = [...queue];
        const itemToMove = ordered.splice(fromIndex, 1)[0];
        const updateditemToMove = {
            ...itemToMove,
            order: toIndex * orderMultiplier + 1,
        };
        ordered.splice(toIndex, 0, updateditemToMove);
        let reordered = ordered.map((qi, index) => {
            let order = index * orderMultiplier;
            let item: QueueItem = {
                ...qi,
                order: order,
            };
            return item;
        });
        return FirebaseService.updatePlayerQueue(updateditemToMove)
            .then( _ => FirebaseService.setPlayerQueue(reordered).then(resolve => resolve(true)).catch(e => reject(e)));
    }, [queue, singers]);

    const addToQueue = useCallback((singer: Singer, song: Song): Promise<boolean> => {
        //get the index for the order
        let order = getFairQueueOrder(singer);

        //update for the singer songcount
        let newSinger: Singer = {
            ...singer,
            songCount: singer.songCount + 1
        }

        //create the queue item 
        let queueItem: QueueItem = {
            order: order,
            singer: newSinger,
            song: song
        }
        //console.log("addToQueue: ", queueItem);
        //return new Promise<boolean>(resolve => resolve(true))
        return doAddToQueue(queueItem);
    }, [queue, singers]);

    const doAddToQueue = async (queueItem: QueueItem): Promise<boolean> => {
        try {
            await FirebaseService.updatePlayerSinger(queueItem.singer);

            //update the singers for the queue so you get the latest counts
            let queueWithSingersUpdate = queue.map(qi => {
                let foundSinger = singers.find(s => s.name === qi.singer.name);
                if (foundSinger) {
                    let nqi: QueueItem = {
                        ...qi,
                        singer: foundSinger.name === queueItem.singer.name ? queueItem.singer : foundSinger,
                    };
                    return nqi;
                } else {
                    return qi;
                }
            });

            //add new queueItem
            let sorted = [queueItem, ...queueWithSingersUpdate].sort((a: QueueItem, b: QueueItem) => {
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
            await FirebaseService.setPlayerQueue(reordered);
            return true;
        } catch (error) {
            return false;
        }
    };

    const doDeleteToQueue = async (queueItem: QueueItem): Promise<boolean> => {
        try {           
            //remove new queueItem
            //console.log("doDeleteToQueue queue", queue);
            let copy = [...queue];
            //console.log("doDeleteToQueue copy orig", copy);
            let delIdx = copy.findIndex(qi => qi === queueItem);
            //console.log("doDeleteToQueue delIndex", delIdx);
            copy.splice(delIdx,1);

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
    };

    //Private Functions
    const getFairQueueOrder = useCallback((newSinger: Singer) => {
        if (isEmpty(queue)) return 0;
        //console.log("getFairQueueOrder - current queue", queue);
        //console.log("getFairQueueOrder - newSinger", newSinger);
        //console.log("getFairQueueOrder - current singers", singers);
        if (queue.length == 1) return orderMultiplier + 1;
        let nsc = newSinger.songCount + 1; //add 1 since this hasn't been done yet
        let index = queue.length;

        //see if the singer exists, if not, put to the top of the queue since they would have a 0 count
        if (isEmpty(queue.find(qi => qi.singer.name.toLowerCase() === newSinger.name.toLowerCase())) && newSinger.songCount < 1) {
            index = 1;
            //see if there is a singer with the same song count as the newsinger
            //if so... set that as the index of where the singer should go
            let sameSongCount = queue.map(qi => { if (qi.singer.songCount == nsc) { return qi; } });
            if (!isEmpty(sameSongCount)) {
                let lastQueueItem = sameSongCount[sameSongCount.length - 1];
                if (lastQueueItem) {
                    console.log(`newSinger ${newSinger.name}:${nsc} - queueItemFound ${lastQueueItem.singer.name}: ${lastQueueItem.singer.songCount}`)
                    index = queue.lastIndexOf(lastQueueItem);
                }
            }
        } else {
            // get the index where they should go
            // index = queue.findIndex(function (e, idx, arr) {
            //     //if nothing has been found, return the last index
            //     if (idx == arr.length - 1) {
            //         return true;
            //     } else {
            //         //find the singer with the 
            //         let foundSinger = singers.find(s => s.name === arr[idx].singer.name);
            //         if (foundSinger) {
            //             console.log(`newSinger ${newSinger.name}:${nsc} < foundSinger ${foundSinger.name}: ${foundSinger.songCount}`)
            //             let s1c = foundSinger.songCount;
            //             let value = nsc < s1c;
            //             return value;    
            //         } else {
            //             return false;
            //         }
            //     }
            // });
            index = queue.length;
        }
        return (index * orderMultiplier) + 1;
    }, [queue, singers]);

    return { queue, selectedSong, selectedSongInfo, addToQueue, deleteFromQueue, reorderQueue, setSelectedSong, setSelectedInfoSong }
}