'use client'

import React from "react";
import useAuth from "~/lib/hooks/useAuth";
import axios, {AxiosResponse} from "axios";

const fulfilledInterceptor = (response: AxiosResponse) => response;

export function AxiosInterceptorsContext({children}: React.PropsWithChildren) {
    const {accessToken, refreshTokenInterceptor} = useAuth();

    React.useMemo(() => {
        axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        axios.interceptors.response.use(fulfilledInterceptor, refreshTokenInterceptor);
    }, [accessToken]);

    return <>{children}</>
}
