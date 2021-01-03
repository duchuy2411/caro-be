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
        const getData = await QuickPlay.find({}).sort({'cup': -1});
        if (getData.length < 2) return null;
        
        let user_1 = null, user_2 = null;
        if (getData[0])
            user_1 = getData[0].iduser;
        if (getData[1])
            user_2 = getData[1].iduser;
        
        if (!user_1 || !user_2) return null;
        
        const delete_1 = await QuickPlay.findOneAndDelete({iduser: user_1});
        const delete_2 = await QuickPlay.findOneAndDelete({iduser: user_2});
        if (!delete_1 || !delete_2) return null;
        return [ user_1, user_2 ];
    }

    async delete(deleteData) {
        const result = await QuickPlay.findOneAndDelete({iduser: deleteData});
        return result;
    }
}

module.exports = new QuickPlayService();