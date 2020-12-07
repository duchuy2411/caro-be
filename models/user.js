const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcryptjs = require('bcryptjs');

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

schemaUser.methods.isValidPassword = function(password) {
    let user = this;
    
    if (bcryptjs.compareSync(password, user.password)) return true;
    return false;
}

schemaUser.pre('save', function(next) {
    let user = this;

    const salt = bcryptjs.genSaltSync(10);

    bcryptjs.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);

        user.password = hash;
        next();
    })
})

const User = mongoose.model('User', schemaUser);

module.exports = User;