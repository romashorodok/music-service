'use client'

import React from "react"
import {PlayerContext} from "../contexts/player-context"
import { useSubscription } from "./useSubscription";

export default function usePlayer() {
    const { subscriberAction } = useSubscription();

    const ALLOW_HIGH_BITRATE = React.useMemo<boolean>(() => subscriberAction({
        grants: ['UNLIMITED']
    }), [subscriberAction]);

    return {ALLOW_HIGH_BITRATE, ...React.useContext(PlayerContext)};
}
