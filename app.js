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
const mongoose = require('mongoose');
const dotenv = require("dotenv").config()

const port = 8000

mongoose.connect('mongodb+srv://dbcaro:Huykhung123.@cluster0.jtp3p.mongodb.net/caroDB?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
//Bắt sự kiện error
db.on('error', function(err) {
    if (err) console.log(err)
});
//Bắt sự kiện open
db.once('open', function() {
    console.log("Kết nối thành công !");
});

app.use(cors())
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/user", user);

app.get("/", (req,res) => {
    res.status(200).json({
        message: "OK"
    })
})

app.use(function(err, req, res, next) {
    console.log(err);

    res.status(500).json({
        error: 1,
        message: "Server error!!"
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

