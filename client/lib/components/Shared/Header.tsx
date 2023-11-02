'use client'

import useAuth from "~/lib/hooks/useAuth";
import Link from "next/link";
import React from "react";

export default function ({className}) {
    const [loading, setLoading] = React.useState<boolean>(true);

    const {accessToken, logout} = useAuth();

    React.useEffect(() => setLoading(false), []);

    return (
        <div
            className={`flex-[1] flex-grow flex flex-row items-center justify-between bg-primary shadow-[1px_1px_20px_black] px-4 ${className}`}>
            <div>
                <Link href={"/"}
                      className="px-[10px] text-white bg-violet9 flex-shrink-0 flex-grow-0 basis-auto h-[25px] rounded inline-flex text-[13px] leading-none items-center justify-center outline-none hover:bg-violet10 focus:relative">
                    Home
                </Link>
            </div>

            <div className='flex gap-4 items-center'>
                {!loading && accessToken
                    ? (
                        <>
                            <Link href={"/account"}
                                  className="px-[10px] text-white bg-violet9 flex-shrink-0 flex-grow-0 basis-auto h-[25px] rounded inline-flex text-[13px] leading-none items-center justify-center outline-none hover:bg-violet10 focus:relative">
                                Account
                            </Link>

                            <button
                                onClick={() => logout().catch()}
                                className="px-[10px] text-white bg-violet9 flex-shrink-0 flex-grow-0 basis-auto h-[25px] rounded inline-flex text-[13px] leading-none items-center justify-center outline-none hover:bg-violet10 focus:relative">
                                Log Out
                            </button>
                        </>
                    )
                    : (
                        <>
                            <Link href={"/login"}
                                  className="px-[10px] text-white bg-violet9 flex-shrink-0 flex-grow-0 basis-auto h-[25px] rounded inline-flex text-[13px] leading-none items-center justify-center outline-none hover:bg-violet10 focus:relative">
                                Log In
                            </Link>

                            <Link href={"/register"}
                                  className="px-[10px] text-white bg-violet9 flex-shrink-0 flex-grow-0 basis-auto h-[25px] rounded inline-flex text-[13px] leading-none items-center justify-center outline-none hover:bg-violet10 focus:relative">
                                Sin In
                            </Link>
                        </>
                    )
                }
            </div>
        </div>
    );
}
;
