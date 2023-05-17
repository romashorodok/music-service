'use client'

import React from "react";
import {AuthContext} from "~/lib/contexts/AuthContext";

export default function useAuth() {
    const {accessToken, setAccessToken} = React.useContext(AuthContext);

    return {accessToken, setAccessToken}
}

