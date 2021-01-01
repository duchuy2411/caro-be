const Match = require("../models/board_match");
const User = require("../models/user");

class MatchService {
    async create(saveData) {
        const data = new Match({...saveData});
        const new_match = await data.save();
        if (!new_match) return null;
        return new_match;
    }

    async update(updateData) {
        const update_match = await Match.findOneAndUpdate({_id: updateData.id}, {...updateData}, {new: true});
        if (!update_match) return null;
        return update_match;
    }

    async win(id_winner, id_loser, [score_x, score_y], updateData) {

        const [win, lose] = this.get_cup(score_x, score_y);
        score_x += win;
        score_y += lose;
        const update_winner = await User.findOne({_id: id_winner});
        const update_loser = await User.findOne({_id: id_loser});

        update_winner['cup'] = score_x;
        update_loser['cup'] = score_y;

        update_winner['total_match'] += 1;
        update_loser['total_match'] += 1;
        update_winner['win_match'] += 1;

        update_winner['win_percent'] = update_winner['win_match']/update_winner['total_match'];
        update_loser['win_percent'] = update_loser['win_match']/update_loser['total_match'];

        let updateDataWinner = await User.findOneAndUpdate({_id: id_winner}, {...update_winner}, {new: true});
        console.log(updateDataWinner)
        if (!updateDataWinner) return;
        let updateDataLoser = await User.findOneAndUpdate({_id: id_loser}, {...update_loser}, {new: true});
        console.log(updateDataLoser)
        if (!updateDataLoser) return;

        const data = await Match.findOneAndUpdate({_id: updateData.id}, {win: updateData.id_winner});
        if (!data) return null;

        return data;
    }

    get_cup(x, y) {
        let diff = Math.abs(x - y);

        if (diff == 0) {
            return [10, -10];
        }


        if (x > y) {
            let min = 10 - diff*0.1 < 1 ? 1 :10 - diff*0.1;
            let max = -10 + diff*0.12 > 1 ? -1 : -10 + diff*0.12
            return [ Math.ceil(min) , Math.ceil(max) ];
        } else {
            let min = -10 - diff*0.2 < -25 ? -25 : - 10 - diff*0.2;
            let max = 10 + diff*0.1 > 20 ? 20 : 10 + diff*0.1
            return [ Math.ceil(max), Math.ceil(min) ]
        }
    }
}

module.exports = new MatchService();