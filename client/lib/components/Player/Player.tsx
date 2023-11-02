'use client'

import React, { useState } from "react"
import * as Slider from '@radix-ui/react-slider';
import usePlayer from "~/lib/hooks/usePlayer";
import { PlayButton } from "~/lib/components/audio-card";
import { BITRATES, DEFAULT_VOLUME } from "~/lib/contexts/player-context";
import { useSubscription } from "~/lib/hooks/useSubscription";
import useAuth from "~/lib/hooks/useAuth";

if (typeof window !== 'undefined') {
    // @ts-ignore
    import('shaka-player').then((module) => {
        shaka = module.default;
        shaka.polyfill.installAll();
    });
}
let shaka;

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


type Props = {
    className?: string;
    sliderClassName?: string;
};

/* eslint-disable */
export default React.forwardRef<
    HTMLDivElement,
    React.PropsWithChildren<Props>
>(({ children, className, sliderClassName, ...props }, forwardedRef) => {
    const playerRef = React.useRef<HTMLAudioElement>();

    const [player] = useState<shaka.Player>(new shaka.Player());
    const [time, setTime] = React.useState<number>();
    const [duration, setDuration] = React.useState<number>();

    const { ALLOW_HIGH_BITRATE, setPlayer, audio, setPlaying, playing, bitrate, setBitrate } = usePlayer();

    const { subscriberAction } = useSubscription();

    const ALLOW_DURATION_CHANGE = React.useMemo<boolean>(() => subscriberAction({
        grants: ['UNLIMITED', 'EXTENDED']
    }), [subscriberAction]);

    React.useEffect(() => {
        setBitrate(ALLOW_HIGH_BITRATE ? "HIGH" : "NORMAL")
    }, [ALLOW_HIGH_BITRATE]);

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
        }

        return () => {
            playerRef?.current?.removeEventListener('play', startPlayingState);
            playerRef?.current?.removeEventListener('pause', stopPlayingState);
            playerRef?.current?.removeEventListener('timeupdate', onUpdate);
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

    function onLoad() {
        playerRef.current.play().catch(console.error);

        setPlayer(playerRef.current);

        playerRef.current.volume = DEFAULT_VOLUME;
        const time = playerRef.current.currentTime ?? 0;

        setTime(time);
        setDuration(playerRef.current.duration);
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

    function onUserChangeDuration(time: number) {
        if (ALLOW_DURATION_CHANGE) {
            playerRef.current.currentTime = time;
        }
    }

    return (
        <div className={`${className}`} {...props} ref={forwardedRef}>
            <audio ref={playerRef} />

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
                <div className={`flex items-center space-x-4 ${sliderClassName}`}>
                    <p>{formatAudioDuration(time)}</p>
                    <Slider.Root
                        className={`relative flex items-center select-none touch-none w-[200px] h-5`}
                        value={[time]}
                        max={duration}
                        onValueChange={([time]) => onUserChangeDuration(time)}
                        defaultValue={[0]}
                        step={1}
                        aria-label="Volume">
                        <Slider.Track className={`relative grow rounded-full h-[3px] ${ALLOW_DURATION_CHANGE ? 'bg-blackA10' : 'bg-white'}`}>
                            <Slider.Range className={`absolute bg-white rounded-full h-full`} />
                        </Slider.Track>
                        <Slider.Thumb
                            className="block w-5 h-5 bg-white shadow-[0_2px_10px] shadow-blackA7 rounded-[10px] hover:bg-violet3 focus:outline-none focus:shadow-[0_0_0_5px] focus:shadow-blackA8" />
                    </Slider.Root>
                    <p>{formatAudioDuration(duration)}</p>
                </div>
            </div>
        </div>
    );
});
