const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcryptjs = require('bcryptjs');

const schemaUser = new Schema ({
    displayname: {
        type: String
        // Khong co ky tu dac biet
        // 5 - 50
    },
    username: {
        type: String
        // Khong co khoang trang
        // 5 - 50
        // unique
    },
    password: {
        type: String
        // > 6
    },
    email: {
        type: String
        // dinh dang xxx@xxx.xxx
    },
    join_date: {
        type: Date
    },
    cup: {
        type: Number,
        default: 0
        //
    },
    total_match: {
        type: Number,
        default: 0
    },
    win_match: {
        type: Number,
        default: 0
    },
    win_percent: {
        type: Number,
        default: 100
    },
    block: {
        type: Number
    },
    is_Delete: {
        type: Number
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