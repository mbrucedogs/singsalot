import { useSelector } from "react-redux";
import { TopPlayed } from "../models/TopPlayed";
import { selectTopPlayed } from "../store/store";

export function useTopPlayed(): {
    topPlayed: TopPlayed[];
} {
    const topPlayed = useSelector(selectTopPlayed);

    return { topPlayed }
}