const nodemailer = require("nodemailer");
const UserService = require("./UserService");
const User = require("../models/user")
const bcryptjs = require("bcryptjs")
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'bhanhmay31@gmail.com', // generated ethereal user
      pass: 'huykhung123', // generated ethereal password
    },
});

async function main(data) {
    // const new_pass = "123456";
    // const salt = bcryptjs.genSaltSync(10);

    // bcryptjs.hash(new_pass, salt, function(err, hash) {
    //     const user = await User.findOneAndUpdate({_id: data.id}, {password: hash}, {new: true})
    //     if (err) return null;
    // })       
    let info = await transporter.sendMail({
        from: 'bhanhmay31@gmail.com', // sender address
        // to: `${data.email}`, // list of receivers
        to: 'duchuy2411itd@gmail.com',
        subject: "Your password ✔", // Subject line
        text: "", // plain text body
        html: `<b>Your password is: 123456</b>
        <br>
        <p>Please change password</p>`, // html body
    });
    
}

async function triggerAccount(req) {
    const code = Math.ceil(Math.random(4)*10000);
    console.log(code)
    req.session[`${req.body.id}`] = {
        data: req.body.id,
        code: code
    }
    return;
}

async function confirmAccount(req) {
    console.log(req.session," ",req.body.id);
    console.log(req.session[`${req.body.id}`]);
    return;
}

module.exports = {
    main, triggerAccount, confirmAccount
}