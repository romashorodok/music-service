'use client'

import React from "react"
import usePlayer from "../hooks/usePlayer"
// import dashjs from "dashjs";
// import {MINIO_HOST} from "~/env";
import * as Slider from '@radix-ui/react-slider';
import {PlayButton} from "./audio-card";
import {SpeakerLoudIcon, CheckIcon, ChevronDownIcon, ChevronUpIcon} from '@radix-ui/react-icons';
import * as Select from '@radix-ui/react-select';

const DEFAULT_VOLUME = 0.4;

const BITRATES = {
    "LOW": 0,
    "NORMAL": 1,
    "HIGHT": 2
} as const;

type BITRATE = keyof typeof BITRATES

const BITRATES_KEYS: Array<BITRATE> = Object.keys(BITRATES) as Array<BITRATE>;

function formatAudioDuration(duration: number) {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration - (hours * 3600)) / 60);
    const seconds = Math.floor(duration - (hours * 3600) - (minutes * 60));

    let formattedDuration = "";

    if (hours > 0) {
        formattedDuration += hours + ":";
    }

    if (minutes > 0) {
        formattedDuration += minutes + ":";
    } else {
        formattedDuration += "00:";
    }

    formattedDuration += seconds;

    return formattedDuration;
}

export default function ({className}: { className?: string }) {
    // const [player] = React.useState(dashjs.MediaPlayer().create());
    const [initialized, setInitialized] = React.useState<boolean>(false);

    const [time, setTime] = React.useState<number>();
    const [duration, setDuration] = React.useState<number>();
    const [volume, setVolume] = React.useState<number>();
    const [bitrate, setBitrate] = React.useState<BITRATE>("HIGHT");

    const playerRef = React.useRef<HTMLAudioElement>(null);

    const {setPlayer, audio, setPlaying, playing} = usePlayer();

    const visible = React.useMemo(() =>
            audio ?
                Object.values(audio)
                    .every((value) => value !== undefined && value !== null)
                : false
        , [audio]);

    React.useEffect(() => {
        // player.on('playbackPaused', stopPlayingState);
        // player.on('playbackPlaying', startPlayingState);
        // player.on('qualityChangeRequested', onBitrateChange);
        //
        playerRef?.current?.addEventListener('timeupdate', onUpdate);
        playerRef?.current?.addEventListener('volumechange', onVolumeChange);

        if (audio?.manifest) {
            // player?.initialize(playerRef.current, MINIO_HOST + audio.manifest, true, 0);
            // player.updateSettings({
            //     streaming: {
            //         abr: {
            //             autoSwitchBitrate: {
            //                 audio: false
            //             },
            //         },
            //     }
            // })
            // setInitialized(true);
            // setPlayer(player);
        }

        return () => {
            // player.off("playbackPaused", stopPlayingState);
            // player.off("playbackPlaying", startPlayingState);
            // player.off("qualityChangeRequested", onBitrateChange);

            playerRef?.current?.removeEventListener('timeupdate', onUpdate);
            playerRef?.current?.removeEventListener('volumechange', onVolumeChange);
        }
    }, [audio]);

    React.useEffect(() => {
        // if (initialized) player.setQualityFor("audio", BITRATES[bitrate])
        //
        // if (player && initialized) {
        //     player.setQualityFor("audio", BITRATES[bitrate], true);
        // }

    }, [bitrate])

    function onBitrateChange(event: any) {
        console.log(event)
    }

    function onVolumeChange(event: any) {
        setVolume(event.target.volume);
    }

    function onUpdate(event: any) {
        setTime(event.target.currentTime);
    }

    function startPlayingState() {
        // setPlaying(true);
        // setDuration(player.duration());
        //
        // if (!volume)
        //     player.setVolume(DEFAULT_VOLUME)
        //
        // setVolume(player.getVolume());
        // player.setQualityFor("audio", BITRATES[bitrate], true);
    }

    function stopPlayingState() {
        setPlaying(false);
    }

    return visible
        ? (
            <div className="flex flex-row gap-2 pt-2">
                <audio ref={playerRef}/>

                <div>
                    <div className="flex justify-center">
                        <PlayButton
                            className="flex items-center justify-center bg-white bottom-[6px] right-[6px] rounded-3xl bg-black w-[33px] h-[33px]"
                            stopIconClassName="fill-curren text-black tw-[24px] h-[24px]"
                            playIconClassName="fill-curren text-black tw-[28px] h-[28px]"
                            active={playing}
                            // onPlayClick={() => player.play()}
                            // onPauseClick={() => player.pause()}
                        />

                    </div>
                    <div className="flex items-center space-x-4">
                        <p>{formatAudioDuration(time)}</p>
                        <Slider.Root
                            className={`relative flex items-center select-none touch-none w-[200px] h-5 ` + className}
                            value={[time]}
                            max={duration}
                            onValueChange={([duration]) => playerRef.current.currentTime = duration}
                            defaultValue={[0]}
                            step={1}
                            aria-label="Volume">
                            <Slider.Track className="bg-blackA10 relative grow rounded-full h-[3px]">
                                <Slider.Range className="absolute bg-white rounded-full h-full"/>
                            </Slider.Track>
                            <Slider.Thumb
                                className="block w-5 h-5 bg-white shadow-[0_2px_10px] shadow-blackA7 rounded-[10px] hover:bg-violet3 focus:outline-none focus:shadow-[0_0_0_5px] focus:shadow-blackA8"/>

                        </Slider.Root>
                        <p>{formatAudioDuration(duration)}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-4 ml-5">
                    <SpeakerLoudIcon/>

                    <Slider.Root
                        className={`relative flex items-center select-none touch-none w-[80px] h-5 ` + className}
                        value={[volume]}
                        max={1}
                        // onValueChange={([volume]) => player.setVolume(volume)}
                        defaultValue={[0]}
                        step={0.1}
                        aria-label="Volume">
                        <Slider.Track className="bg-blackA10 relative grow rounded-full h-[3px]">
                            <Slider.Range className="absolute bg-white rounded-full h-full"/>
                        </Slider.Track>
                        <Slider.Thumb
                            className="block w-5 h-5 bg-white shadow-[0_2px_10px] shadow-blackA7 rounded-[10px] hover:bg-violet3 focus:outline-none focus:shadow-[0_0_0_5px] focus:shadow-blackA8"/>
                    </Slider.Root>

                    <SelectBitrate setBitrate={setBitrate} bitrate={bitrate}/>
                </div>
            </div>
        )
        : null
}

const SelectBitrate = ({bitrate, setBitrate}) => (
    <Select.Root defaultValue={bitrate} onValueChange={setBitrate}>
        <Select.Trigger
            className="inline-flex items-center justify-center rounded px-[15px] text-[13px] leading-none h-[35px] gap-[5px] bg-white text-violet11 shadow-[0_2px_10px] shadow-black/10 hover:bg-mauve3 focus:shadow-[0_0_0_2px] focus:shadow-black data-[placeholder]:text-violet9 outline-none">
            <Select.Value placeholder="Select a bitrate"/>
            <Select.Icon className="text-violet11">
                <ChevronDownIcon/>
            </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
            <Select.Content
                className="overflow-hidden bg-white rounded-md shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
                <Select.ScrollUpButton
                    className="flex items-center justify-center h-[25px] bg-white text-violet11 cursor-default">
                    <ChevronUpIcon/>
                </Select.ScrollUpButton>
                <Select.Viewport className="p-[5px]">
                    <Select.Group>
                        <Select.Label className="px-[25px] text-xs leading-[25px] text-mauve11">
                            Bitrate
                        </Select.Label>
                        <Select.Separator className="h-[1px] bg-violet6 m-[5px]"/>
                        {BITRATES_KEYS.map(key => <SelectItem key={key} value={key}>{key}</SelectItem>)}
                    </Select.Group>
                </Select.Viewport>
                <Select.ScrollDownButton
                    className="flex items-center justify-center h-[25px] bg-white text-violet11 cursor-default">
                    <ChevronDownIcon/>
                </Select.ScrollDownButton>
            </Select.Content>
        </Select.Portal>
    </Select.Root>
);

const SelectItem = React.forwardRef<
    HTMLDivElement,
    React.PropsWithChildren<{ className?: string, value: string }>
>(({children, className, ...props}, forwardedRef) => {
    return (
        <Select.Item
            className={'text-[13px] leading-none text-violet11 rounded-[3px] flex items-center h-[25px] pr-[35px] pl-[25px] relative select-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1' + className}
            {...props}
            ref={forwardedRef}>
            <Select.ItemText>{children}</Select.ItemText>
            <Select.ItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
                <CheckIcon/>
            </Select.ItemIndicator>
        </Select.Item>
    );
});

