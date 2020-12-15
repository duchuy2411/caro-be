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

const getBoardByCode = async (req,res) => {
    const board = await Board.findOne({code: req.params.id});
    if (board) {
        return res.status(200).json({
            error: 0,
            message: '',
            data: board
        })
    } else {
        return res.status(404).json({
            error: 1,
            message: 'not found'
        })
    }
}

const createBoard = async(req, res) => {
    const {user, width, height, title, description} = req.body;
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
        size_width: width,
        size_height: height,
        history: []
    })

    const new_board = await board.save();

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
    leaveBoard,
    getBoardByCode
}