const socketio = require('socket.io');
const { io } = require('socket.io-client');

const Online = require('./Online/index');
const OnlineService = require('../service/OnlineService');
const MessageService = require('../service/MessageService');
const sessionStorage = require('node-sessionstorage');
const Board = require("../service/BoardService");
const Match = require('../service/MatchService');
const BoardController = require("../controller/board");

const axios = require('axios');

module.exports.listen = function (app) {

    const io = socketio(app, {
        cors: {
            origin: '*'
        }
    });

    io.on('connection', async function (user) {
        console.log(user.request._query['displayname'], 'connected');
        const dataUser = user.request._query;
        await OnlineService.online(user.request._query)
        //await Online.online(user.request._query);

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
        //let data = await Online.listOnline();
        let data = await OnlineService.listOnline();
        
        user.emit('list-online', data);
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

            let board = await Board.join(data[0], data[1]);

            if (board && board.id_user1 && (board.id_user2 !== "" || !board.id_user2) && board.state === 1) {
                console.log('start game', board);
                user.to(data[0]).emit('ready-start', board);
            }

            await user.join(data[0]);

            user.on('start-game', async function () {
                const [newMatch, board, user1, user2] = await Match.create(data[0]); // đã set state = 0 trong db
                board.state = 0;
                io.in(data[0]).emit('new-match', [newMatch, board, user1, user2]);
            });

            user.on("send-message", function (info_chat) {
                console.log(info_chat.fromUsername + ": " + info_chat.content);
                MessageService.create(info_chat);
                //axios.post("http://localhost:8000/messages/send-message", {fromUsername: info_chat.fromUsername, fromDisplayName: info_chat.fromDisplayName, fromBoardId: info_chat.fromBoardId, fromBoardMatch: info_chat.fromBoardMatch, content: info_chat.content});
                user.to(data[0]).emit("update-area-chat", info_chat);
            })

            user.on('play-caro', function([idMatch, squares, msg]) {
                console.log('emit play-caro');
                Match.addStep([idMatch, squares, msg]);
                user.to(data[0]).emit("receive", [squares, msg]);
            })

            user.on('win-game', function([idMatch, winner, loser, line, msg]) {
                Match.win(idMatch, winner, loser, data[0]); // đã set state = 0 trong db
                board.state = 1;
                io.in(data[0]).emit("win-game", [line, msg]);
            })

            user.on('leave-room', async function(){
                console.log("Leave: ", data);
                user.leave(data[0]);
                if (data[1] === board.id_user1 || data[1] === board.id_user2) {
                    board = await Board.leave(data[0], data[1]);
                    user.to(data[0]).emit('update-ui-leave-room', board);
                }
                io.emit('update-table', board);
            })
        })

        user.on('disconnect', async function (data) {
            console.log(user.request._query['displayname'], "disconnected!");
            Online.offline(dataUser.iduser);

            let dataOfline = await Online.listOnline();

            io.emit('list-online', dataOfline);
        })

        user.on('invite-user-clicked-quick-play', async function (data) {
            console.log("User " + data[0] + " invite user " + data[1]);
            const _board = await Board.getBoardByIdUser1(data[0]);
            //const api = await axios.get("http://localhost:8000/boards/iduser1/" + data[0]);

            if (_board) {
                io.emit('join-room-quick-play', [data[1], _board.code]);
            }
        })

        user.on('invite-user', async function (data) {
            console.log("User " + data[0] + " invite user " + data[1] + "join board " + data[2]);
            io.emit('send-invitation', [data[0], data[1], data[2]]);
        })

        user.on('create-table', async function(data) {
            console.log("Create: ", data[0]);
            io.emit('add-new-table', data[0]);
        })

    })

    return io;
}