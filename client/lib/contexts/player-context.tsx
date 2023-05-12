'use client'

import React from "react";
import {PlayableAudio} from "~/lib/types/Player";


type PlayableAudioContext = {
    audio: PlayableAudio;
    setAudio: React.Dispatch<React.SetStateAction<PlayableAudio>>;

    player: HTMLAudioElement;
    setPlayer: React.Dispatch<React.SetStateAction<HTMLAudioElement>>;

    playing: boolean;
    setPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PlayerContext = React.createContext<PlayableAudioContext>(undefined);

export function PlayerProvider({children}: React.PropsWithChildren) {
    const [audio, setAudio] = React.useState<PlayableAudio>();
    const [player, setPlayer] = React.useState<HTMLAudioElement>();
    const [playing, setPlaying] = React.useState(false);

    const context = React.useMemo<PlayableAudioContext>(() => ({
        audio, setAudio, player, setPlayer, playing, setPlaying
    }), [audio, player, playing]);

    return (
        <PlayerContext.Provider value={context}>
            {children}
        </PlayerContext.Provider>
    )
}

