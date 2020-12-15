const Board = require('../../models/board');

const joinBoard = async (data) => {
    console.log("tạo");
    const boardid = data[0];
    const user2 = data[1];

    const search_board = await Board.findOne({_id: boardid});

    if (search_board.id_user2 !== null ) return {
        error: 0,
        message: "Room full!"
    }

    console.log(search_board);
    if (search_board.id_user1 === user2) return {
        error: 0,
        message: "you here!"
    }

    const update_board = await Board.findOneAndUpdate({_id: boardid}, {id_user2: user2});
    const new_board = await Board.find({_id: boardid});
    console.log("New board: ", new_board);
    return {
        error: 0,
        message: 'Join success!',
        data: new_board
    }
}

const leaveBoard = async (data) => {
    console.log(data[0]);

    const boardid = data[0];
    const user = data[1];

    const update_board = await Board.find({_id: boardid});

    console.log(update_board[0], " ", user);

    if (update_board[0].id_user1 === user) {
        if (!update_board[0].id_user2) {
            console.log("user1 leave")
            const delete_board = await Board.deleteOne({_id: boardid});
            return {
                error: 0,
                message: 'Leave success!'
            }
        }
        console.log("user1 leave, replace user2")
        const replace_user = update_board[0].id_user2;
        const new_board = await Board.findOneAndUpdate({_id: boardid}, {id_user1: replace_user, id_user2: null})
    } else {
        console.log("user2 leave")
        const new_board = await Board.findOneAndUpdate({_id: boardid}, {id_user2: null});
    }

    return {
        error: 0,
        message: 'Leave success!'
    }
}

module.exports = {
    joinBoard, leaveBoard
}