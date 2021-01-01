const QuickPlayService = require("../service/QuickPlayService");
const ResApiService = require("../service/ResApiService")
class ControllerTextSocket {
    async createQuickPlay(req, res) {
        try {
            const data = await QuickPlayService.create(req.body);
            if (!data) return ResApiService.ResApiNotFound(res);
            return ResApiService.ResApiSucces(data, "", 200, res);
        } catch (error) {
            console.log(error);
            return ResApiService.ResApiServerError(res);
        }
    }

    async getDelete(req, res) {
        try {
            console.log("AAAA")
            const data = await QuickPlayService.getAndDelete();
            if (!data) return ResApiService.ResApiNotFound(res);
            console.log("Bắt cặp được rồi: " + data[0] + "\t" + data[1]);
            return ResApiService.ResApiSucces(data, "Quick play success", 200, res);
        } catch (error) {
            console.log(error);
            return ResApiService.ResApiServerError(res);
        }
    }
    
    async deleteQuickPlay(req, res) {
        try {
            const data = await QuickPlayService.delete(req.body.iduser);
            if (!data) return ResApiService.ResApiNotFound(res);
            return ResApiService.ResApiSucces(data, "", 200, res);
        } catch (error) {
            console.log(error);
            return ResApiService.ResApiServerError(res);
        }
    }
}

module.exports = new ControllerTextSocket();