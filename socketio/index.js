const socketio = require('socket.io');
const { io } = require('socket.io-client');

const Online = require('./Online/index');
const Chat = require('./Chat/index');
const sessionStorage = require('node-sessionstorage');
const Board = require("../controller/board");

module.exports.listen = function (app) {

    const io = socketio(app, {
        cors: {
            origin: '*'
        }
    });

    io.on('connection', async function (user) {
        // let currentUserString = sessionStorage.getItem('currentuser');
        const dataUser = user.request._query;
        await Online.online(user.request._query);

        // console.log(user.request._query['displayname'], "is connecting!!");
        // let data = await Online.online({ iduser: dataUser['iduser'], displayname: dataUser['displayname'] });
        // user.emit('list-online', data);

        // vô web lần đầu
        // if (!currentUserString) {
        //     sessionStorage.setItem('currentuser', JSON.stringify({
        //         _id: dataUser['iduser'],
        //         username: "",
        //         password: "",
        //         displayname: "Khách",
        //         email: ""
        //     }));
        //     let data = await Online.online({ iduser: "", displayname: "Khách" });
        //     user.emit('list-online', data);
        // } else {
        let data = await Online.listOnline();
        
        io.emit('list-online', data);
        //}
        // user.on('login', async function() {
        //     console.log(dataUser['displayname'], "disconnected!");
        //     Online.offline(dataUser['iduser']);
        //     console.log(user.request._query['displayname'], "is connecting!!");
        //     dataUser = user.request._query;
        //     data = await Online.online({ iduser: dataUser['iduser'], displayname: dataUser['displayname'] })
        //     user.emit('list-online', data);
        // })

        user.on('join-room', async function(data) {
            console.log("Join:" ,data);

            // const join_instance = await Board.joinBoard(data);
            // console.log("instance: ",join_instance)
            // if (join_instance.message === "Room full!") {
            //     console.log("Error join");
            //     user.emit('error-join', join_instance);
            //     return
            // }

            console.log("Vẫn vào!");
            user.join(data[0]);

            user.on('message', function(msg) {
                console.log(msg);
                user.to(data[0]).emit("message-room", msg[0]);
            })

            user.on('play-caro', function(info_game) {
                console.log('emit play-caro')
                user.to(data[0]).emit("receive", info_game);
            })

            user.on('win-game', function(info_game) {
                user.to(data[0]).emit("win-game", info_game);
            })

            user.on('leave-room', function(){
                console.log("Leave: ", data);
                user.leave(data[0]);
                Board.leaveBoard(data);
            })
        })

        user.on('disconnect', async function (data) {
            console.log(user.request._query['displayname'], "disconnected!");
            Online.offline(dataUser.iduser);

            let dataOfline = await Online.listOnline();

            io.emit('list-online', dataOfline);
        })

        user.on('send-message', async function (data) {
            await Chat.sendMessage(data);
            user.emit('update-area-chat', data);
        })

    })

    return io;
}