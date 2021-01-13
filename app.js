//modules
const express = require('express');
var app = express();

const http = require('http').createServer(app);
const io = require('./socketio/index').listen(http);
const session = require('express-session');
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config()
const path = require('path');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express')

const cors = require('cors')

const morgan = require('morgan')

const cookieParser = require('cookie-parser');

app.use(session({
    resave: true, 
    saveUninitialized: true, 
    secret: 'somesecret', 
    cookie: { maxAge: 60000 }
}));
const passport = require('passport');

//router
const user = require("./router/user/index.js");
const admin = require("./router/admin/index.js");
const board = require("./router/board/index.js");
const message = require('./router/message/index.js');
const match = require('./router/match/index.js');
const auth = require('./router/user/auth/index.js');

require('./models/mongoose.js');

const port = 8000

app.use(cors())
app.use(express.json());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

const swaggerOption = {
    swaggerDefinition: {
        info: {
            title: "Caro API",
            description: "DATABASE = 'mongodb+srv://dbcaro:Huykhung123.@cluster0.jtp3p.mongodb.net/db_dev_caro?retryWrites=true&w=majority'",
            servers: ["http://localhost:8000"]
        }
    },
    apis: ["./router/swagger_ui_doc.js"]
}

const swaggerDocs = swaggerJsDoc(swaggerOption);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/api/admin", admin);
app.use("/api/api/users", user);
app.use("/api/boards", board);
app.use("/api/messages", message);
app.use("/api/matchs", match);
app.use("/api/auth", auth);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client/build')));
}
//
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

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

http.listen(process.env.PORT ? process.env.PORT : port, () => {
    console.log("Server on!");
})

