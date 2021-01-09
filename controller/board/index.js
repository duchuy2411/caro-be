const Board = require('../../models/board')
const BoardService = require('../../service/BoardService');
const ResApiService = require('../../service/ResApiService');

const getAll = async(req, res) => {
    try {
        const data = await BoardService.getBoardAlive();
        if (!data) return ResApiService.ResApiNotFound(res);

        return ResApiService.ResApiSucces(data, '', 200, res);
    } catch (error) {
        console.log(error);
        return ResApiService.ResApiServerError(res);
    }
}

const getBoardByCode = async (req,res) => {
    try {
        const data = await BoardService.getBoardByCode(req.params.id);
        if (!data) return ResApiService.ResApiNotFound(res);

        return ResApiService.ResApiSucces(data, '', 200, res);
    }
    catch (error) {
        console.log(error);
        return ResApiService.ResApiServerError(res);
    }
}

const getBoardByIdUser1 = async (req,res) => {
    try {
        const data = await BoardService.getBoardByIdUser1(req.params.iduser1);
        if (!data) return ResApiService.ResApiNotFound(res);

        return ResApiService.ResApiSucces(data, '', 200, res);
    }
    catch (error) {
        console.log(error);
        return ResApiService.ResApiServerError(res);
    }
}

const createBoard = async(req, res) => {
    try {
        const createData = await BoardService.create(req.body);
        console.log("Create board:", createData);
        if (!createData) return ResApiService.ResApiNotFound(res);

        return ResApiService.ResApiSucces(createData, "Create success!", 201, res);
    } catch (error) {
        console.log(error);
        return ResApiService.ResApiServerError(res);
    }
    
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
    try {
        const id = req.body.boardid;
        const id_user2 = req.body.user2;
        const data = await BoardService.join(id, id_user2);
        if (!data) return ResApiService.ResApiNotFound(res);

        return ResApiService.ResApiSucces(data, '', 202, res);
    } catch (error) {
        console.log(error);
        return ResApiService.ResApiServerError(res);
    }
}

const leaveBoard = async (req, res) => {
    try {
        const boardid = req.body.boardid;
        const user = req.body.user;
        console.log(boardid);
        //const {boardid, user} = req.body;
        const data = await BoardService.leave(boardid, user);
        if (!data) return ResApiService.ResApiNotFound(res);

        return ResApiService.ResApiSucces(data, '', 202, res);
    } catch (error) {
        console.log(error);
        return ResApiService.ResApiServerError(res);
    }
}

const update = async (req, res) => {
    try {
        const data = await BoardService.update(req.body);
        if (!data) return ResApiService.ResApiNotFound(res);

        return ResApiService.ResApiSucces(data, '', 202, res);
    } catch (error) {
        console.log(error);
        return ResApiService.ResApiServerError(res);
    }
}

module.exports = {
    getAll,
    createBoard,
    joinBoard,
    leaveBoard,
    getBoardByCode,
    getBoardByIdUser1,
    addHistory,
    getHistoryList
}