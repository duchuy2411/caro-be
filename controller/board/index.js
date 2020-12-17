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

    if (user) {
        const exist_board = await Board.find({id_user1: user});

        if (exist_board.length !== 0) return res.status(200).json({
            error: 1,
            message: 'Exists user!!',
            data: exist_board[0]
        });
    }

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

    const new_board_get = await Board.findOne({id_user1: user})

    return res.status(200).json({
        error: 0,
        message: '',
        data: new_board_get
    })
}

const addHistory = async (req, res) => {
    const {winner} = req.body;
    const board = await Board.findOne({code: req.params.id});

    if (board) {
        let today = new Date();
        let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        let dateTime = time+' '+date;
        const updatedBoard = await Board.updateOne({code: req.params.id}, {history: [...board.history, {winner, date: dateTime}]});
        console.log(updatedBoard);
        return res.status(200).json({
            error: 0,
            message: 'add history success',
            data: updatedBoard
        })
    }
    return res.status(404).json({
        error: 1,
        message: 'not found',
    })
}

const getHistoryList = async (req, res) => {
    const board = await Board.findOne({code: req.params.id});

    if (board) {
        return res.status(200).json({
            error: 0,
            message: 'add history success',
            data: board.history
        })
    }
    return res.status(404).json({
        error: 1,
        message: 'not found',
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
    });
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
    getBoardByCode,
    addHistory,
    getHistoryList
}