'use client'

import React, {useCallback} from "react";
import {AuthContext} from "~/lib/contexts/AuthContext";
import axios, {AxiosError} from "axios";
import {API_HOST} from "~/env";

type Interceptor = (error: AxiosError) => Promise<any>;

type LoginCredentials = {
    email: string;
    password: string;
}

type RegisterUserData = {
    email: string;
    password: string;
    name: string;
}

export default function useAuth() {
    const {accessToken, setAccessToken} = React.useContext(AuthContext);

    const refreshTokenInterceptor = useCallback<Interceptor>(
        async function (error: AxiosError) {
            const statusCode = error.response?.status || null;

            if (statusCode !== 401) {
                return Promise.reject(error);
            }

            try {
                const {data: {token}} = await axios.post(`${API_HOST}/auth/refresh`);

                const headers = error.config.headers;
                headers.Authorization = `Bearer ${token}`;
                setAccessToken(token);

                return axios(error.config).catch(() => setAccessToken(null));
            } catch (e) {
                console.error(e);
                setAccessToken(null);
                return Promise.reject(error);
            }
        }, [accessToken]);

    async function login(credentials: LoginCredentials) {
        try {
            const response = await axios.post(`${API_HOST}/auth/login`, credentials);
            const token = response.data.token || null;

            if (!token) {
                return Promise.reject({message: "Undefined token"});
            }

            setAccessToken(token);

            return response;
        } catch (e) {
            console.error(e);
            return Promise.reject(e);
        }
    }

    async function register(registerUserData: RegisterUserData) {
        try {
            const response = await axios.post(`${API_HOST}/auth/register`, registerUserData);
            const token = response.data.token || null;

            if (!token) {
                return Promise.reject({message: "Undefined token"});
            }

            setAccessToken(token);

            return response;
        } catch (e) {
            console.error(e);
            return Promise.reject(e);
        }
    }

    async function logout() {
        try {
            const response = await axios.post(`${API_HOST}/auth/logout`);

            setAccessToken(null);

            return response;
        } catch (e) {
            console.error(e);
            return Promise.reject(e);
        }
    }

    return {accessToken, setAccessToken, login, register, logout, refreshTokenInterceptor}
}

