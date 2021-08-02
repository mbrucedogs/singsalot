
export enum PlayerState {
    playing = "Playing",
    paused = "Paused",
    stopped = "Stopped"
}

export interface Player {
    state: PlayerState;
}
