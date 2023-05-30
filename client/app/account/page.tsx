'use client'

import React from "react";
import axios from "axios";
import {API_HOST} from "~/env";

export default function () {
    const [account, setAccount] = React.useState<string>();

    React.useEffect(() => {
        axios.get(`${API_HOST}/user`)
            .then(resp => setAccount(JSON.stringify(resp.data)))
            .catch(console.log);
    }, []);

    return (
        <div>
            {account ?? <p>Unauthenticated</p>}
        </div>
    )
}
