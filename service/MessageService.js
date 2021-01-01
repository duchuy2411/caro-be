const Message = require("../models/message");

class MessageService {
    async create(data) {
        const createData = new Message(data);
        const result = await createData.save();
        if (!result) return null;
        return result;
    }
    async getMessageFromBoardId(boardId) {
        const chatContentList = await Message.find({fromBoardId: boardId});
        return chatContentList;
    }
}

module.exports = new MessageService();