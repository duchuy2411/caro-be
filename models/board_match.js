const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schemaBoard_match = new Schema ({
    id_board: {
        type: String
    },
    id_user1: {
        type: String
    },
    id_user2: {
        type: String
    },
    step: {
        type: Array,
        default: []
        // Mảng { x , y , user: 1 || 2 }
    },
    win: {
        type: String,
        default: null
        // ObjectId
    },
    size: {
        type: Number,
        default: 20
        // Number x Number
    }
}) 

const Board_match = mongoose.model('Board_match', schemaBoard_match);

module.exports = Board_match;