const mongoose = require("mongoose")
// const connect = 'mongodb+srv://dbcaro:Huykhung123.@cluster0.jtp3p.mongodb.net/caroDB_Backend?retryWrites=true&w=majority';
console.log(process.env.DATABASE);
const connect1 = process.env.DATABASE ? process.env.DATABASE : 'mongodb+srv://caro:1@cluster0.1s8sv.mongodb.net/caro-online?retryWrites=true&w=majority';

mongoose.connect(connect1, { useNewUrlParser: true, useUnifiedTopology: true });

var db = mongoose.connection;
//Bắt sự kiện error
db.on('error', function(err) {
    if (err) console.log(err)
});
//Bắt sự kiện open
db.once('open', function() {
    console.log("Kết nối db thành công !");
});

module.exports.db;