'use client'

import React, {useState} from "react"
import usePlayer from "../hooks/usePlayer"
import * as Slider from '@radix-ui/react-slider';
import {PlayButton} from "./audio-card";
import {SpeakerLoudIcon, CheckIcon, ChevronDownIcon, ChevronUpIcon} from '@radix-ui/react-icons';
import * as Select from '@radix-ui/react-select';
// @ts-ignore
import shaka from "shaka-player";

const DEFAULT_VOLUME = 0.4;

const BITRATES = {
    "LOW": 64000,
    "NORMAL": 128000,
    "HIGH": 320000,
} as const;

type BITRATE = keyof typeof BITRATES

const BITRATE_KEYS: Array<BITRATE> = Object.keys(BITRATES) as Array<BITRATE>;

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

shaka.polyfill.installAll();

export default function ({className}: { className?: string }) {

    const [time, setTime] = React.useState<number>();
    const [duration, setDuration] = React.useState<number>();
    const [volume, setVolume] = React.useState<number>();
    const [bitrate, setBitrate] = React.useState<BITRATE>("HIGH");

    const playerRef = React.useRef<HTMLAudioElement>(null);

    const {setPlayer, audio, setPlaying, playing} = usePlayer();

    const [player] = useState<shaka.Player>(new shaka.Player());

    const visible = React.useMemo(() =>
            audio ?
                Object.values(audio)
                    .every((value) => value !== undefined && value !== null)
                : false
        , [audio]);

    React.useEffect(() => {

        if (audio?.manifest) {
            player.attach(playerRef.current).catch(console.error);

            player.configure({
                abr: {
                    enabled: true,
                    defaultBandwidthEstimate: BITRATES[bitrate]
                }
            });

            player.load(audio.manifest)
                .then(_ => {
                    console.log("Currently playing", audio.title);
                    onLoad();
                }).catch(console.error);

            playerRef.current.addEventListener('play', startPlayingState);
            playerRef.current.addEventListener('pause', stopPlayingState);
            playerRef.current.addEventListener('timeupdate', onUpdate);
            playerRef.current.addEventListener('volumechange', onVolumeChange);
        }

        return () => {
            playerRef?.current?.removeEventListener('play', startPlayingState);
            playerRef?.current?.removeEventListener('pause', stopPlayingState);
            playerRef?.current?.removeEventListener('timeupdate', onUpdate);
            playerRef?.current?.removeEventListener('volumechange', onVolumeChange);
        }
    }, [audio]);

    React.useEffect(() => {
        player.configure({
            abr: {
                enabled: true,
                restrictions: {
                    maxBandwidth: BITRATES[bitrate]
                }
            }
        });
    }, [bitrate])

    React.useEffect(() => {
        if (playerRef.current)
            playerRef.current.volume = volume;
    }, [volume]);

    function onLoad() {
        playerRef.current.play().catch(console.error);

        setPlayer(playerRef.current);

        playerRef.current.volume = DEFAULT_VOLUME;
        const time = playerRef.current.currentTime ?? 0;

        setTime(time);
        setDuration(playerRef.current.duration);
        setVolume(playerRef.current.volume);
    }

    function onVolumeChange(event: any) {
        setVolume(event.target.volume);
    }

    function onUpdate(event: any) {
        setTime(event.target.currentTime);
    }

    function startPlayingState() {
        setPlaying(true);

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
                            className="flex items-center justify-center bg-white bottom-[6px] right-[6px] rounded-3xl w-[33px] h-[33px]"
                            stopIconClassName="fill-curren text-black tw-[24px] h-[24px]"
                            playIconClassName="fill-curren text-black tw-[28px] h-[28px]"
                            active={playing}
                            onPlayClick={() => playerRef.current.play()}
                            onPauseClick={() => playerRef.current.pause()}
                        />

                    </div>
                    <div className="flex items-center space-x-4">
                        <p>{formatAudioDuration(time)}</p>
                        <Slider.Root
                            className={`relative flex items-center select-none touch-none w-[200px] h-5 ` + className}
                            value={[time]}
                            max={duration}
                            onValueChange={([time]) => playerRef.current.currentTime = time}
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
                        onValueChange={([volume]) => setVolume(volume)}
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
                        {BITRATE_KEYS.map(key => <SelectItem key={key} value={key}>{key}</SelectItem>)}
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

