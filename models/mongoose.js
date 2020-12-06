const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://dbUser:Huykhung123.@cluster0.jtp3p.mongodb.net/<dbname>?retryWrites=true&w=majority');
var db = mongoose.connection;
//Bắt sự kiện error
db.on('error', function(err) {
    if (err) console.log(err)
});
//Bắt sự kiện open
db.once('open', function() {
    console.log("Kết nối thành công !");
});