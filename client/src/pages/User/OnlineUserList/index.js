import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FixedSizeList } from 'react-window';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import UserInfoDialog from '../UserInfoDialog/index.js';
import io from "socket.io-client";

import axios from "../../../utils/axios";

import { useDispatch, useSelector } from 'react-redux';
//import { userInfoDialogUpdate } from '../../../store/slice/userInfoDialogSlice';
import { fetchUserInfoDialog } from '../../../store/slice/userInfoDialogSlice';
import { selectOnlineUser, selectOpenOnlineUserList, openOnlineUserList, closeOnlineUserList } from '../../../store/slice/onlineUsersSlice';
import convertAvatarPropToString from '../../../utils/binaryToString';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    title: {
        color: '#87CEFA',
        display: 'flex',
        justifyContent: 'center'
    },
}));

//const socket = io('http://localhost:8000');

export default function OnlineUserList() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const onlineUserList = useSelector(selectOnlineUser);
    const isOpenOnlineUserList = useSelector(selectOpenOnlineUserList);

    let [onlineUserListView, setOnlineUserListView] = useState([]);
    //let [avatar, setAvatar] = useState(null);
    //let imgSrc = "/img/user-icon.jpg";
    useEffect(() => {
        renderOnlineUserList();
    }, [onlineUserList.length]);

    function renderOnlineUserItem(iduser, displayname, avatar) {
        // axios.get("api/users/id/" + iduser)
        //     .then(res => {
        //         setAvatar(res.data.data.user.avatar);
        //     })
        //     .catch(error => { })
        return (
            <ListItem key={iduser} button>
                <Button id={iduser} onClick={() => displayUserInfoDialog(iduser)}>
                    <Avatar variant="circle" src={convertAvatarPropToString(avatar)} style={{width: 40, height: 40, marginRight: 10}}></Avatar>
                    <ListItemText style={{color: 'greenyellow'}} primary={displayname} />
                </Button>
            </ListItem>
        )
    }

    function renderOnlineUserList() {
        let result = [];
        onlineUserList.map((onlineUserItem) => result.push(renderOnlineUserItem(onlineUserItem.iduser, onlineUserItem.displayname, onlineUserItem.avatar)));
        //return result;
        setOnlineUserListView(result);
    }

    async function displayUserInfoDialog(iduser) {
        await dispatch(fetchUserInfoDialog({iduser}));
    }

    let minimizeImg = { cursor: 'pointer', float: 'right', marginTop: '5px', width: '20px',  };
    let maximizeImg = { cursor: 'pointer', float: 'right', marginTop: '5px', width: '20px',  };
    return (
        <div style={{marginLeft: 20, height: 500}}>
            <div hidden={!isOpenOnlineUserList} style={{ backgroundImage: 'url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSF8tq7J9mu_6vdiGTDAMwY9hC5t_ti2ukrhg&usqp=CAU")', width: 220 }}>
                <img src='https://aux.iconspalace.com/uploads/2024895475923021781.png' style={minimizeImg} onClick={() => { dispatch(closeOnlineUserList()) }} />
                <Typography className={classes.title} variant="h5" component="h2" gutterBottom color="primary">
                    Kỳ thủ
                </Typography>
                <List>
                    {onlineUserListView}
                </List>
            </div>
            <div hidden={isOpenOnlineUserList} style={{ backgroundImage: 'url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSF8tq7J9mu_6vdiGTDAMwY9hC5t_ti2ukrhg&usqp=CAU")', width: 220 }}>
                <img src='https://cdn3.iconfinder.com/data/icons/cosmo-color-player-2/40/window_fullscreen_1-512.png' style={maximizeImg} onClick={() => { dispatch(openOnlineUserList()) }} />
                <Typography className={classes.title} variant="h5" component="h2" gutterBottom color="primary">
                    Kỳ thủ
                </Typography>
            </div>
        </div>
    )
}