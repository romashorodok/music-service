'use client'

import React from "react"
import { PlayerContext } from "../contexts/player-context"

export default function usePlayer() {
    const context = React.useContext(PlayerContext);

    return context;
}
