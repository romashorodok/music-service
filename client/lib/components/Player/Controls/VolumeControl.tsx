import {SpeakerLoudIcon} from "@radix-ui/react-icons";
import * as Slider from "@radix-ui/react-slider";
import React from "react";
import usePlayer from "~/lib/hooks/usePlayer";

export default function () {
    const {volume, setVolume, player} = usePlayer();

    React.useEffect(() => {
        if (player)
            player.volume = volume;
    }, [volume, player]);

    return (
        <div className="flex items-center space-x-4 ml-5">
            <SpeakerLoudIcon/>

            <Slider.Root
                className={`relative flex items-center select-none touch-none w-[80px] h-5 `}
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
        </div>
    );
}
