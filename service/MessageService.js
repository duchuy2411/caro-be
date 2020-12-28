const Message = require("../models/message");

class MessageService {
    async create(data) {
        const createData = new Message({
            data
        });
        const result = await createData.save();
        if (!result) return null;
        return result;
    }
}

module.exports = new MessageService();