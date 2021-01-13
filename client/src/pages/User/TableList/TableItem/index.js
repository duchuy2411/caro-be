import React, { useEffect, useState, useLocation } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectAllBoards,
    selectBoardById,
    selectBoardIds,
    fetchBoards,
    addNewBoard,
    selectBoardByRoom,
    boardUpdated
} from '../../../../store/slice/boardsSlice';

import { addGuest, addHost, addHostAndGuest, updateHostStatistic, updateGuestStatistic } from '../../../../store/slice/playingUsersSlice';

import Game from '../../Game/index.js';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import AddBoxIcon from '@material-ui/icons/AddBox';
import GridList from '@material-ui/core/GridList';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PlayingUserList from '../../../../components/PlayingUserList';
import Audience from '../../../../components/Audience/index.js';
import Chat from '../../../../components/Chat/index.js';
import axios from "../../../../utils/axios";
import { Grid } from "@material-ui/core";
import socketio from 'socket.io-client';

//import env from '../../env.json';
//const URL = env.SERVER_DOMAIN_NAME;
const URL = "";
var queryString = require('querystring');



const useStyles = makeStyles((theme) => ({
    title: {
        color: 'indianred',
        display: 'flex',
        justifyContent: 'center'
    },
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    list: {
        width: 400,
        height: 500,
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
    },
    myStyle: {
        display: 'flex',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
        flexDirection: 'row',
    }
}));

export default function TableItem({ socket }) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const boardStatus = useSelector((state) => state.boards.status);
    let board = useSelector((state) => selectBoardByRoom(state, window.location.pathname.split('/')[2]))[0];
    const [match, setMatch] = useState();
    const [hostPlayer, setHostPlayer] = useState();
    const [guestPlayer, setGuestPlayer] = useState();
    const [updateBoard, setUpdateBoard] = useState(board);
    const [openHistory, setOpenHistory] = useState(false);
    const [newSquare, setNewSquare] = useState(Array(400).fill(null));
    const [winLine, setWinLine] = useState(null);
    const [history, setHistory] = useState();
    const [message, setMessage] = useState("");
    const [readyStart, setReadyStart] = useState(false);
    const [isHost, setIsHost] = useState(false);
    const [isStart, setIsStart] = useState(false);
    const [isWin, setIsWin] = useState(false);
    const [isJoin, setIsJoin] = useState(false);
    const [duration, setDuration] = useState(-1);
    const [second, setSecond] = useState(null);
    const [oppSecond, setOppSecond] = useState(null);
    const [isTypePlay, setIsTypePlay] = useState(false);
    const [messageWin, setMessageWin] = useState();
    const [hostPlayerId, setHostPlayerId] = useState("");
    const [guestPlayerId, setGuestPlayerId] = useState("");
    const [displayHandOver, setDisplayHandOver] = useState(false);

    const [canLeaveRoom, setCanLeaveRoom] = useState(true);

    useEffect(() => {
        if (boardStatus === 'idle') {
            dispatch(fetchBoards());
        }
    }, [boardStatus, dispatch]);

    useEffect(() => {
        if (board && !isJoin && socket) {
            if (board && !isJoin && socket) {
                if (board.id_user1 === JSON.parse(sessionStorage.currentuser)._id) {
                    setIsHost(true);
                    dispatch(addHost({ hostUser: JSON.parse(sessionStorage.currentuser) }));
                    setHostPlayerId(board.id_user1);
                }
                else {
                    setIsHost(false);
                    axios.get("api/users/id/" + board.id_user1)
                        .then(res => {
                            if (res.data.data) {
                                const user1 = res.data.data.user;
                                if (!board.id_user2)
                                    dispatch(addHostAndGuest({ hostUser: user1, guestUser: JSON.parse(sessionStorage.currentuser) }))
                                setHostPlayerId(board.id_user1);
                                setGuestPlayerId(JSON.parse(sessionStorage.currentuser)._id);
                            }
                        })
                        .catch(err => { })
                }
                console.log('join');
                setTimeout(() => {
                    socket.emit('join-room', [window.location.pathname.split('/')[2], JSON.parse(sessionStorage.currentuser)._id]);
                }, 1500);
                setIsJoin(true);
                setDuration(parseInt(board.time));
            }
        }
    }, [board, socket]);


    useEffect(() => {
        if (socket && isHost) {
            console.log('socket start');
            socket.on('ready-start', function (board) {
                console.log('start');
                setReadyStart(true);

                axios.get("api/users/id/" + board.id_user2)
                    .then(res => {
                        if (res.data.data) {
                            const user2 = res.data.data.user;
                            dispatch(addGuest({ guestUser: user2 }));
                        }
                        setGuestPlayerId(board.id_user2);
                    })
                    .catch(err => { })
            });
            
        }
        // else if (socket && isJoin && !isHost) {
        //     dispatch(addGuest({ guestUser: JSON.parse(sessionStorage.currentuser) }))
        // }
        return () => {
            if (socket) {
                // nghe xong xóa
                socket.removeAllListeners('ready-start', function () {
                })
            }
        }
    }, [socket, isHost])

    useEffect(() => {
        if (socket) {
            socket.on('new-match', function ([newMatch, updateBoard, user1, user2]) {
                setMatch(newMatch);
                setHostPlayer(user1);
                setGuestPlayer(user2);
                setNewSquare(Array(updateBoard.size * updateBoard.size).fill(null));
                setIsWin(false);
                setWinLine(null);
                setHostPlayerId(user1._id);
                setGuestPlayerId(user2._id);
                setDisplayHandOver(true);
                if (!isStart) setIsStart(true);

                setCanLeaveRoom(false);
            });
        };
        return () => {
            if (socket) {
                // nghe xong xóa
                socket.removeAllListeners('new-match', function () {
                })
            }
        }
    }, [socket])

    useEffect(() => {
        if (socket) {
            socket.on("receive", function ([squares, msg]) {
                setMessage(msg);
                setNewSquare(squares);
                setSecond(duration);
                setOppSecond(null);
                setIsTypePlay(false);
            });
        };
        return () => {
            if (socket) {
                // nghe xong xóa
                socket.removeAllListeners('receive', function () {
                })
            }
        }
    }, [socket, duration])

    useEffect(() => {
        if (socket) {
            socket.on("win-game", function ([line, msg]) {
                console.log('win game', isHost);
                setDisplayHandOver(false);
                setMessageWin(msg);
                setIsWin(true);
                if (line) {
                    setWinLine(line);
                }
                if (isHost) {
                    console.log('ready');
                    setReadyStart(true);
                }

                // if (isHost) {
                //     dispatch(updateHostStatistic(JSON.parse(sessionStorage.currentuser)._id));
                //     dispatch(updateGuestStatistic(guestPlayerId));
                // }
                // else {
                //     dispatch(updateHostStatistic(hostPlayerId));
                //     dispatch(updateGuestStatistic(guestPlayerId));
                // }

                setCanLeaveRoom(true);
            });
        };
        return () => {
            if (socket) {
                // nghe xong xóa
                socket.removeAllListeners('win-game', function () {
                })
            }
        }
    }, [socket, isHost])

    useEffect(() => {
        console.log('call countdown', isWin, second);
        let timer;
        let oppTimer;

        if (isWin) {
            clearTimeout(timer);
            clearTimeout(oppTimer);
            setSecond(null);
            setOppSecond(null);
        }
        else if (!isTypePlay && second > 0) {
            timer = setTimeout(() => {
                setSecond(second - 1);
            }, 1000);
            setOppSecond(null);
        }
        else if (!isTypePlay && second === 0) {
            handleWinGame(null);
            setSecond(null);
        }
        else if (isTypePlay && oppSecond > 0) {
            oppTimer = setTimeout(() => {
                setOppSecond(oppSecond - 1);
            }, 1000);
            setSecond(null);
        }
        else if (isTypePlay && oppSecond === 0) {
            setOppSecond(null);
        }

        return () => {
            if (!second && isTypePlay) {
                clearTimeout(timer);
            }
            else if (!oppSecond && !isTypePlay) {
                clearTimeout(oppTimer);
            }
        }
    }, [second, oppSecond, isWin]);

    useEffect(() => {
        if (socket) {
            socket.on('update-ui-leave-room', function (newBoard) {
                setIsHost(false);
                // handleWinGame
                //const idLoser = match.id_user1 === JSON.parse(sessionStorage.currentuser)._id ? match.id_user2 : match.id_user1;
                //const msg = JSON.parse(sessionStorage.currentuser)._id + ' chiến thắng ' + idLoser;
                //socket.emit('win-game', [match._id, JSON.parse(sessionStorage.currentuser)._id, idLoser, null, msg]);
                //setIsWin(true);
                dispatch(boardUpdated({ newBoard: newBoard }));
                board = newBoard;
                
                if (board.id_user1 === JSON.parse(sessionStorage.currentuser)._id) {
                    setIsHost(true);
                    dispatch(addHostAndGuest({ hostUser: JSON.parse(sessionStorage.currentuser), guestUser: null }));
                    setHostPlayerId(board.id_user1);
                    setHostPlayer(null);
                    setGuestPlayerId("");
                    setReadyStart(false);
                    //setCanPlay(true);
                }
                setDuration(parseInt(board.time));
                
                // axios.get("api/users/id/" + board.id_user1)
                //     .then(res => {
                //         if (res.data.data) {
                //             const user1 = res.data.data.user;
                //             if (!board.id_user2) {
                //                 dispatch(addHostAndGuest({ hostUser: user1, guestUser: null }));
                //             }
                //             else {
                //                 axios.get("api/users/id/" + board.id_user2)
                //                     .then(res => {
                //                         if (res.data.data) {
                //                             const user2 = res.data.data.user;
                //                             dispatch(addHostAndGuest({ hostUser: user1, guestUser: user2 }))
                //                         }})
                //                     .catch(err => {})
                //             }
                //             setHostPlayerId(board.id_user1);
                //             setIsStart(false);
                //             setReadyStart(false);
                //         }
                //     })
                //     .catch(err => {})
                //     if (board.id_user1 === JSON.parse(sessionStorage.currentuser)._id) {
                //         setIsHost(true);
                //     }
                //     setDuration(parseInt(board.time));
            });
        }
        return () => {
            if (socket) {
                // nghe xong xóa
                socket.removeAllListeners('update-ui-leave-room', function () {
                })
            }
        }
    }, [socket]);

    useEffect(() => {
        return () => {
            leaveRoom();
        };
    }, []);

    function leaveRoom() {
        socket.emit('leave-room');
        window.location.href = '/play';
    }

    function handlePlayGame(squares) {
        const currentPlayer = match.id_user1 === JSON.parse(sessionStorage.currentuser)._id ? hostPlayer.displayname : guestPlayer.displayname;
        const nextPlayer = match.id_user1 === JSON.parse(sessionStorage.currentuser)._id ? guestPlayer.displayname : hostPlayer.displayname;
        const msg = currentPlayer + ' đã đi -> Đến lượt ' + nextPlayer;
        socket.emit('play-caro', [match._id, squares, msg]);
        setSecond(null);
        setOppSecond(duration);
        setIsTypePlay(true);
        setMessage(msg);
    }
    function handleWinGame(line) {
        let msg;
        const currentPlayer = match.id_user1 === JSON.parse(sessionStorage.currentuser)._id ? hostPlayer.displayname : guestPlayer.displayname;
        const nextPlayer = match.id_user1 === JSON.parse(sessionStorage.currentuser)._id ? guestPlayer.displayname : hostPlayer.displayname;
        const idLoser = match.id_user1 === JSON.parse(sessionStorage.currentuser)._id ? match.id_user2 : match.id_user1;
        if (line) {
            msg = currentPlayer + ' chiến thắng ' + nextPlayer;
        } else {
            msg = nextPlayer + ' chiến thắng ' + currentPlayer;
        }
        socket.emit('win-game', [match._id, JSON.parse(sessionStorage.currentuser)._id, idLoser, line, msg]);
    }


    function renderHistoryList() {
        // axios.get('boards/gethistory/'+board.code)
        //     .then(res => {
        //         console.log(res);
        //         setHistory(res.data.data);
        //     })
        //     .catch(err => {
        //         console.log(err);
        //     })
    }

    function handleReplay() {

    }

    function startGame() {
        socket.emit('start-game');
    }

    return (
        <React.Fragment>
            <div className={classes.root} style={{ alignItems: 'stretch', background: 'transparent' }} >
                <div style={{ width: '590px' }}>
                    {/* <Game dimension={board ? board.size : 0}
                            handlePlayGame={(squares) => handlePlayGame(squares)}
                            handleWinGame={(line) => handleWinGame(line)}
                            handleReplay={() => handleReplay()}
                            newSquares={newSquare}
                            newWinLine={winLine}
                            isWin={isWin}
                        /> */}
                    {isStart ? (<Game dimension={board ? board.size : 0}
                        handlePlayGame={(squares) => handlePlayGame(squares)}
                        handleWinGame={(line) => handleWinGame(line)}
                        handleReplay={() => handleReplay()}
                        newSquares={newSquare}
                        newWinLine={winLine}
                        isWin={isWin}
                    />) : null}
                </div>
                <div style={{ background: '#0ace5b', width: '200px' }}>
                    <div>
                        <div style={{ flexGrow: 1 }}>
                            <Typography className={classes.title} variant='h5' component='h6'>
                                Tên phòng: {board ? board.title : 'XO'}
                            </Typography >
                            <Typography className={classes.title} variant='h6' component='h6'>
                                Miêu tả: {board ? board.description : 'etc'}
                            </Typography>
                            <Grid container style={{ marginBottom: '5px', marginLeft: '10px' }}>
                                <Grid style={{ width: '90px', marginRight: '5px' }}>
                                    {isHost ? (
                                        <Button onClick={() => { 
                                            startGame(); 
                                            setReadyStart(false) 
                                    }} disabled={!readyStart} variant="contained" color="secondary">
                                            Bắt đầu
                                        </Button>)
                                        : null}
                                </Grid>
                                <Grid style={{width: '90px'}}>
                                    <Button onClick={() => {
                                        leaveRoom();
                                    }} disabled={!canLeaveRoom} variant="contained" color="primary">
                                        Rời bàn
                                    </Button>
                                </Grid>
                                {/*<Grid item xs={3}>
                                    <Button onClick={() => {
                                        setReplay(true);
                                        handlePlayGame(Array(board.size*board.size).fill(null));
                                        setNewSquare(Array(board.size*board.size).fill(null));
                                        setWinLine(null);
                                    }}  variant="contained" color="primary"
                                    disabled={replay}>
                                        Chơi lại
                                    </Button>
                                </Grid>*/}
                                {/*<Grid style={{width: '90px'}}>
                                    <Button onClick={() => {
                                        setOpenHistory(true);
                                        renderHistoryList();
                                    }} variant="contained" color="primary">
                                        Xem lịch sử
                                    </Button>
                                </Grid>*/}
                                {isStart && displayHandOver ? (<Grid item xs={3}>
                                    <Button onClick={() => {
                                        handleWinGame(null);
                                    }} variant="contained" color="primary">
                                        Xin đầu hàng
                                    </Button>
                                </Grid>) : null}
                            </Grid>
                            {isWin ? (<Typography style={{ fontSize: '12px', marginLeft: '2px', color: 'red', marginBottom: '-10px', height: '30px' }}>{messageWin}</Typography>) :
                                (<React.Fragment>
                                    <Typography style={{ fontSize: '12px', marginLeft: '2px', color: 'blue', marginBottom: '-10px', height: '30px' }}>{message}</Typography>
                                    {/* {second === -1 ? (<Typography />) : (<Typography>Thời gian: {second}s</Typography>)} */}
                                </React.Fragment>)}
                        </div>
                        <PlayingUserList second={second} oppSecond={oppSecond} hostPlayerId={hostPlayerId} />
                    </div>
                    {/* <div>
                        <Audience />
                    </div> */}
                </div>
                <div>
                    <Chat socket={socket} board={board} match={match} />
                </div>
            </div>

            <Dialog open={openHistory} onClose={() => setOpenHistory(false)} aria-labelledby="form-dialog-title">
                <DialogTitle>Lịch sử chơi game</DialogTitle>
                <DialogContent>
                    <List>
                        {
                            history ? history.map(el => (
                                <ListItem>
                                    {/*<ListItemText*/}
                                    {/*    primary={`${el.date} - ${el.winner.displayname} win`}*/}
                                    {/*/>*/}
                                    <Typography style={{ color: 'blue' }}>{`${el.date} | "${el.winner.displayname}" THẮNG`}</Typography>
                                </ListItem>
                            )) : null
                        }
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setOpenHistory(false); }} color="danger">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}