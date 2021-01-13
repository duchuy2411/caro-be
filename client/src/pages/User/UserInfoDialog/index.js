import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserInfoDialog, closeUserInfoDialog } from '../../../store/slice/userInfoDialogSlice';

import convertAvatarPropToString from '../../../utils/binaryToString';
import getFormattedDate from '../../../utils/date';

//let [openUserInfoDialog, setOpenUserInfoDialog] = useState(false);
const useStyles = makeStyles((theme) => ({

}));

export default function UserInfo({socket}){
    const classes = useStyles();
    const dispatch = useDispatch();
    const userInfoDialog = useSelector(selectUserInfoDialog);
    const [currentUser, setCurrentUser] = useState(JSON.parse(sessionStorage.getItem('currentuser')));
    useEffect(() => {

    }, []);

    async function inviteUser() {
        const boardCode = window.location.pathname.split('/')[2];
        if (boardCode) {
            await socket.emit("invite-user", [currentUser.displayname, userInfoDialog.idUser, boardCode]);
        }
        else if (!currentUser) {
            alert("Bạn cần phải đăng nhập để mời người khác");
        }
        else {
            alert("Bạn cần phải ở trong bàn để mời người khác");
        }
    }

    let closeImg = { cursor: 'pointer', float: 'right', marginTop: '5px', width: '20px' };
    return (
        <Dialog open={userInfoDialog.isOpen}
            onClose={() => dispatch(closeUserInfoDialog())} aria-labelledby="form-dialog-title"
        >
            <DialogTitle>Thông tin người chơi
            <img src='https://d30y9cdsu7xlg0.cloudfront.net/png/53504-200.png' style={closeImg} onClick={() => { dispatch(closeUserInfoDialog()) }} />
            </DialogTitle>
            <DialogContent style={{display: 'flex', alignItems: 'flex-end'}}>
                <Avatar variant="square" src={convertAvatarPropToString(userInfoDialog.avatar)} style={{ width: 110, height: 110, marginRight: 30 }}></Avatar>
                <div>
                    <Typography className={classes.title} variant="p" component="p" style={{ fontWeight: 'bold' }} gutterBottom>
                        {userInfoDialog.displayName}
                    </Typography>
                    <Typography className={classes.title} style={{ color: 'black' }} variant="p" component="p" gutterBottom>
                        Join Date: {getFormattedDate(new Date(userInfoDialog.joinDate))}
                    </Typography>
                    <Typography className={classes.title} style={{ color: 'blue' }} variant="p" component="p" gutterBottom>
                        {userInfoDialog.statistic}
                    </Typography>
                    <Typography className={classes.title} style={{ color: 'red' }} variant="p" component="p" gutterBottom>
                        Cup: {userInfoDialog.cup}
                    </Typography>
                </div>
                {/* <DialogContentText>

                </DialogContentText> */}

            </DialogContent>
            <DialogActions>
                <Button onClick={() => { dispatch(closeUserInfoDialog()); window.location.href="/match-history/" + userInfoDialog.idUser; }} color="primary">
                    Ván đấu
                </Button>
                <Button onClick={() => { inviteUser(); dispatch(closeUserInfoDialog()); }} color="primary">
                    Mời chơi
                </Button>
            </DialogActions>
        </Dialog>
    );
}