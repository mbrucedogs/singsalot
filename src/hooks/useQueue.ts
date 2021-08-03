import { isEmpty } from "lodash";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { QueueItem } from "../models/QueueItem";
import { Singer } from "../models/Singer";
import FirebaseService from "../services/FirebaseService";
import { selectQueue } from "../store/store";

export function useQueue(): {
    queue: QueueItem[];
    addToQueue: (queueItem: QueueItem) => void;
    deleteFromQueue: (item: QueueItem) => void;
    orderQueue: (items:QueueItem[]) => void;
}{
    const queue = useSelector(selectQueue);

    const deleteFromQueue = useCallback((item: QueueItem) => {
        console.log("useQueue - deleteFromQueue - queueItem", item);
    }, []);

    const orderQueue = useCallback((items:QueueItem[]) => {
        console.log("useQueue - orderQueue - queue", items);
    }, []);

    const addToQueue = (queueItem: QueueItem) => { 
        var index = getFairQueueIndex(queueItem.singer);
        const copy = queue.slice(0);
        copy.splice(index, 0, queueItem);
        FirebaseService.setPlayerQueue(copy);
    }

    const getFairQueueIndex = (newSinger: Singer) => {
        if(isEmpty(queue)) return 0; 
        return queue.findIndex(function(e, index, arr) {
            return (index == arr.length - 1) ? true : isBetween(queue, newSinger.name, arr[index].singer.name, arr[index+1].singer.name);
        }) + 1;
    }

    const isBetween = (arr: QueueItem[], targetSinger: string, startSinger: string, endSinger: string) => {
        var start =  arr.findIndex(function(e) { return e.singer.name === startSinger });
        var end = arr.findIndex(function(e) { return e.singer.name == endSinger });
        var target = arr.findIndex(function(e) { return e.singer.name == targetSinger });
        return (start < end) ? (target > start && target < end) : (target > start || target < end);
    }

    return { queue, addToQueue, deleteFromQueue, orderQueue }
}