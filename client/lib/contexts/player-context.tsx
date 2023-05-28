'use client'

import React from "react";
import { Audio } from "~/lib/types/Audio";
import { useSubscription } from "../hooks/useSubscription";

type PlayableAudioContext = {
    audio: Audio;
    setAudio: React.Dispatch<React.SetStateAction<Audio>>;

    player: HTMLAudioElement;
    setPlayer: React.Dispatch<React.SetStateAction<HTMLAudioElement>>;

    playing: boolean;
    setPlaying: React.Dispatch<React.SetStateAction<boolean>>;

    volume: number;
    setVolume: React.Dispatch<React.SetStateAction<number>>;

    bitrate: BITRATE,
    setBitrate: React.Dispatch<React.SetStateAction<BITRATE>>;
}

export const DEFAULT_VOLUME = 0.4;

export const BITRATES = {
    "LOW": 64000,
    "NORMAL": 128000,
    "HIGH": 320000,
} as const;

export type BITRATE = keyof typeof BITRATES

export const BITRATE_KEYS: Array<BITRATE> = Object.keys(BITRATES) as Array<BITRATE>;

export const PlayerContext = React.createContext<PlayableAudioContext>(undefined);

function validManifest(audio: Audio): boolean {
    return audio.manifest && audio.manifest != '';
}

export function PlayerProvider({ children }: React.PropsWithChildren) {

    const [audio, setAudio] = React.useState<Audio>();
    const [player, setPlayer] = React.useState<HTMLAudioElement>();
    const [playing, setPlaying] = React.useState(false);
    const [volume, setVolume] = React.useState(DEFAULT_VOLUME);
    const [bitrate, setBitrate] = React.useState<BITRATE>(null);

    const context = React.useMemo<PlayableAudioContext>(() => ({
        audio, setAudio,
        player, setPlayer,
        playing, setPlaying,
        volume, setVolume,
        bitrate, setBitrate
    }), [audio, player, playing, volume, bitrate]);

    React.useEffect(() => {
        if (!audio) return;

        if (!validManifest(audio))
            setAudio(null);

    }, [audio]);

    return (
        <PlayerContext.Provider value={context}>
            {children}
        </PlayerContext.Provider>
    )
}

