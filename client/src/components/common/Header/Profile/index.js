import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState, useLocation } from 'react';
import axios from '../../../../utils/axios';
import convertAvatarPropToString from '../../../../utils/binaryToString';
import getFormattedDate from '../../../../utils/date';

const useStyles = makeStyles((theme) => ({
    infoLineStyle: {
        display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignContent: 'flex-end'
    },
    labelStyle: {
        marginTop: 7,
        marginRight: 20,
        textAlign: 'left'
    }
}));
export default function Profile({}) {
    const classes = useStyles();
    let [currentUser, setCurrentUser] = useState(JSON.parse(sessionStorage.getItem('currentuser')));
    let [displayname, setDisplayname] = useState(currentUser.displayname);
    let [password, setPassword] = useState(currentUser.password);
    let [avatar, setAvatar] = useState(currentUser.avatar);
    //let [statistic, setStatistic] = useState();
    let [fileName, setFileName] = useState("");

    const inputSize = 250;
    
    useEffect(() => {
        
    }, [displayname, password, avatar]);
    
    async function updateProfile() {
        const newUsername = document.getElementsByName("username")[0].value;
        const newPassword = document.getElementsByName("password")[0].value;
        const retypePassword = document.getElementsByName("retypepassword")[0].value;
        const newDisplayName = document.getElementsByName("displayname")[0].value;
        
        if (newPassword != retypePassword) {
            alert("Nhập lại mật khẩu không đúng");
            return;
        }
        if (newUsername.length < 5 || newUsername.length > 50 || newDisplayName.length < 5 || newDisplayName.length > 50) {
            alert("Username hoặc display name phải từ 5 đến 50 kí tự");
            return;
        }
        if (newPassword.length > 0 && newPassword.length < 6) {
            alert("Password phải từ 6 kí tự trở lên");
            return;
        }

        const api = await axios.post("api/users/update-profile", {iduser: currentUser._id, newPassword: newPassword, newDisplayName: newDisplayName, fileName: fileName});
        alert(api.data.message);
        if (api.data.data) {
            setCurrentUser(api.data.data);
            setDisplayname(api.data.data.displayname);
            setPassword(api.data.data.password);
            setAvatar(api.data.data.avatar);
            sessionStorage.setItem('currentuser', JSON.stringify(currentUser));
        }
    }

    const statistic = "Đã chơi " + currentUser.total_match + ", thắng " + currentUser.win_match + ", tỉ lệ " + currentUser.win_percent + "%";
    return (
        <div id="login-box" style={{background: 'lavender', marginBottom: '0px', height: '600px', width: '800px'}}>
            <form onSubmit={(e) => {e.preventDefault(); updateProfile(); }}  class="left" style={{marginLeft: '50px'}}>
                <h1 style={{color: 'red'}}>PROFILE</h1>
                <div style={{display: 'inline-flex'}}>
                    <div style={{display: 'inline-block'}}>
                        <div className={classes.infoLineStyle}>
                            <label className={classes.labelStyle}>Username</label>
                            <input type="text" name="username" value={currentUser.username} size={inputSize} style={{marginRight: '10px'}}/>
                        </div>
                        <div className={classes.infoLineStyle}>
                            <label className={classes.labelStyle}>DisplayName</label>
                            <input type="text" name="displayname" defaultValue={displayname} size={inputSize}/>
                        </div>
                        <div className={classes.infoLineStyle}>
                            <label className={classes.labelStyle}>JoinDate</label>
                            <input type="text" name="joindate" defaultValue={getFormattedDate(new Date(currentUser.join_date))} size={inputSize} disabled="true"/>
                        </div>
                        <div className={classes.infoLineStyle}>
                            <label className={classes.labelStyle}>Statistic</label>
                            <input type="text" name="matchstatistic" defaultValue={statistic} size={inputSize} disabled="true"/>
                        </div>
                        <div className={classes.infoLineStyle}>
                            <label className={classes.labelStyle}>Cup</label>
                            <input type="text" name="cup" defaultValue={currentUser.cup} size={inputSize} disabled="true"/>
                        </div>
                        <div className={classes.infoLineStyle}>
                            <label className={classes.labelStyle}>Email</label>
                            <input type="text" name="email" value={currentUser.email} size={inputSize}/>
                        </div>
                        
                        
                    </div>
                    <div style={{display: 'inline-block', flex: 'right', marginLeft: '50px'}}>
                        <div>Avatar</div>
                        <img style={{width: '200px', height: '200px'}} src={convertAvatarPropToString(avatar)}/>
                        <input id="fileName" type="file" onChange={() =>{ setFileName("D:/" + document.getElementById("fileName").files[0].name); }}/>
                    </div>
                </div>
                <input type="password" name="password" placeholder="Type new password if you need. If not, type again old password" style={{width: '450px'}} required/>
                <input type="password" name="retypepassword" placeholder="Retype password" style={{width: '450px'}} required/>
                <input type="submit" name="signup_submit" value="UPDATE PROFILE" style={{width: '150px'}}/>
            </form>
        </div>
    );
}