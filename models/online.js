const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schemaOnline = new Schema ({
    iduser : {
        type: String
    },
    displayname: {
        type: String
    }
}) 

const Online = mongoose.model('Online', schemaOnline);

module.exports = Online;