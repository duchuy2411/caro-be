const Match = require("../models/board_match");
const User = require("../models/user");
const Board = require('../models/board');

class MatchService {

    // async create(saveData) {
    //     const data = new Match({...saveData});
    //     const new_match = await data.save();
    //     if (!new_match) return null;
    //     return new_match;
    // }

    async create(codeBoard) {
        const board = await Board.findOne({code: codeBoard});
        if (!board) return null;

        const user1 = await User.findOne({_id: board.id_user1});
        const user2 = await User.findOne({_id: board.id_user2});

        const new_match = new Match({
            id_board: codeBoard,
            id_user1: board.id_user1,
            id_user2: board.id_user2
        });
        await new_match.save();
        return [new_match, board, user1, user2];
    }

    async update(updateData) {
        const update_match = await Match.findOneAndUpdate({id_board: updateData.id_board}, {...updateData}, {new: true});
        if (!update_match) return null;
        return update_match;
    }

    async addStep([idMatch ,squares, msg]) {
        const updateMatch = await Match.findOne({_id: idMatch});
        console.log(updateMatch, msg);
        if (!updateMatch) return null;
        await Match.updateOne({_id: idMatch}, {
            $push: {step: {squares, message: msg}}
        });
    }

    async win(id_winner, id_loser, [score_x, score_y], updateData) {

        const update_winner = await User.findOne({_id: id_winner});
        const update_loser = await User.findOne({_id: id_loser});

        const [win, lose] = this.get_cup(update_winner.cup, update_loser.cup);
        console.log(update_winner);
        update_winner['cup'] += win;
        update_loser['cup'] += lose;

        update_winner['total_match'] += 1;
        update_loser['total_match'] += 1;
        update_winner['win_match'] += 1;

        update_winner['win_percent'] = update_winner['win_match']/update_winner['total_match'];
        update_loser['win_percent'] = update_loser['win_match']/update_loser['total_match'];

        let updateDataWinner = await User.findOneAndUpdate({_id: id_winner}, {...update_winner}, {new: true});
        if (!updateDataWinner) return;
        let updateDataLoser = await User.findOneAndUpdate({_id: id_loser}, {...update_loser}, {new: true});
        if (!updateDataLoser) return;

        const data = await Match.findOneAndUpdate({id_board: updateData.id_board}, {win: updateData.id_winner}, {new: true});
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

    async getMatchByIdUser(id_user) {
        const list_match1 = await Match.find({id_user1: id_user});
        const list_match2 = await Match.find({id_user2: id_user});
        return list_match1.concat(list_match2);
    }
}

module.exports = new MatchService();