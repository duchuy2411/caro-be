const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BoardSchema = new Schema({
    code: {
        type: Number
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    id_user1: {
        type: String
    },
    id_user2: {
        type: String
    },
    size_width: {
        type: Number
    },
    size_height: {
        type: Number
    },
    history: {
        type: Array
    }
})

const Board = mongoose.model('Board', BoardSchema);
module.exports = Board;

