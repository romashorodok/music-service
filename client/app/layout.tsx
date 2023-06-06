'use client'

import './globals.css'
import {PlayerProvider} from '~/lib/contexts/player-context'
import styles from './page.module.scss'
import React from "react";
import PlayerLayout from "~/lib/components/Player/PlayerLayout";


export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <head></head>
        <body>
        <PlayerProvider>
            <main className={`grid grid-cols-3 h-screen ${styles.grid_area}`}>
                <div className={`overflow-auto ${styles.area_content}`}>
                    {children}
                </div>
                <PlayerLayout/>
            </main>
        </PlayerProvider>
        </body>
        </html>
    )
}
