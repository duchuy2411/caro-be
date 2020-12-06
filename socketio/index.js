const socketio = require('socket.io')

module.exports.listen = function(app) {
    io = socketio(app, {cors: {
        origin: '*'
        }});
    
    io.on('connection', function(user){
        console.log(user.id, "is connecting!!");

        user.on('disconnect', function() {
            console.log(user.id, "disconnected!");
        })

        user.on('hello-server', function(data) {
            console.log("huy dang nghe:", data);
        })
    })

    return io;
}