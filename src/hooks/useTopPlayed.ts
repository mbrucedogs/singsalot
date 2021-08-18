import { TopPlayed } from "../models/types";
import { selectTopPlayed } from "../store/store";
import { useAppSelector } from "./hooks";

export const useTopPlayed = (): {
    topPlayed: TopPlayed[];
} => {
    const topPlayed = useAppSelector(selectTopPlayed);

    return { topPlayed }
}