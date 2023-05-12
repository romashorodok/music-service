'use client'

import { grpc } from '@improbable-eng/grpc-web'
import './globals.css'
import { NodeHttpTransport } from '@improbable-eng/grpc-web-node-http-transport'
import { PlayerProvider } from '~/lib/contexts/player-context'
import styles from './page.module.scss'
import Player from '~/lib/components/player';
import { HomeIcon, UploadIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import React from "react";

grpc.setDefaultTransport(NodeHttpTransport())

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <head>
                <style>
                    {/*@import url('https://fonts.googleapis.com/css2?family=Darker+Grotesque:wght@300;400;500;700;800;900&display=swap');*/}
                </style>
            </head>
            <body>
                <PlayerProvider>
                    <main className={`grid grid-cols-3 h-screen ${styles.grid_area}`}>
                        <div className={`overflow-auto ${styles.area_content}`} >
                            {children}
                        </div>

                        <div className={`flex justify-center bg-primary ${styles.area_player}`}>
                            <div className="flex-[1] flex-grow flex flex-row items-center mx-4 space-x-4" >
                                <div>
                                    <Link href={"/"} className="flex items-center justify-center bg-white bottom-[6px] right-[6px] rounded-3xl bg-black w-[33px] h-[33px]" >
                                        <HomeIcon className="fill-curren text-black tw-[28px] h-[28px]" />
                                    </Link>
                                    <p>Home</p>
                                </div>
                                <div>
                                    <Link href={"/upload"} className="flex items-center justify-center bg-white bottom-[6px] right-[6px] rounded-3xl bg-black w-[33px] h-[33px]" >
                                        <UploadIcon className="fill-curren text-black tw-[28px] h-[28px]" />
                                    </Link>
                                    <p>Upload</p>
                                </div>

                            </div>
                            <div className="flex-[2] flex-grow">
                                <Player className="w-[400px]" />
                            </div>
                            <div className="flex-[3] flex-grow flex justify-end">
                                <p>Here user account</p>
                            </div>
                        </div>
                    </main>
                </PlayerProvider>
            </body>
        </html>
    )
}
