const socketio = require('socket.io')

const userOnline = [];

module.exports.listen = function(app) {
    io = socketio(app, {cors: {
        origin: '*'
        }});
    
    io.on('connection', function(user){
        console.log(user.id, "is connecting!!");
        userOnline.push(user.id);

        io.emit('list-user', userOnline);

        user.on('disconnect', function() {
            console.log(user.id, "disconnected!");

            userOnline.splice(userOnline.indexOf(user.id), 1);
        })
    })

    return io;
}