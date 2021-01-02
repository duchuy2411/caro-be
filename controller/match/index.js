const MatchService = require("../../service/MatchService");
const BoardService = require("../../service/BoardService");
const ResApiService = require("../../service/ResApiService");

const create = async (req, res) => {
    try {
        const createData = req.body;
        let data = await MatchService.create(createData.codeBoard);
        if (!data) return ResApiService.ResApiNotFound(res);

        return ResApiService.ResApiSucces(data, "Create success!", 201, res);
    } catch (error) {
        console.log(error);
        return ResApiService.ResApiServerError(res);
    }
}
    

const update = async (req, res) => {
    try {
        const updateData = req.body;
        let data = await MatchService.update(updateData);
        if (!data) return ResApiService.ResApiNotFound(res);

        return ResApiService.ResApiSucces(data, "Update success!", 202, res);
    } catch (error) {
        console.log(error);
        return ResApiService.ResApiServerError(res);
    }
}

const update_win = async (req, res) => {
    try {
        const { id_winner, id_loser } = req.body;
        let data = await MatchService.win(id_winner, id_loser, req.body);
        if (!data) return ResApiService.ResApiNotFound(res);

        return ResApiService.ResApiSucces(data, "Update success!", 202, res);
    } catch (error) {
        console.log(error);
        return ResApiService.ResApiServerError(res);
    }
}

module.exports = {
    create,
    update,
    update_win
}