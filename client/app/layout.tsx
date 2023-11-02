'use client'

import './globals.css'
import {PlayerProvider} from '~/lib/contexts/player-context'
import styles from './page.module.scss'
import React from "react";
import PlayerLayout from "~/lib/components/Player/PlayerLayout";
import {AuthContextProvider} from "~/lib/contexts/AuthContext";
import {AxiosInterceptorsContext} from "~/lib/contexts/AxiosInterceptorContext";
import Header from "~/lib/components/Shared/Header";

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <head></head>
        <body>
        <AuthContextProvider>
            <AxiosInterceptorsContext>
                <PlayerProvider>
                    <main className={`grid grid-cols-3 h-screen ${styles.grid_area}`}>
                        <Header className={`${styles.area_header}`}/>

                        <div className={`overflow-auto ${styles.area_content}`}>
                            {children}
                        </div>

                        <PlayerLayout/>
                    </main>
                </PlayerProvider>
            </AxiosInterceptorsContext>
        </AuthContextProvider>
        </body>
        </html>
    )
}
