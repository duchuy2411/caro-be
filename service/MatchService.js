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
        const board = await Board.findOneAndUpdate({code: codeBoard}, {state: 0}, {new: true});
        if (!board) return null;

        const user1 = await User.findOne({_id: board.id_user1});
        const user2 = await User.findOne({_id: board.id_user2});

        const new_match = new Match({
            id_board: board._id,
            id_user1: board.id_user1,
            id_user2: board.id_user2,
            displayname_user1: user1.displayname,
            displayname_user2: user2.displayname
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
        if (!updateMatch) return null;
        await Match.updateOne({_id: idMatch}, {
            $push: {step: {squares, message: msg}}
        });
    }

    async win(idMatch ,id_winner, id_loser, codeBoard) {
        const board = await Board.findOneAndUpdate({code: codeBoard}, {state: 1}, {new: true});

        const update_winner = await User.findOne({_id: id_winner});
        const update_loser = await User.findOne({_id: id_loser});

        const [win, lose] = this.get_cup(update_winner.cup, update_loser.cup);
        update_winner['cup'] += win;
        update_loser['cup'] += lose;

        update_winner['total_match'] += 1;
        update_loser['total_match'] += 1;
        update_winner['win_match'] += 1;

        update_winner['win_percent'] = this.round_2_digits((update_winner['win_match']/update_winner['total_match'])*100);
        update_loser['win_percent'] = this.round_2_digits((update_loser['win_match']/update_loser['total_match'])*100);

        let updateDataWinner = await User.findOneAndUpdate({_id: id_winner}, {...update_winner}, {new: true});
        if (!updateDataWinner) return;
        let updateDataLoser = await User.findOneAndUpdate({_id: id_loser}, {...update_loser}, {new: true});
        if (!updateDataLoser) return;

        const data = await Match.findOneAndUpdate({_id: idMatch}, {win: id_winner, displayname_win: update_winner.displayname}, {new: true});
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

    round_2_digits(num) {
        return Math.round(num * 100) / 100;
    }
}

module.exports = new MatchService();