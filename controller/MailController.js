const MailService = require("../service/MailService")
class Mail {
    async send(req, res){
        try {
            await MailService.main();
            return res.status(200).json({message: "ok"})
        } catch (error) {
            console.log(error);
            res.status(404).json({err: error})
        }
    }

    async trigger(req,res) {
        try {
            await MailService.triggerAccount(req);
            return res.status(200).json({message: "ok"})
        } catch (error) {
            console.log(error);
            res.status(404).json({err: error});
        }
    }

    async confirm(req, res) {
        try {
            await MailService.confirmAccount(req);
            return res.status(200).json({message: "ok"})
        } catch (error) {
            console.log(error);
            res.status(404).json({err: error});
        }
    }
}

module.exports = new Mail();