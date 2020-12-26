const Board = require("../models/board");

class BoardService {

    async getAll() {
        const result = await Board.find({});
        if (!result) return null;
        return result;
    }

    async getBoardAlive() {
        const result = await Board.find({});
        if (!result) return null;
        return result;
    }

    async getBoardByCode(code) {
        const result = await Board.findOne({code: code});
        if (!result) return null;
        return result;
    }

    async create(createData) {
        // Validate
        if (createData.password.length < 6 && createData.password.length > 20) return null;
        if (createData.title.length > 50 && createData.title.length < 5) return null;

        if (createData['id_user1']) {
            const exist_board = await Board.find({id_user1: createData['id_user1']});
    
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
            id_user1: user,
            id_user2: null,
            size,
            state: 1
        })
    
        const new_board = await board.save();
        if (!new_board) return null;
        console.log(new_board);
        return new_board;
    
        // const new_board_get = await Board.findOne({id_user1: user})
    }

    async update(updateData) {
        const data = await Board.findOneAndUpdate({_id: updateData._id}, {updateData});
        if (!data) return null;

        return data;
    }

    async join(boardid, user2) {
        const update_board = await Board.findOneAndUpdate({_id: boardid}, {id_user2: user2});
        if (!update_board) return null;

        const new_board = await Board.find({_id: boardid});
        if (!new_board) return null;

        return new_board;
    }

    async leave(boardid, user) {
        const update_board = await Board.find({_id: boardid});
        if (!update_board || update_board.state === -1) return null;

        if (update_board[0].id_user1 === user) {
            // Update board delete
            if (update_board[0].id_user2 === null) {
                const delete_board = await Board.findOneAndUpdate({_id: boardid}, {state: boardid});
                return delete_board;
            }
            // Host leave and user 2 become host
            const replace_user = update_board[0].id_user2;
            const new_board = await Board.findOneAndUpdate({_id: boardid}, {id_user1: replace_user, id_user2: null})
            return new_board;
        } else {
            // Case Normal
            const new_board = await Board.findOneAndUpdate({_id: boardid}, {id_user2: null});
            return new_board;
        }
    }
}