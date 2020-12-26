const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schemaQuick_play = new Schema ({
    iduser : {
        type: String
    },
    cup: {
        type: Number
    }
}) 

const Quick_play = mongoose.model('Quick_play', schemaQuick_play);

module.exports = Quick_play;