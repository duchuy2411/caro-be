import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState, useLocation } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import axios from "../../../..//utils/axios";
import { useDispatch } from 'react-redux';
import { matchHistoryItemUpdated } from '../../../../store/slice/matchHistoryItemSlice';
import getFormattedDate from '../../../../utils/date';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";


const useStyles = makeStyles((theme) => ({
    root: {
      width: '600px',
      margin: 'auto'
    },
    inline: {
      display: 'inline',
    },
  }));

export default function MatchHistory() {
    const classes = useStyles();
    const dispatch = useDispatch();

    let [matchListView, setMatchListView] = useState([]);
    let [matchList, setMatchList] = useState([]);
    //let [viewedUser, setViewdUser] = useState(null);
    let [remainingUser, setRemainingUser] = useState(null);
    const iduser = window.location.pathname.split('/')[2];
    
    useEffect(() => {
        async function fetchData() {
            try {
                const api_match = await axios.get("matchs/iduser/" + iduser);
                if (api_match.data.data) {
                    setMatchList(api_match.data.data);
                    renderMatchListView();
                }
            } catch(error) {
                
            }

            // axios.get("boards/getmatch/" + iduser)
            //     .then(res => {
            //         let matchList = res.data.data;
            //         //setMatchList(res.data.data);
            //         axios.get("api/users/id/" + iduser)
            //             .then(res => {
            //                 let viewedUser = res.data.data.user;
            //                 //setViewdUser(res.data.data.user);
            //                 renderMatchListView(matchList, viewedUser);
            //             })
            //             .catch(err => {
            //                 console.log(err)
            //             })
            //     })
            //     .catch(err => {
            //         console.log(err)
            //     })
        }
        fetchData();
    }, [matchList.length]);

    function renderMatchItemView(match) {
        let title = match.displayname_user1 + " vs " + match.displayname_user2;
        const matchHistoryItemLink = "/match-history/" + iduser + "/" + match._id;
        let createdAt = new Date(match.createdAt);

        return (
            <div style={{marginBottom: '20px', backgroundImage: 'url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSF8tq7J9mu_6vdiGTDAMwY9hC5t_ti2ukrhg&usqp=CAU")'}}>
                <ListItem style={{marginLeft: '100px'}}>
                    <Link to={matchHistoryItemLink}>
                        <ListItemAvatar style={{marginRight: '60px'}} onClick={() => displayMatchHistoryItem(match)}>
                            <Avatar style={{width: '60px', height: '60px'}} alt="Remy Sharp" src="https://cdn.pixabay.com/photo/2016/02/01/12/33/play-1173551_1280.png" />
                        </ListItemAvatar>
                    </Link>
                    <ListItemText>
                        <React.Fragment>
                            <Typography variant="body2" color="error" style={{fontWeight: 'bold'}}>
                                {title}
                            </Typography>
                            <Typography variant="body2" style={{color: "greenyellow", fontWeight: 'bold'}}>
                                Diễn ra vào {getFormattedDate(createdAt)}
                            </Typography>
                            <Typography variant="body2" style={{color: "orange", fontWeight: 'bold'}}>
                                Người thắng: {match.displayname_win}
                            </Typography>
                            <Typography variant="body2" style={{color: "blue", fontWeight: 'bold'}}>
                                Số nước đi: {match.step.length}
                            </Typography>
                        </React.Fragment>
                        
                    </ListItemText>
                </ListItem>
            </div>
        );
    }

    function renderMatchListView() {
        let result = [];
        matchList.map((match) => {
            result.push(renderMatchItemView(match));
        });
        setMatchListView(result);
    }

    function displayMatchHistoryItem(match) {
        dispatch(matchHistoryItemUpdated({matchHistoryItem: match}));
    }

    return(
        <div >
            <h1 style={{width: 'fit-content', margin: 'auto', color: 'green'}}>Lịch sử ván đấu</h1>
            <List className={classes.root}>{matchListView}</List>
        </div>

    )
}