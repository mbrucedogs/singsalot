export interface ISong{
    key: string;
    artist: string;
    title: string;
    count: number;
    disabled: boolean;
    path: string;
}

export interface ISinger {
    key: string;
    name: string;
}

export interface IQueueItem{ 
    key: string;
    singer: ISinger;
    song: ISong;
}

export interface ISettings{ 
    autoadvance: boolean;
    userpick: boolean;
}

export interface IPlayer{
    queue: [IQueueItem];
    singers: [ISinger];
    settings: ISettings;
    state: string;
}

export interface ISongListSongs{ 
    artist: string;
    position: number;
    title: string;
    foundSongs: [ISong];
}

export interface ISongList{ 
    title: string;
    songs: [ISongListSongs]
}