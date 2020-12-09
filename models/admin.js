const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcryptjs = require('bcryptjs');

const schemaUser = new Schema ({
    username: {
        type: String
    },
    password: {
        type: String
    }
})

schemaUser.methods.isValidPassword = function(password) {
    let admin = this;

    if (bcryptjs.compareSync(password, admin.password)) return true;
    return false;
}

schemaUser.pre('save', function(next) {
    let admin = this;

    const salt = bcryptjs.genSaltSync(10);

    bcryptjs.hash(admin.password, salt, function(err, hash) {
        if (err) return next(err);

        admin.password = hash;
        next();
    })
})

const Admin = mongoose.model('Admin', schemaUser);

module.exports = Admin;