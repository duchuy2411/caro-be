const index = (req, res) => {
    res.status(200).json({
        error: 0,
        message: "OK",
        data : null
    })
}

module.exports = {
    index
}