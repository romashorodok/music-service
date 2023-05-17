'use client'

import React from "react";
import useAuth from "~/lib/hooks/useAuth";
import axios, {AxiosError, AxiosResponse} from "axios";
import {API_HOST} from "~/env";

export function AxiosInterceptorsContext({children}: React.PropsWithChildren) {
    const {accessToken, setAccessToken} = useAuth();

    const fulfilledInterceptor = (response: AxiosResponse) => response;

    React.useMemo(() => {

        const onErrorInterceptors = async (error: AxiosError) => {
            const statusCode = error.response?.status || 500;

            const flushToken = (resp) => {
                setAccessToken(null);

                return resp;
            }

            switch (statusCode) {
                case 401: {
                    try {
                        const {data: {token}} = await axios.post(`${API_HOST}/auth/refresh`).catch(flushToken);

                        if (!token) {
                            return Promise.reject(error);
                        }

                        const headers = error.config.headers
                        headers.Authorization = `Bearer ${token}`;

                        setAccessToken(token);

                        return axios(error.config).catch(flushToken);
                    } catch (e) {
                        return Promise.reject(e);
                    }
                }
            }
        }

        console.log("re render")

        axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        axios.interceptors.response.use(fulfilledInterceptor, onErrorInterceptors);
    }, [accessToken]);

    return <>{children}</>
}
