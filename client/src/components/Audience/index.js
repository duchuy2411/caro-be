import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";

import { useDispatch } from 'react-redux';
import { fetchUserInfoDialog } from '../../store/slice/userInfoDialogSlice';

const useStyles = makeStyles((theme) => ({

}));

export default function Audience({}) {
    const classes = useStyles();
    let [audienceList, setAudienceList] = useState([]);
    const dispatch = useDispatch();

    function getAudienceList() {
        setAudienceList([{ iduser: "5fd79ae65af5db095e4e6e75", displayname: "Lê" },
        { iduser: "5fd79af05af5db095e4e6e76", displayname: "Nguyễn" }]);
        // fetch(URL + "/api/board/username/" + username)
        //     .then(res => res.json())
        //     .then(res => setTableList(res))
        //     .catch(err => err);
    }

    useEffect(() => {
        getAudienceList();
    }, []);

    function renderAudienceItem(iduser, displayname) {
        return (
            <ListItem key={iduser} button>
                <Button onClick={() => displayUserInfoDialog(iduser)}>
                    <Avatar variant="circle" src='/img/user-icon.jpg' style={{width: 30, height: 30, marginRight: 10}}></Avatar>
                    <ListItemText primary={displayname} />
                </Button>
            </ListItem>
        )
    }

    function renderAudienceList() {
        let result = [];
        audienceList.map((audienceItem) => result.push(renderAudienceItem(audienceItem.iduser, audienceItem.displayname)));
        return result;
    }

    async function displayUserInfoDialog(iduser) {
        await dispatch(fetchUserInfoDialog({iduser}));
    }

    return (
        <div style={{ width: 180 }}>
            <Typography className={classes.title} variant="h5" component="h2" gutterBottom color="primary">
                Khán giả
            </Typography>
            <List>
                {renderAudienceList()}
            </List>
        </div>
    )
}