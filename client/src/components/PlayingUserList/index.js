import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserInfoDialog } from '../../store/slice/userInfoDialogSlice';
import { selectPlayingUser, selectRerender } from '../../store/slice/playingUsersSlice';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';

import convertAvatarPropToString from '../../utils/binaryToString';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";
import { set } from 'js-cookie';


const useStyles = makeStyles((theme) => ({
    playingUserInfoStyle: {
        width: 180, 
        height: 180, 
        justifyContent: 'center', 
        backgroundImage: 'url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSF8tq7J9mu_6vdiGTDAMwY9hC5t_ti2ukrhg&usqp=CAU")'
    }

}));

export default function PlayingUserInfo({second, oppSecond, hostPlayerId }) {
    const classes = useStyles();
    const dispatch = useDispatch();

    const flexContainer = {
        display: 'flex',
        flexDirection: 'row',
        padding: 0
    };
    let playingUserList = useSelector(selectPlayingUser);
    let rerender = useSelector(selectRerender);
    let [playingUserListView, setPlayingUserListView] = useState([]);
    let [currentUserId, setCurrentUserId] = useState(JSON.parse(sessionStorage.getItem('currentuser'))._id);

    // useEffect(() => {
    //     //renderPlayingUserListView();
    //     //finishedRerender();
    // }, [hostPlayerId, rerender]);

    async function displayUserInfoDialog(iduser) {
        await dispatch(fetchUserInfoDialog({iduser}));
    }

    if (!hostPlayerId) {
        return (
            <List style={{ width: '200px' }}></List>
        );
    }

    if (currentUserId === hostPlayerId) {
        return (
            <List style={{ width: '200px' }}>
                {playingUserList[0] ? (
                    <ListItem key={playingUserList[0]._id}>
                        <Card className={ classes.playingUserInfoStyle }>
                            <CardContent>
                                <div style={flexContainer}>
                                    <Button onClick={() => displayUserInfoDialog(playingUserList[0]._id)}>
                                        <Avatar variant="square"  src={convertAvatarPropToString(playingUserList[0].avatar)} style={{width: 60, height: 60}}></Avatar>
                                    </Button>
                                    <div style={{marginLeft: 30, margin: 'auto'}}>
                                        {/* <Typography className={classes.title} variant="h6" component="h6" style={{color: 'red', margin: 0}} gutterBottom>
                                            {playingUser.score}
                                        </Typography> */}
                                        <Typography style={{color: 'orange', fontWeight: 'bold'}} variant="p" component="p" gutterBottom>
                                            {second}
                                        </Typography>
                                    </div>
                                </div>
                                <div style={{marginLeft: '5px'}}>
                                    <Typography style={{color: 'greenyellow', fontWeight: 'bold'}} variant="p" component="p" gutterBottom>
                                        {playingUserList[0].displayname}
                                    </Typography>
                                    <Typography style={{color: 'red', fontWeight: 'bold'}} variant="p" component="p" gutterBottom>
                                        Cup: {playingUserList[0].cup}
                                    </Typography>
                                    <Typography style={{color: 'blue', fontWeight: 'bold'}} variant="p" component="p" gutterBottom>
                                        TL thắng: {playingUserList[0].win_percent}%
                                    </Typography>
                                </div>
                            </CardContent>
                        </Card>
                    </ListItem>
                ) : <ListItem>
                        <Card variant="outlined" className={ classes.playingUserInfoStyle }>
                        </Card>
                    </ListItem>}
                {playingUserList[1] ? (
                <ListItem key={playingUserList[1]._id}>
                    <Card className={ classes.playingUserInfoStyle }>
                        <CardContent>
                            <div style={flexContainer}>
                                <Button onClick={() => displayUserInfoDialog(playingUserList[1]._id)}>
                                    <Avatar variant="square"  src={convertAvatarPropToString(playingUserList[1].avatar)} style={{width: 60, height: 60}}></Avatar>
                                </Button>
                                <div style={{marginLeft: 30, margin: 'auto'}}>
                                    {/* <Typography className={classes.title} variant="h6" component="h6" style={{color: 'red', margin: 0}} gutterBottom>
                                        {playingUser.score}
                                    </Typography> */}
                                    <Typography style={{color: 'orange', fontWeight: 'bold'}} variant="p" component="p" gutterBottom>
                                        {oppSecond}
                                    </Typography>
                                </div>
                            </div>
                            <div style={{marginLeft: '5px'}}>
                                <Typography style={{color: 'greenyellow', fontWeight: 'bold'}} variant="p" component="p" gutterBottom>
                                    {playingUserList[1].displayname}
                                </Typography>
                                <Typography style={{color: 'red', fontWeight: 'bold'}} variant="p" component="p" gutterBottom>
                                    Cup: {playingUserList[1].cup}
                                </Typography>
                                <Typography style={{color: 'blue', fontWeight: 'bold'}} variant="p" component="p" gutterBottom>
                                    TL thắng: {playingUserList[1].win_percent}%
                                </Typography>
                            </div>
                        </CardContent>
                    </Card>
                </ListItem>
            ) : <ListItem>
                    <Card variant="outlined" className={ classes.playingUserInfoStyle }>
                    </Card>
                </ListItem>}                
            </List>
        )
    }
    else {
        return (
            <List style={{ width: '200px' }}>
                {playingUserList[0] ? (
                    <ListItem key={playingUserList[0]._id}>
                        <Card className={ classes.playingUserInfoStyle }>
                            <CardContent>
                                <div style={flexContainer}>
                                    <Button onClick={() => displayUserInfoDialog(playingUserList[0]._id)}>
                                        <Avatar variant="square"  src={convertAvatarPropToString(playingUserList[0].avatar)} style={{width: 60, height: 60}}></Avatar>
                                    </Button>
                                    <div style={{marginLeft: 30, margin: 'auto'}}>
                                        {/* <Typography className={classes.title} variant="h6" component="h6" style={{color: 'red', margin: 0}} gutterBottom>
                                            {playingUser.score}
                                        </Typography> */}
                                        <Typography style={{color: 'orange', fontWeight: 'bold'}} variant="p" component="p" gutterBottom>
                                            {oppSecond}
                                        </Typography>
                                    </div>
                                </div>
                                <div style={{marginLeft: '5px'}}>
                                    <Typography style={{color: 'greenyellow', fontWeight: 'bold'}} variant="p" component="p" gutterBottom>
                                        {playingUserList[0].displayname}
                                    </Typography>
                                    <Typography style={{color: 'red', fontWeight: 'bold'}} variant="p" component="p" gutterBottom>
                                        Cup: {playingUserList[0].cup}
                                    </Typography>
                                    <Typography style={{color: 'blue', fontWeight: 'bold'}} variant="p" component="p" gutterBottom>
                                        TL thắng: {playingUserList[0].win_percent}%
                                    </Typography>
                                </div>
                            </CardContent>
                        </Card>
                    </ListItem>
                ) : <ListItem>
                        <Card variant="outlined" className={ classes.playingUserInfoStyle }>
                        </Card>
                    </ListItem>}
                {playingUserList[1] ? (
                <ListItem key={playingUserList[1]._id}>
                    <Card className={ classes.playingUserInfoStyle }>
                        <CardContent>
                            <div style={flexContainer}>
                                <Button onClick={() => displayUserInfoDialog(playingUserList[1]._id)}>
                                    <Avatar variant="square"  src={convertAvatarPropToString(playingUserList[1].avatar)} style={{width: 60, height: 60}}></Avatar>
                                </Button>
                                <div style={{marginLeft: 30, margin: 'auto'}}>
                                    {/* <Typography className={classes.title} variant="h6" component="h6" style={{color: 'red', margin: 0}} gutterBottom>
                                        {playingUser.score}
                                    </Typography> */}
                                    <Typography style={{color: 'orange', fontWeight: 'bold'}} variant="p" component="p" gutterBottom>
                                        {second}
                                    </Typography>
                                </div>
                            </div>
                            <div style={{marginLeft: '5px'}}>
                                <Typography style={{color: 'greenyellow', fontWeight: 'bold'}} variant="p" component="p" gutterBottom>
                                    {playingUserList[1].displayname}
                                </Typography>
                                <Typography style={{color: 'red', fontWeight: 'bold'}} variant="p" component="p" gutterBottom>
                                    Cup: {playingUserList[1].cup}
                                </Typography>
                                <Typography style={{color: 'blue', fontWeight: 'bold'}} variant="p" component="p" gutterBottom>
                                    TL thắng: {playingUserList[1].win_percent}%
                                </Typography>
                            </div>
                        </CardContent>
                    </Card>
                </ListItem>
            ) : <ListItem>
                    <Card variant="outlined" className={ classes.playingUserInfoStyle }>
                    </Card>
                </ListItem>}                
            </List>
        )
    }
}