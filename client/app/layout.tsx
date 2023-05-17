'use client'

import './globals.css'
import {PlayerProvider} from '~/lib/contexts/player-context'
import styles from './page.module.scss'
import React from "react";
import PlayerLayout from "~/lib/components/Player/PlayerLayout";
import {AuthContextProvider} from "~/lib/contexts/AuthContext";
import Link from "next/link";
import {HomeIcon, UploadIcon} from '@radix-ui/react-icons'
import {AxiosInterceptorsContext} from "~/lib/contexts/AxiosInterceptorContext";

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <head></head>
        <body>
        <AuthContextProvider>
            <AxiosInterceptorsContext>
                <PlayerProvider>
                    <main className={`grid grid-cols-3 h-screen ${styles.grid_area}`}>
                        <div className={`overflow-auto ${styles.area_content}`}>
                            {children}
                        </div>
                        <div className="flex-[1] flex-grow flex flex-row items-center mx-4 space-x-4">
                            <div>
                                <Link href={"/"}
                                      className="flex items-center justify-center bg-white bottom-[6px] right-[6px] rounded-3xl w-[33px] h-[33px]">
                                    <HomeIcon className="fill-curren text-black tw-[28px] h-[28px]"/>
                                </Link>
                                <p>Home</p>
                            </div>
                            <div>
                                <Link href={"/upload"}
                                      className="flex items-center justify-center bg-white bottom-[6px] right-[6px] rounded-3xl w-[33px] h-[33px]">
                                    <UploadIcon className="fill-curren text-black tw-[28px] h-[28px]"/>
                                </Link>
                                <p>Upload</p>
                            </div>
                            <div>
                                <Link href={"/account"}
                                      className="flex items-center justify-center bg-white bottom-[6px] right-[6px] rounded-3xl w-[33px] h-[33px]">
                                    <UploadIcon className="fill-curren text-black tw-[28px] h-[28px]"/>
                                </Link>
                                <p>Account</p>
                            </div>

                            <div>
                                <Link href={"/login"}
                                      className="flex items-center justify-center bg-white bottom-[6px] right-[6px] rounded-3xl w-[33px] h-[33px]">
                                    <HomeIcon className="fill-curren text-black tw-[28px] h-[28px]"/>
                                </Link>
                                <p>Login</p>
                            </div>

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
