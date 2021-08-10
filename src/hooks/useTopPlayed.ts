import { useSelector } from "react-redux";
import { TopPlayed } from "../models/TopPlayed";
import { selectTopPlayed } from "../store/store";

export const useTopPlayed = (): {
    topPlayed: TopPlayed[];
} => {
    const topPlayed = useSelector(selectTopPlayed);

    return { topPlayed }
}