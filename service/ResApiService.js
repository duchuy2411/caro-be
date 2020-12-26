class ResApiService {

    ResApiServerError(res) {
        return res.status(500).json({
            error: 1,
            message: "Server error!"
        })
    }

    ResApiNotFound(res) {
        return res.status(404).json({
            error: 1,
            message: "Not found!"
        })
    }

    ResApiSucces(result, message, status, res) {
        return res.status(status).json({
            error: 0,
            message: message,
            data: result
        })
    }
}

module.exports = new ResApiService();