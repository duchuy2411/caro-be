const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schemaMessage = new Schema ({
    from: {
        type: String
    },
    to: {
        type: Array
    },
    message: {
        type: String
    },
    time: {
        type: Date,
        default: Date.now()
    }
}) 

const Message = mongoose.model('Message', schemaMessage);

module.exports = Message;