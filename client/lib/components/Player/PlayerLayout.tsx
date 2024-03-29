'use client'

import usePlayer from "~/lib/hooks/usePlayer";
import React from "react";
import Player from "~/lib/components/Player/Player";
import VolumeControl from "~/lib/components/Player/Controls/VolumeControl";
import BitrateControl from "~/lib/components/Player/Controls/BitrateControl";
import styles from '~/app/page.module.scss'

export default function () {
    const {audio} = usePlayer();

    const visible = React.useMemo(() =>
            audio ?
                Object.values(audio)
                    .every((value) => value !== undefined && value !== null)
                : false
        , [audio]);

    return visible ? (
        <div className={`flex flex-col justify-center bg-primary shadow-[1px_-5px_20px_black] ${styles.area_player}`}>
            <div className="flex flex-grow flex-row items-center mx-4 space-x-4">
                <div className="flex-[1] w-full">
                </div>
                <div className="flex flex-[2] w-full justify-center">
                    <Player/>
                </div>
                <div className="flex flex-[1] w-full">
                    <VolumeControl/>
                    <div className="mx-4">
                        <BitrateControl/>
                    </div>
                </div>
            </div>
        </div>
    ) : null;
}
