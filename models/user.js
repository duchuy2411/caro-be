const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schemaUser = new Schema ({
    displayname: {
        type: String
    },
    username: {
        type: String
    },
    password: {
        type: String
    },
    email: {
        type: String
    }
}) 

const User = mongoose.model('User', schemaUser);

module.exports = User;