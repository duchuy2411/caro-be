const User = require('../../models/user');
const Online = require('../../models/online');
const Admin = require('../../models/admin');
const Match = require('../../models/board_match');
const Board = require('../../models/board');
const Message = require('../../models/message');
const JWT = require("jsonwebtoken");

const encodedToken = (id) => {
    return JWT.sign({
        iss: '',
        sub: id,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 3)
    }, process.env.JWT_SECRET ? process.env.JWT : 'webnangcao')
};

const login = async (req, res) => {
    console.log(req.body);
    const admin = await Admin.findOne({username: req.body.username});
    // 5fd0a9bc941a53579060a13e
    if (admin && admin.isValidPassword(req.body.password)) {
        const token = encodedToken(admin._id);

        return res.status(201).json({
            error: 0,
            message: 'Login  success!',
            token
        })
    } else {
        return res.status(401).json({
            error: 'login failed'
        })
    }
}

const register = async (req, res) => {
    const admin = new Admin(req.body);
    const result = await admin.save();
    return res.send(result);
}

const getUsers = async (req, res) => {
    if (!req.query.q) {
        req.query.q = '.';
    }
    const total = await User.find({}).select('_id');
    const users = await User.find({$or: [
            {
                displayname: {'$regex' : req.query.q, '$options' : 'i'}
            },
            {
                email: {'$regex' : req.query.q, '$options' : 'i'}
            }
        ]}).skip(parseInt(req.query._start)).limit(10);
    const response = users.map((el, index) => {
        return {...el.toObject(), id: el._id};
    });
    res.header('Access-Control-Expose-Headers', 'X-Total-Count')
    res.header('X-Total-Count', total.length);
    return res.status(200).json(response);
}

const getUser = async (req, res) => {
    const user = await User.findOne({_id: req.params.id});
    let idMatches = await Match.find({$or: [
            {
                id_user1: user._id
            },
            {
                id_user2: user._id
            }
        ]}).select('_id');
    idMatches = idMatches.map(el => {
        return el._id;
    })
    return res.status(200).json({...user.toObject(), id: user._id, idMatches});
}

const blockUser = async (req, res) => {
    console.log(req.params);
    try {
        await User.findOneAndUpdate({_id: req.body._id}, {...req.body});
        return res.status(200).json({msg: 'block success'});
    } catch (e) {
        return res.status(400).json({err: 'can not block'});
    }
}

const getMatches = async (req, res) => {
    // if (!req.query.q) {
    //     req.query.q = '.';
    // }
    // const matches = await Match.find({$or: [
    //         {
    //             displayname: {'$regex' : req.query.q, '$options' : 'i'}
    //         },
    //         {
    //             email: {'$regex' : req.query.q, '$options' : 'i'}
    //         }
    //     ]});
    const total = await Match.find({}).select('_id');
    const matches = await Match.find({}).skip(parseInt(req.query._start)).limit(10);
    const responsePromise = [];
    // let response = matches.map(async (el, index) => {
    //     const boardName = await Board.findOne({_id: el.id_board}).select('title');
    //     return {...el.toObject(), id: el._id, boardName: boardName.title};
    // });
    for (let i = 0; i < matches.length; i++) {
        const boardName = await Board.findOne({_id: matches[i].id_board}).select('title');
        responsePromise.push({...matches[i].toObject(), id: matches[i]._id, boardName: boardName.title});
    }
    res.header('Access-Control-Expose-Headers', 'X-Total-Count')
    res.header('X-Total-Count', total.length);
    return res.status(200).json(responsePromise);
}

const getMatch = async (req, res) => {
    try {
        const match = await Match.findOne({_id: req.params.id});
        const board = await Board.findOne({_id: match.id_board});
        const messages = await Message.find({fromBoardMatch: match._id});
        return res.status(200).json({
            ...match.toObject(),
            id: match._id,
            id_board: {...board.toObject()},
            messages,
            });
    } catch (err) {
        console.log(err);
        return res.status(404).json({err})
    }
}


module.exports = {
    getUsers,
    login,
    register,
    getUser,
    blockUser,
    getMatches,
    getMatch
}