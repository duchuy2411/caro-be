//modules
const express = require('express');
var app = express();

const http = require('http').createServer(app);
const io = require('./socketio/index').listen(http);

const cors = require('cors')

const morgan = require('morgan')
//router
const user = require("./router/user/index.js");
const admin = require("./router/admin/index.js")
require('./models/mongoose.js');
const dotenv = require("dotenv").config()

const port = 8000

app.use(cors())
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/user", user);

app.get("/", (req,res) => {
    res.status(200).json({
        message: "OK"
    })
})

app.use((req,res,next) => {
    const err = "Page not found";
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    const error = app.get('env') === 'development' ? err : {};
    const status = err.status || 500;
    return res.status(status).json({
        error: 1,
        message: error.message
    })
})

// io.on('connection', (socket) => {
//     console.log("A user connection: ",socket.id);

//     socket.on('disconnect', () => {
//         console.log(socket.id, " disconnected!!");
//     })

//     socket.on('hello-server', (data) => {
//         console.log("Huy đang nghe: ", data);
//     })
// })


http.listen(process.env.PORT ? process.env.PORT : port, () => {
    console.log("Server on!");
})

