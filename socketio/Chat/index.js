const Message = require("../../models/message");

const sendMessage = async(data) => {

    const {fromUsername, fromDisplayName, fromBoardId, content} = data;

    const message = new Message({fromUsername, fromDisplayName, fromBoardId, content});
    const new_message = await message.save();
}

const getCurrentAreaChat = async(boardId) => {
    const chatContentList = await Message.find({fromBoardId: boardId});
    return chatContentList;
}

module.exports = {
    sendMessage,
    getCurrentAreaChat
}