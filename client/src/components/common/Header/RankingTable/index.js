import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState, useLocation } from 'react';
import axios from "../../../../utils/axios";
import './index.css';

import { useDispatch } from 'react-redux';
import { fetchUserInfoDialog } from '../../../../store/slice/userInfoDialogSlice';

const useStyles = makeStyles((theme) => ({

}));

export default function RankingTable() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [listUserDescending, setListUserDescending] = useState([]);
    let [rankingTable, setRankingTable] = useState([]);
    useEffect(() => {
        async function fetchData() {
            try {
                const api = await axios.get("api/users/all");
                if (api.data.data) {
                    setListUserDescending(api.data.data.sort(compareUser));
                    renderRankingTable();
                }
            } catch (error) {

            }
        }
        fetchData();

    }, [listUserDescending.length]);

    function compareUser(a, b) {
        return b.cup - a.cup;
    }


    function renderItemUserDescending(user, index) {
        return (
            <tr onClick={() => displayUserInfoDialog(user._id)}>
                <td class="rank">{index + 1}</td>
                <td class="team">{user.displayname}</td>
                <td class="points">{user.total_match}</td>
                <td class="up-down">{user.win_match}</td>
                <td class="up-down">{user.win_percent}</td>
                <td class="points">{user.cup}</td>
            </tr>
        )
    }

    function renderRankingTable() {
        let result = [];
        listUserDescending.map((user, index) => {
            result.push(renderItemUserDescending(user, index));
        });
        setRankingTable(result);
    }

    async function displayUserInfoDialog(iduser) {
        await dispatch(fetchUserInfoDialog({iduser: iduser}));
    }

    return (
        <div class="container">
            <header>
                <h1 style={{color: 'green'}}>Caro World Ranking</h1>
            </header>
            <div class="wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Display name</th>
                            <th>Played</th>
                            <th>Won</th>
                            <th>Win percent</th>
                            <th>Cup</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        {rankingTable}
                        
                        
                    </tbody>
                </table>
            </div>
        </div>
    )
}