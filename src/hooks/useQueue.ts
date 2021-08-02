import { useCallback } from "react";
import { useSelector } from "react-redux";
import { QueueItem } from "../models/QueueItem";
import { Song } from "../models/Song";
import { selectQueue } from "../store/store";

export function useQueue(): {
    queue: QueueItem[];
    deleteFromQueue: (item: QueueItem) => void;
    orderQueue: (items:QueueItem[]) => void;
}{
    const queue: QueueItem[] = useSelector(selectQueue);

    const deleteFromQueue = useCallback((item: QueueItem) => {
        console.log("useQueue - deleteFromQueue - queueItem", item);
    }, []);

    const orderQueue = useCallback((items:QueueItem[]) => {
        console.log("useQueue - orderQueue - queue", items);
    }, []);

    return { queue, deleteFromQueue, orderQueue }
}