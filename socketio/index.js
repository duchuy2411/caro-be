const socketio = require('socket.io');
const { io } = require('socket.io-client');

const Online = require('./Online/index');

module.exports.listen = function(app) {

    const io = socketio(app, {cors: {
        origin: '*'
    }});

    io.on('connection', async function(user){
        console.log(user.request._query['displayname'], "is connecting!!");

        const dataUser = user.request._query

        let data = await Online.online({iduser: dataUser['iduser'], displayname: dataUser['displayname']})
        user.emit('list-online', data);

        user.on('disconnect', function() {
            console.log(user.request._query['displayname'], "disconnected!");
            Online.offline(dataUser['iduser']);
        })
    })

    return io;
}