const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema ({
    fromUsername: {
        type: String
    },
    fromDisplayName: {
        type: String
    },
    fromBoardId: {
        type: String
    },
    content: {
        type: String
    },
    time: {
        type: Date,
        default: Date.now()
    }
}) 

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;