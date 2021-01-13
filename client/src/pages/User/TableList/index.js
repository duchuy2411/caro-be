import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Typography from '@material-ui/core/Typography';
import TableItem from './TableItem/index';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import SearchIcon from '@material-ui/icons/Search';

import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import Avatar from '@material-ui/core/Avatar';

import axios from '../../../utils/axios';
import socketio from 'socket.io-client';
import history from "../../../utils/history";

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";

import {useDispatch, useSelector} from 'react-redux';
import {
    selectAllBoards,
    selectBoardById,
    selectBoardIds,
    fetchBoards,
    addNewBoard,
    selectBoardByRoom,
    addNewBoardNotUpdateDB,
    boardUpdated
} from '../../../store/slice/boardsSlice';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 1280,
        backgroundColor: theme.palette.background.paper
    },
    tableImage: {
        width: '100px',
        height: '100px',
        marginLeft: 22
        
    },
    gridList: {
        alignContent: 'center',
        marginTop: 0
    },
    cardStyle: {
        width: 180, 
        height: 200, 
        textAlign: 'center',
        margin: 5,
        backgroundImage: 'url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSF8tq7J9mu_6vdiGTDAMwY9hC5t_ti2ukrhg&usqp=CAU")'
    }
}));


export default function TableList({socket}) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const boardStatus = useSelector((state) => state.boards.status);
    const boards = useSelector(selectAllBoards);
    let [tableList, setTableList] = useState([]);
    let [openCreateTableDialog, setOpenCreateTableDialog] = useState(false);
    const [time, setTime] = useState(15);
    const [openFindRoom, setOpenFindRoom] = useState(false);
    const [notFound, setNoFound] = useState(false);
    const [idRoom, setIdRoom] = useState(null);
    const [password, setPassword] = useState(null);
    const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
    const board = useSelector((state) => selectBoardByRoom(state, idRoom));

    const [currentUser, setCurrentUser] = useState(JSON.parse(sessionStorage.getItem('currentuser')));

    const [openLoading, setOpenLoading] = useState(false);
    const [openInvitationBox, setOpenInvitationBox] = useState(false);
    const [invitationBoxMessage, setInvitationBoxMessage] = useState("");
    const [boardCodeInvited, setBoardCodeInvited] = useState(null);
    useEffect(() => {
        if (boardStatus === 'idle') {
            dispatch(fetchBoards());
        }
    }, [boardStatus, dispatch]);

    // useEffect(() => {
    //     if (boardStatus === 'succeeded') {
    //         setTableList(boards);
    //     }
    // }, [boardStatus, dispatch])

    useEffect(() => {
        if (socket) {
            socket.on('join-room-quick-play', function (data) {
                if (currentUser._id === data[0]) {
                    setOpenLoading(false);
                    window.location.href = '/play/' + data[1];
                }
            });
        }

        return () => {
            if (socket) {
                socket.removeAllListeners('join-room-quick-play', () => { })
            }
        }
    }, [socket]);

    useEffect(() => {
        if (socket) {
            socket.on('send-invitation', function (data) {
                if (currentUser._id === data[1]) {
                    setBoardCodeInvited(data[2]);
                    setInvitationBoxMessage("Người chơi " + data[0] + " muốn mời bạn vào phòng " + data[2]);
                    setOpenInvitationBox(true);
                }
            });
        }

        return () => {
            if (socket) {
                socket.removeAllListeners('send-invitation', () => { })
            }
        }
    }, [socket]);

    useEffect(() => {

        if (socket) {
            socket.on('add-new-table', async function (newBoard) {
                console.log('add-new-table')
                await dispatch(addNewBoardNotUpdateDB(newBoard));
                //setOnlineUserList(listOnline);
            });
        }

        return () => {
            if (socket) {
                // nghe xong sự kiện list-online thì xóa
                socket.removeAllListeners('add-new-table', () => { })
            }
        }
    }, [socket]);
    
    useEffect(() => {

        if (socket) {
            socket.on('update-table', async function (newBoard) {
                console.log('update table');
                await dispatch(boardUpdated({ newBoard: newBoard }));
                //setOnlineUserList(listOnline);
            });
        }

        return () => {
            if (socket) {
                // nghe xong sự kiện list-online thì xóa
                socket.removeAllListeners('update-table', () => { })
            }
        }
    }, [socket]);

    function renderTableItem(tableId, title, description, state) {
        const path = '/play/' + tableId;
        let avatar;
        if (state == -1)
            return null;
        if (state == 1)
            avatar = '/img/waiting-table.png';
        else
            avatar = '/img/playing-table.png';
        return (
            <GridListTile key={tableId}>
                <Card variant="outlined" className={classes.cardStyle}>
                    <CardContent>
                        {/*<Link to={{pathname: path, state: {idBoard: tableId}}}>
                            <Avatar variant="square" className={classes.tableImage} src='/img/waiting-table.png' ></Avatar>
                        </Link>*/}
                        <Avatar onClick={() => checkPassword(tableId)} variant="square" className={classes.tableImage} src={avatar} />
                        <Typography variant="h6" component="h6" gutterBottom style={{color: 'white'}}>
                            {title}
                        </Typography>
                        <Typography variant="body2" component="p" style={{color: 'white'}}>
                            {description}
                        </Typography>
                    </CardContent>
                </Card>
            </GridListTile>



            // <ListItem>
            //     <Card variant="outlined">
            //         <CardContent>
            //             <Link to={path}>
            //                 <Avatar variant="square" className={classes.tableImage} src='/img/table.png' ></Avatar>
            //             </Link>
            //             <Typography className={classes.title} variant="h5" component="h2" gutterBottom>
            //                 {title}
            //             </Typography>
            //             <Typography variant="body2" component="p">
            //                 {description}
            //             </Typography>
            //         </CardContent>
            //         {/* <CardActions >
            //         <Link to={path}>
            //             <Button size="small" onClick={() => setSelectedBoardTitleToView(title)}>VIEW</Button>
            //         </Link>
            //         <Button size="small" id={boardId} onClick={(e) => {  updateSelectedBoardToEditOrDelete(e); setOpenEditBoardDialog(true); }}>EDIT</Button>
            //         <Button size="small" onClick={(e) => { updateSelectedBoardToEditOrDelete(e); deleteBoard(); }}>DELETE </Button>
            //         </CardActions> */}
            //     </Card>
            // </ListItem>
        );
    }

    function renderTableList() {
        let result = [];
        boards.map((tableItem) => result.push(renderTableItem(tableItem.code, tableItem.title, tableItem.description, tableItem.state)));
        return result;
    }

    async function createNewTable(newTitle, newDescription, newPassword) {
        // let newTitle = document.getElementById('title-add').value;
        // let newDescription = document.getElementById('description-add').value;
        if (!newTitle || !newDescription) {
            alert("Phải nhập đủ title và description");
            return;
        }
        const newBoard = {
            title: newTitle,
            description: newDescription,
            password: newPassword, time,
            id_user1: JSON.parse(sessionStorage.currentuser)._id,
            state: 1
        };

        const res = await dispatch(addNewBoard(newBoard));

        if (res.payload) {
            redirectToRoom(res.payload.code);
        }

        socket.emit('create-table', [newBoard.id_user1]);

        //tableList.push({id: "4", title: newTitle, description: newDescription});
        // fetch(URL + '/api/add-board/username/' + username + '/title/' + title + '/description/' + description)
        //     .then(res => res.json())
        //     .then(res => { if (res) alert('Add new board successfully'); else alert('Add new board unsuccessfully') })
        //     .catch(err => err);
        // axios.post('boards', {
        //     user: JSON.parse(sessionStorage.currentuser)._id,
        //     title: newTitle,
        //     description: newDescription,
        //     width: dimension,
        //     height: dimension,
        //     })
        //     .then(res => {
        //         console.log(res);
        //         history.push({
        //             pathname: '/play/' + res.data.data.code,
        //             state: {idBoard: res.data.data.code}
        //         });
        //         window.location.reload();
        //         // setTableList([...tableList, {id: res.data.data.code, title: res.data.data.title, description: res.data.data.description}]);
        //     })
        //     .catch(err => {
        //         console.log(err)
        //     })
    }

    function changeTime(e) {
        setTime(e.target.value);
    }

    function findRoom() {
        if (!board[0]) {
            setNoFound(true);
            return;
        }
        if (board[0].password && idRoom) {
            // setOpenFindRoom(false);
            setNoFound(false);
            setOpenPasswordDialog(true);
        } else {
            redirectToRoom(board.code);
        }
    }

    function checkPassword(idBoard) {
        setNoFound(false);
        const newBoard = boards.filter(board => board.code == idBoard);
        if (newBoard[0].password) {
            setOpenPasswordDialog(true);
            setIdRoom(idBoard);
        } else {
            redirectToRoom(idBoard);
        }
    }
    // sleep time expects milliseconds
    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    async function findUser() {
        const api = await axios.get('boards/quickPlay');
        if (api.data.data) {
            let listIdUser = JSON.stringify(api.data.data).slice(2, JSON.stringify(api.data.data).length - 2).split('","');
            let remainingIdUser;
            if (currentUser._id === listIdUser[0])
                remainingIdUser = listIdUser[1];
            else
                remainingIdUser = listIdUser[0];
            await createNewTable(currentUser.displayname, "Caro Open", "");
            await socket.emit("invite-user-clicked-quick-play", [currentUser._id, remainingIdUser]);
            await setOpenLoading(false);
            //alert(listIdUser[0] + "+" + listIdUser[1]);
        }
    }

    async function quickPlay() {
        await axios.post('boards/quickPlay', {iduser: currentUser._id, cup: currentUser.cup})
            .then(async res => {
                await setOpenLoading(true);
            })
            .catch(err => {

            })
        await findUser();
    }

    async function deleteQuickPlay() {
        await axios.post('boards/deleteQuickPlay', {iduser: currentUser._id});
        await setOpenLoading(false);
        await alert("Không tìm thấy người chơi phù hợp");
    }

    function acceptInvitation() {
        window.location.href = '/play/' + boardCodeInvited;
    }

    // function updateSelectedBoardToEditOrDelete(e) {
    //     if (e.currentTarget.textContent === "EDIT")
    //         selectedBoardToEditOrDelete.id = e.currentTarget.id;
    //     else
    //         selectedBoardToEditOrDelete.id = e.currentTarget.previousSibling.id;
    //     for (var i = 0; i < boardList.length; i++) {
    //         if (boardList[i].id == selectedBoardToEditOrDelete.id) {
    //             setSelectedBoardToEditOrDelete({id: boardList[i].id, title: boardList[i].title, description: boardList[i].description});
    //             //selectedBoard.description = boardList[i].description;
    //             break;
    //         }
    //     }

    function joinRoom() {
        let passwordBoard;
        if (openFindRoom) {
            passwordBoard = board[0].password;
        } else {
            passwordBoard = boards.filter(board => board.code == idRoom)[0].password;
        }
        if (passwordBoard !== password) {
            setNoFound(true);
            return;
        }
       redirectToRoom(board[0].code);
    }

    function redirectToRoom(idBoard) {
        history.push({
            pathname: '/play/' + idBoard,
            state: {idBoard}
        });
        window.location.reload();
        // socket.emit('join-room', [idBoard, JSON.parse(sessionStorage.currentuser)._id]);
    }

    return (
        <div style={{ marginLeft: 40, width: '1000px' }}>
            <Typography variant="h5" component="h2" gutterBottom color="primary">
                Danh sách bàn chơi
            </Typography>

            <Button onClick={() => {setOpenFindRoom(true); setNoFound(false);}}>
                <SearchIcon style={{width: 50, height: 50, color: 'red'}}/>
                <Typography>
                    Tìm phòng
                </Typography>
            </Button>

            <Button onClick={() => quickPlay()} style={{backgroundColor: 'blue', color: 'white', marginLeft: '100px'}}>
                Chơi nhanh
            </Button>

            <GridList cellHeight={180} className={classes.gridList} cols={3}>
                <GridListTile key="Subheader" >
                    <Card variant="outlined" className={classes.cardStyle}>

                        <CardActions style={{ justifyContent: 'center' }} >
                            <Button size="small" onClick={() => setOpenCreateTableDialog(true)}>
                                <AddCircleIcon style={{width: 90, height: 90, color: 'violet'}} />
                            </Button>
                        </CardActions>

                        <CardContent>
                            <Typography variant="h5" component="p" color="error">
                                Tạo bàn
                            </Typography>
                        </CardContent>
                    </Card>
                </GridListTile>

                {boards.map((tableItem) => renderTableItem(tableItem.code, tableItem.title, tableItem.description, tableItem.state))}
                {/* {renderTableList()} */}

            </GridList>


            <Dialog open={openCreateTableDialog} onClose={() => setOpenCreateTableDialog(false)} aria-labelledby="form-dialog-title">
                <DialogTitle>Tạo bàn</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Để tạo bàn mới, hãy nhập thông tin bàn ở đây.
                    </DialogContentText>

                    <TextField autoFocus margin="dense" id="title-add" label="Tên" fullWidth required/>
                    <TextField margin="dense" id="description-add" label="Miêu tả" fullWidth required />
                    <TextField margin="dense" id="password-add" label="Mật khẩu (optional)" fullWidth/>
                    <InputLabel id="demo-simple-select-label" style={{marginTop: '20px'}}>Thời gian cho một nước</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="time-play-add"
                        value={time}
                        onChange={changeTime}
                    >
                        <MenuItem value={15}>15s</MenuItem>
                        <MenuItem value={30}>30s</MenuItem>
                        <MenuItem value={45}>45s</MenuItem>
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setOpenCreateTableDialog(false); }} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => { setOpenCreateTableDialog(false); createNewTable(document.getElementById('title-add').value, document.getElementById('description-add').value, document.getElementById('password-add').value); }} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openFindRoom} onClose={() => setOpenFindRoom(false)} aria-labelledby="form-dialog-title">
                <DialogTitle>Tìm bàn</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Nhập id để tìm bàn
                    </DialogContentText>

                    <TextField onChange={e => setIdRoom(e.target.value)} error={notFound} helperText='Phòng không tồn tại' autoFocus margin="dense" id="id-room" label="ID" fullWidth />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setOpenFindRoom(false); }} color="danger">
                        Huỷ
                    </Button>
                    <Button onClick={() => {  findRoom(); }} color="primary">
                        Tìm
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openLoading} aria-labelledby="form-dialog-title">
                <DialogContent>
                    <img src="https://appa.com.vn/images/default/loading.gif" />
                    <DialogContentText>
                        Đang tìm đối thủ, vui lòng đợi trong giây lát...
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { deleteQuickPlay() }} color="danger">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openInvitationBox} aria-labelledby="form-dialog-title">
                <DialogContent>
                    <DialogContentText>
                        {invitationBoxMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setOpenInvitationBox(false); }} color="danger">
                        Cancel
                    </Button>
                    <Button onClick={() => { acceptInvitation(); setOpenInvitationBox(false); }} color="danger">
                        Accept
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openPasswordDialog} onClose={() => {setOpenPasswordDialog(false); setNoFound(false);}} aria-labelledby="form-dialog-title">
                <DialogTitle>Nhập mật khẩu</DialogTitle>
                <DialogContent>
                   {/* <DialogContentText>
                        To edit board, please enter new title and description here.
                    </DialogContentText>*/}

                    <TextField onChange={e => setPassword(e.target.value)} autoFocus margin="dense" error={notFound} helperText='Sai mật khẩu' id="password-join" label="Title" fullWidth />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setNoFound(false); setOpenPasswordDialog(false); }} color="primary">
                        Huỷ
                    </Button>
                    <Button onClick={() => {joinRoom();}} color="primary">
                        Vào
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
}