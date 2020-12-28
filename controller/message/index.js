const Message = require('../../models/message')
const MessageService = require('../../service/MessageService');
const ResApiService = require('../../service/ResApiService');

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

const create = async (req, res) => {
    try {
        const createData = req.body;
        const data = await MessageService.create(createData);
        if (!data) return ResApiService.ResApiNotFound(res);

        return ResApiService.ResApiSucces(data, "", 201, res);
    } catch {
        console.log(error);
        return ResApiService.ResApiServerError(res);
    }
}

module.exports = {
    getMessageFromBoardId,
    create
}