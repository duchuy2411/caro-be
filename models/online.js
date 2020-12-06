const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schemaOnline = new Schema ({
    arrayUser : {
        type: Array
    }
}) 

const Online = mongoose.model('Online', schemaOnline);

module.exports = Online;