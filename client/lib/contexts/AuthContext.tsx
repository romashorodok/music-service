import React from "react";

export const AuthContext = React.createContext({
    accessToken: undefined,
    setAccessToken: undefined,
});

const TOKEN_KEY = "_token";

export function AuthContextProvider({children}: React.PropsWithChildren) {
    const [accessToken, setAccessToken] = React.useState<string>(null);

    React.useMemo(() => setAccessToken(localStorage.getItem(TOKEN_KEY)), []);

    React.useEffect(() =>
            accessToken
                ? localStorage.setItem(TOKEN_KEY, accessToken)
                : null
        , [accessToken]);

    return (
        <AuthContext.Provider value={{accessToken, setAccessToken}}>
            {children}
        </AuthContext.Provider>
    )
}
