const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const BoardSchema = new Schema({
    code: {
        type: Number
        // 
    },
    password: {
        type: String // Optional
        // > 6, < 20
    },
    title: {
        type: String
        // > 5 , < 50
    },
    description: {
        type: String
    },
    time: {
        type: String
    },
    size: {
        type: Number, // Number x Number
        default: 20
    },
    id_user1: {
        type: String // ObjectId Host 
    },
    id_user2 : {
        type: String // ObjectId
    },
    state: {
        type: Number, // -1 đã xóa, 1 rãnh rỗi, 0 đang chơi,
        default: 1
    },
})

// BoardSchema.pre('save', function() {
//     let board = this;
//     if (!board.password) next();
//     bcrypt.genSaltSync(10);
//
//     bcrypt.hash(board.password, salt, function(err, hash) {
//         if (err) return next(err);
//
//         board.password = hash;
//         next();
//     })
// })

const Board = mongoose.model('Board', BoardSchema);
module.exports = Board;

