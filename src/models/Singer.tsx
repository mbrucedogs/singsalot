import { Fabricable } from "./Fabricable";

export interface Singer extends Fabricable {
    songCount: number;
    name: string;
}
