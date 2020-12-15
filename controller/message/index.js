const Message = require('../../models/message')

const getMessageFromBoardId = async(req,res) => {
    console.log(req.params.fromBoardId);
    const messages = await Message.find({fromBoardId: req.params.fromBoardId});
    return res.status(200).json(
    {
        error: 0,
        message: '',
        data: messages
    });
}

module.exports = {
    getMessageFromBoardId
}