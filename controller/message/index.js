const Message = require('../../models/message')
const MessageService = require('../../service/MessageService');
const ResApiService = require('../../service/ResApiService');

const getMessageFromBoardId = async(req,res) => {
    console.log(req.params.fromBoardId);
    const messages = await MessageService.getMessageFromBoardId(req.params.fromBoardId);
    return ResApiService.ResApiSucces(messages, "", 200, res);
}

const create = async (req, res) => {
    try {
        const createData = req.body;
        const data = await MessageService.create(createData);
        if (!data) return ResApiService.ResApiNotFound(res);
        return ResApiService.ResApiSucces(data, "", 201, res);
    } catch (error) {
        console.log(error);
        return ResApiService.ResApiServerError(res);
    }
}

module.exports = {
    getMessageFromBoardId,
    create
}