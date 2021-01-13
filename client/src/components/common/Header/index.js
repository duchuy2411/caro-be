import { useState, useEffect } from "react"
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";
import './index.css';
import axios from '../../../utils/axios';

function Header({currentUser, signOut}) {
    let [displayName, setDisplayName] = useState("");
    // function checkSignInStatus() {
    //     if (currentUser) {
    //         return (
    //             <Redirect to="/play" />
    //         );
    //     }
    // } 

    useEffect(() => {
        if (currentUser) setDisplayName(currentUser.displayname);
        else setDisplayName("");
    }, [currentUser]);

    async function activateAccount() {
        const api = await axios.post("api/users/activate-account", {email: currentUser.email});
        alert(api.data.message);
    }
    let matchHistoryLink;
    if (currentUser)
        matchHistoryLink = '/match-history/' + currentUser._id;
    return (
        <nav class="navbar navbar-dark navbar-expand-md navigation-clean-search">
            <div class="container">
                <div class="collapse navbar-collapse" id="navcol-1">
                    {/* {checkSignInStatus()} */}
                    <Link to={'/'}>
                        <div class="navbar-brand">Caro Game</div>
                    </Link>
                    <ul class="nav navbar-nav form-inline mr-auto">     
                        <li class="nav-item" role="presentation">
                        <Link to={'/play'}>
                            <div class="nav-link">Chơi</div>     
                        </Link>
                        </li>
                        <li hidden={!currentUser} class="dropdown">
                            <a class="dropdown-toggle nav-link dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Player </a>
                            <div class="dropdown-menu" role="menu">
                            <Link to={'/profile'} >
                                <a class="dropdown-item" role="presentation">Profile</a>
                            </Link>
                            <Link to={matchHistoryLink} >
                                <a class="dropdown-item" role="presentation">Lịch sử ván đấu</a>
                            </Link>
                            
                            <a class="dropdown-item" role="presentation" onClick={() => activateAccount()}>Kích hoạt tài khoản</a>
                            
                            <Link to={'/'}>
                                <a class="dropdown-item" role="presentation" onClick={() => signOut()} >Đăng xuất</a>
                            </Link>
                            </div>   
                        </li>
                        <li class="nav-item" role="presentation">
                            <Link to={'/ranking-table'}> 
                                <div class="nav-link">Bảng xếp hạng</div>     
                            </Link>
                        </li>

                    </ul>
                    <div hidden={currentUser}>
                        <Link to={'/sign-in'}>
                            <span class="navbar-text">
                                <div class="login">Đăng Nhập</div>
                            </span>
                        </Link>
                        <Link to={'/sign-up'}>
                            <div class="btn action-button" role="button">Đăng Ký</div>
                        </Link>
                    </div>
                    <div hidden={!currentUser}>
                        <span class="login">Xin chào {displayName}</span>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Header;