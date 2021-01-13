import { useState, useEffect } from "react"
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";
import axios from '../../../../utils/axios';

export default function CheckActivateAccount() {
    useEffect(async () => {
        await checkActivateAccount();
    }, [])

    async function checkActivateAccount() {
        const key = window.location.pathname.split('/')[2];
        
        const api = await axios.post("api/users/check-activate-account", {key: key});
        alert(api.data.message);
        
    }
    return (
        <div></div>
    )
}