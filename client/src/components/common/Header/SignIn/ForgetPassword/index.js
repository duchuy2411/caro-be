import React, { useEffect, useState, useLocation } from 'react';
import './index.css';
import axios from '../../../../../utils/axios';
import { Redirect } from 'react-router-dom';

export default function ForgetPassword() {
    const requestPasswordUrl = "/forget-password";
    const [isResetPasswordSuccess, setIsResetPasswordSuccess] = useState(false);
    useEffect(() => {
        //fetch(URL + "/sign-in");
    }, []);

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    async function forgetPassword() {
        const email = document.getElementsByName("email")[0].value;
        
        if (!validateEmail(email)) {
            alert("Email không đúng định dạng");
            return;
        }
        const api = await axios.post("api/users/forget-password", {email});
        alert(api.data.message);
        if (api.data.data) {
            setIsResetPasswordSuccess(true);
            
        }
    }
    if (isResetPasswordSuccess)
        return (<Redirect to="/sign-in"/>);

    return (
        <div id="login-box" style={{background: 'lavender', marginBottom: '0px'}}>
            <form onSubmit={(e) => {e.preventDefault(); forgetPassword(); }} class="left">
                <h1>LẤY LẠI MẬT KHẨU</h1>
                <input type="text" name="email" placeholder="Nhập email" required/>
                <input type="submit" name="signup_submit" value="THỰC HIỆN" />
            </form>
            
        </div>
    );
}