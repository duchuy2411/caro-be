const Board = require("../models/board");

class BoardService {

    async getAll() {
        const result = await Board.find({});
        if (!result) return null;
        return result;
    }

    async getBoardAlive() {
        const result = await Board.find({state: {$ne: -1}});
        if (!result) return null;
        return result;
    }

    async getBoardByCode(code) {
        const result = await Board.findOne({code: code, state: {$ne: -1}});
        if (!result) return null;
        return result;
    }

    async create(createData) {
        // Validate
        const { title, description, id_user1 } = createData;

        if (createData.password)
        if (createData.password.length < 6 && createData.password.length > 20) return null;
        if (createData.title.length > 50 && createData.title.length < 5) return null;

        if (createData['id_user1']) {
            const exist_board = await Board.find({id_user1: createData['id_user1'], state: {$ne: -1}});
    
            if (exist_board.length !== 0) return exist_board;
        }
        // GENERATE code
        let oldBoard, code;
        do {
            code = Math.floor(Math.random() * (10000 - 1) + 1);
            oldBoard = await Board.findOne({code});
        } while (oldBoard);

        const board = new Board({
            code,
            title,
            description,
            id_user1: id_user1,
            id_user2: null,
            state: 0
        })
    
        let new_board = await board.save();

        console.log(new_board);

        return new_board;
    }

    async update(updateData) {
        const data = await Board.findOneAndUpdate({_id: updateData._id}, {updateData});
        if (!data) return null;

        return data;
    }

    async delete(id) {
        const data = await Board.findOneAndUpdate({_id: id}, {status: -1});
        if (!data) return null;

        return data;
    }

    async updateStatus(status, id) {
        const data = await Board.findOneAndUpdate({_id: id}, {status: status});
        if (!data) return null;

        return data;
    }

    async join(boardid, user2) {
    
        const search_board = await Board.findOne({_id: boardid});

        if (search_board.id_user2 !== null ) return null;

        const update_board = await Board.findOneAndUpdate({_id: boardid}, {id_user2: user2}, {new: true});

        return update_board;
    }

    async leave(boardid, user) {
        const update_board = await Board.find({_id: boardid});
        if (!update_board || update_board[0].state === -1) return null;

        if (update_board[0].id_user1 === user) {
            // Update board delete
            if (update_board[0].id_user2 === null) {
                const delete_board = await Board.findOneAndUpdate({_id: boardid}, {state: -1}, {new: true});
                return delete_board;
            }
            // Host leave and user 2 become host
            const replace_user = update_board[0].id_user2;
            const new_board = await Board.findOneAndUpdate({_id: boardid}, {id_user1: replace_user, id_user2: null}, {new: true})
            return new_board;
        } else {
            // Case Normal
            const new_board = await Board.findOneAndUpdate({_id: boardid}, {id_user2: null}, {new: true});
            return new_board;
        }
    }


}

module.exports = new BoardService();