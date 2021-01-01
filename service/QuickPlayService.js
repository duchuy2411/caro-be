const QuickPlay = require("../models/quick_play");

class QuickPlayService {
    async create(createData) {
        const quick_play = new QuickPlay({
            iduser: createData.iduser,
            cup: createData.cup
        });
        console.log(quick_play);
        const result = await quick_play.save();
        return result;
    }

    async getAndDelete() {
        console.log("hear")
        const getData = await QuickPlay.find({}).sort({'cup': -1});
        console.log(getData);
        const user_1 = getData[0].iduser;
        const user_2 = getData[1].iduser;
        if (!user_1 || !user_2) return null;
        const delete_1 = await QuickPlay.findOneAndDelete({iduser: user_1});
        const delete_2 = await QuickPlay.findOneAndDelete({iduser: user_2});
        if (!delete_1 || !delete_2) return null;

        return [ user_1, user_2 ];
    }
}

module.exports = new QuickPlayService();