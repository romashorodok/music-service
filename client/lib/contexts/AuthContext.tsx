'use client'

import React from "react";

export const AuthContext = React.createContext<{
    accessToken: string,
    setAccessToken: React.Dispatch<React.SetStateAction<string>>
}>({
    accessToken: undefined,
    setAccessToken: undefined,
});

const TOKEN_KEY = "_token";

export function AuthContextProvider({children}: React.PropsWithChildren) {
    const [accessToken, setAccessToken] = React.useState<string>(null);

    React.useMemo(() =>
            typeof window !== "undefined"
                ? setAccessToken(localStorage.getItem(TOKEN_KEY))
                : null
        , []);

    React.useEffect(() =>
            accessToken || typeof window !== "undefined"
                ? localStorage.setItem(TOKEN_KEY, accessToken)
                : null
        , [accessToken]);

    return (
        <AuthContext.Provider value={{accessToken, setAccessToken}}>
            {children}
        </AuthContext.Provider>
    )
}
