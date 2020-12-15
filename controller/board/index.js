const Board = require('../../models/board')

const getAll = async(req, res) => {
    const allBoard = await Board.find({});
    return res.status(200).json(
        {
            error: 0,
            message: '',
            data: allBoard
        });
}

const createBoard = async(req, res) => {
    const {user, width, height} = req.body;

    const exist_board = await Board.find({id_user1: user});

    if (exist_board.length !== 0) return res.status(200).json({
        error: 1,
        message: 'Exists user!!',
        data: exist_board[0]
    });

    const board = new Board({
        id_user1: user,
        id_user2: null,
        size_width: width,
        size_height: height,
        history: []
    })

    await board.save();

    const new_board = await Board.find({id_user1: user});

    return res.status(200).json({
        error: 0,
        message: '',
        data: new_board
    })
}

const joinBoard = async (req, res) => {
    const { boardid, user2 } = req.body;
    const update_board = await Board.findOneAndUpdate({_id: boardid}, {id_user2: user2});
    const new_board = await Board.find({_id: boardid});
    return res.status(200).json({
        error: 0,
        message: 'Join success!',
        data: new_board
    })
}

const leaveBoard = async (req, res) => {
    const {boardid, user} = req.body;
    const update_board = await Board.find({_id: boardid});

    console.log(update_board[0].id_user1, " ", user);

    if (update_board[0].id_user1 === user) {
        if (update_board[0].id_user2 === null) {
            const delete_board = await Board.deleteOne({_id: boardid});
            return res.status(200).json({
                error: 0,
                message: 'Leave success!'
            })
        }
        const replace_user = update_board[0].id_user2;
        const new_board = await Board.findOneAndUpdate({_id: boardid}, {id_user1: replace_user, id_user2: null})
    } else {
        const new_board = await Board.findOneAndUpdate({_id: boardid}, {id_user2: null});
    }

    return res.status(200).json({
        error: 0,
        message: 'Leave success!'
    })
}

module.exports = {
    getAll,
    createBoard,
    joinBoard,
    leaveBoard
}