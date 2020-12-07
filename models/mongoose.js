const mongoose = require("mongoose")

mongoose.connect('mongodb+srv://dbcaro:Huykhung123.@cluster0.jtp3p.mongodb.net/caroDB?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

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