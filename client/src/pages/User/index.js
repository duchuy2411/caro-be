import socketio from "socket.io-client"
import axios  from "../../utils/axios";
import domain  from "../../utils/domain";
import { useState, useEffect } from "react"
import { makeStyles } from '@material-ui/core/styles';
import SignIn from '../../components/common/Header/SignIn';
import SignUp from '../../components/common/Header/SignUp';
import Profile from '../../components/common/Header/Profile';
import ForgetPassword from '../../components/common/Header/SignIn/ForgetPassword';
import ResetPassword from '../../components/common/Header/SignIn/ForgetPassword/ResetPassword';
import CheckActivateAccount from '../../components/common/Header/CheckActivateAccount';
import MatchHistory from '../../components/common/Header/MatchHistory';
import MatchHistoryItem from '../../components/common/Header/MatchHistory/MatchHistoryItem';
import RankingTable from '../../components/common/Header/RankingTable';
import TableList from './TableList';
import TableItem from './TableList/TableItem';
import OnlineUserList from './OnlineUserList';
import UserInfoDialog from './UserInfoDialog';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import Helmet from 'react-helmet';
import Header from '../../components/common/Header/index';

//import './index.css';
import useScript from '../../utils/hooks/useScript';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { onlineUserUpdated } from '../../store/slice/onlineUsersSlice';
import history from "../../utils/history";

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    navigationStyle: {
        backgroundColor: 'aqua',
    }
}));


function User() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [socket, setSocket] = useState();
    let [currentUser, setCurrentUser] = useState(null);

    useScript('https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js');
    useScript('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.1.3/js/bootstrap.bundle.min.js');

    useEffect(() => {
        async function fetchData() {
            try {
                //let currentUsername = document.cookie.split('=')[1];
                let currentUsername = Cookies.get(['currentUsername']);
                if (currentUsername) {
                    const api = await axios.get("api/users/" + currentUsername);
                    const data = api.data.data;

                    // Kết nối socket truyền vào iduser : _id và displayname là displayname
                    const io = socketio(domain,
                        { query: `iduser=${data.user._id}&displayname=${data.user.displayname}` });

                    // Gán state socket = io để gọi lại ở useEffect bên dưới
                    setSocket(io);
                    sessionStorage.setItem('currentuser', JSON.stringify(data.user));
                    setCurrentUser(data.user);

                    
                }
                

            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, [])

    // luôn lắng nghe khi có người khác đăng nhập
    // trả về 1 mảng đang online trong database
    useEffect(() => {

        if (socket) {
            socket.on('list-online', async function (listOnline) {
                await dispatch(onlineUserUpdated({listOnlineUser: listOnline}));
                //setOnlineUserList(listOnline);
            });
        }

        return () => {
            if (socket) {
                // nghe xong sự kiện list-online thì xóa
                socket.removeAllListeners('list-online', () => { })
            }
        }
    }, [socket]);


    async function signOut() {

        //document.cookie = 'currentUsername=';
        Cookies.remove('currentUsername');
        const data = await axios.get("api/users/logout/" + currentUser._id);
        sessionStorage.setItem('currentuser', '');
        setCurrentUser(null);

        //setOnlineUserList(data.data.data.userList);
        
        socket.disconnect();
        await dispatch(onlineUserUpdated({listOnlineUser: []}));
        //setOnlineUserList([]);
        // socket.on('disconnected', function (listOnline) {
        //     setOnlineUserList(listOnline);
        // });

        //socket.emit('disconnect', { iduser: currentUser._id, displayname: currentUser.displayname });
        
    }

    const flexContainer = {
        display: 'flex',
        flexDirection: 'row',
        padding: 0,
    };
    //checkSignInStatus();
    

    return (
        <html>
            <head>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.1.3/css/bootstrap.min.css"/>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Bitter:400,700"/>
            </head>
            <body style={{backgroundImage: 'url("https://static.vecteezy.com/system/resources/thumbnails/000/133/727/original/WoodBackground54342.jpg")', backgroundRepeat: 'repeat'}}>    
                
                <Router history={history}>
                    <Switch>
                        <Route path={"/*"}>
                            <Header currentUser={currentUser} signOut={signOut} />
                            <Route exact path={'/'}>
                                <img src="https://zingplay.static.g6.zing.vn/images/modules/games/480x240/Cocaro.jpg" style={{width: '100%'}}/>
                            </Route>
                            <Route path={'/sign-in'}>
                                <div hidden={currentUser}>
                                    <SignIn />
                                </div>
                            </Route>   
                            <Route path={'/sign-up'}>
                                <div hidden={currentUser}>
                                    <SignUp />
                                </div>
                            </Route>   
                            <Route path={'/play'} >   
                                <div style={flexContainer}>
                                    <Route exact path={'/play'}>
                                        <TableList socket={socket}/>
                                    </Route>
                                    <Route path={`/play/:tableId`} >
                                        <TableItem socket={socket}/>
                                    </Route>
                                    <OnlineUserList/>
                                </div>
                                <UserInfoDialog socket={socket}/>
                            </Route>
                            
                            <Route path={'/profile'} >
                                <div hidden={!currentUser}>
                                    <Profile />
                                </div>
                            </Route>
                            <Route path={'/forget-password'} >
                                <div hidden={currentUser}>
                                    <ForgetPassword/>
                                </div>
                            </Route>
                            <Route path={'/reset-password/:key'} >
                                <ResetPassword/>
                            </Route>
                            <Route path={'/activate-account/:key'} >
                                <CheckActivateAccount />
                            </Route>
                            <Route exact path={'/match-history/:iduser'} >
                                <div hidden={!currentUser}>
                                    <MatchHistory />
                                    <UserInfoDialog socket={socket}/>
                                </div>
                            </Route>
                            <Route path={'/match-history/:iduser/:idboard'} >
                                <div hidden={!currentUser}>
                                    <MatchHistoryItem />
                                    <UserInfoDialog socket={socket}/>
                                </div>
                            </Route>

                            <Route path={'/ranking-table'} >
                                <RankingTable />
                                <UserInfoDialog socket={socket}/>
                            </Route>
                        </Route>
                    </Switch>
                </Router>      
            </body>
        </html>
    );
}

export default User;
