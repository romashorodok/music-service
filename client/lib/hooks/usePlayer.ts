'use client'

import React from "react"
import {PlayerContext} from "../contexts/player-context"

export default function usePlayer() {
    return React.useContext(PlayerContext);
}
