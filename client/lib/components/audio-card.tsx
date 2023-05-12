'use client'

// import { Audio } from "pb/ts/audio/v1/audio_service_pb"
import usePlayer from "../hooks/usePlayer";
import * as AspectRatio from '@radix-ui/react-aspect-ratio';
import * as Toggle from '@radix-ui/react-toggle';
import React, {useState} from "react";
import {PlayIcon, StopIcon} from '@radix-ui/react-icons'

type Audio = {
    title: string;
}

type Props = {
    // audio: Audio.AsObject;
    audio: Audio;
    manifest: string;
}

type PlayButtonProps = {
    active?: boolean;

    onPlayClick: () => void;
    onPauseClick: () => void;

    playIconClassName: string;
    stopIconClassName: string;
    className: string;
}

export type OrNull<T> = T | null;

export const PlayButton = React.forwardRef<
    HTMLButtonElement,
    React.PropsWithChildren<Partial<PlayButtonProps>>
>(({
       onPauseClick,
       onPlayClick,
       active,
       playIconClassName,
       stopIconClassName,
       className,
       ...props
   }, ref: React.Ref<OrNull<HTMLButtonElement>>) => (
    <Toggle.Root
        ref={ref}
        onClick={active ? onPauseClick : onPlayClick}
        className={className}
        {...props}>
        {active
            ? <StopIcon className={stopIconClassName}/>
            : <PlayIcon className={playIconClassName}/>}
    </Toggle.Root>
))

export default function ({audio, manifest}: Props) {
    const {player, setAudio, audio: playingAudio, playing} = usePlayer();

    const [hoverButton, setHoverButton] = useState(false);

    return (
        <div onMouseEnter={() => setHoverButton(true)} onMouseLeave={() => setHoverButton(false)}
             className="justify-self-center shadow-blackA7 w-[180px] h-[200px] overflow-hidden bg-primary rounded-lg">
            <div className="flex flex-col p-4 w-full h-full">
                <AspectRatio.Root ratio={4 / 3} className="relative w-full h-full">
                    <img className="h-full w-full object-cover" src="stub-cover.jpg"/>

                    {hoverButton
                        ? <PlayButton
                            className="flex items-center justify-center bg-white absolute bottom-[6px] right-[6px] rounded-3xl bg-black w-[49px] h-[49px]"
                            stopIconClassName="fill-curren text-black tw-[24px] h-[24px]"
                            playIconClassName="fill-curren text-black tw-[28px] h-[28px]"
                            active={false}
                            onPlayClick={() => setAudio({...audio, manifest})}
                            onPauseClick={() => null}/>
                        : null}

                    {/*{playingAudio?.audioId === audio?.audioId*/}
                    {/*    ? <PlayButton*/}
                    {/*        className="flex items-center justify-center bg-white absolute bottom-[6px] right-[6px] rounded-3xl bg-black w-[49px] h-[49px]"*/}
                    {/*        stopIconClassName="fill-curren text-black tw-[24px] h-[24px]"*/}
                    {/*        playIconClassName="fill-curren text-black tw-[28px] h-[28px]"*/}
                    {/*        active={playing}*/}
                    {/*        onPlayClick={player?.play}*/}
                    {/*        onPauseClick={player?.pause} />*/}
                    {/*    : null}*/}

                </AspectRatio.Root>
                <h4 className="flex-[2] text-lg font-bold h-[36px] overflow-hidden overflow-ellipsis">{audio.title}</h4>
            </div>
        </div>
    )
}

