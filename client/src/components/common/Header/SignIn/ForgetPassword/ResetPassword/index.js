import React, { useEffect, useState, useLocation } from 'react';
import './index.css';
import axios from '../../../../../../utils/axios';
import { Redirect } from 'react-router-dom';

export default function ResetPassword() {
    const [isResetPasswordSuccess, setIsResetPasswordSuccess] = useState(false);
    useEffect(() => {
        
    }, []);

    

    async function resetPassword() {
        const password = document.getElementsByName("password")[0].value;
        const retypePassword = document.getElementsByName("retypePassword")[0].value;

        if (password != retypePassword) {
            alert("Nhập lại mật khẩu không đúng");
            return;
        }
        if (password.length < 6) {
            alert("Password phải từ 6 kí tự trở lên");
            return;
        }
        
        const key = window.location.pathname.split('/')[2];

        const api = await axios.post("api/users/reset-password", {key, password});
        alert(api.data.message);
        if (api.data.data) {
            setIsResetPasswordSuccess(true);
        }
    }
    if (isResetPasswordSuccess)
        return (<Redirect to="/sign-in"/>);

    return (
        <div id="login-box" style={{background: 'lavender', marginBottom: '0px'}}>
            <form onSubmit={(e) => {e.preventDefault(); resetPassword(); }} class="left">
                <h1>RESET MẬT KHẨU</h1>
                <input type="password" name="password" placeholder="Password" required/>
                <input type="password" name="retypePassword" placeholder="Retype password" required/>
                <input type="submit" name="signup_submit" value="THỰC HIỆN" />
            </form>
            
        </div>
    );
}