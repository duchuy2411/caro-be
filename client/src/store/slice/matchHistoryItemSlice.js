import {
    createSlice,
    createAsyncThunk,
    createSelector,
    createEntityAdapter,
} from '@reduxjs/toolkit'
import axios from "../../utils/axios";

const initialState = [{
    step: [{
        squares: [],
        message: ""
    }],
    win: null,
    size: 20,
    id_board: "",
    id_match: "",
    id_user1: "",
    id_user2: "",
    displayname_user1: "",
    displayname_user2: "",
    createdAt: null
}];

const matchHistoryItemSlice = createSlice({
    name: 'matchHistoryItem',
    initialState,
    reducers: {
        matchHistoryItemUpdated(state, action) {
            const { matchHistoryItem } = action.payload;
            state[0] = {
                step: matchHistoryItem.step,
                displayname_win: matchHistoryItem.displayname_win,
                size: matchHistoryItem.size,
                id_board: matchHistoryItem.id_board,
                id_match: matchHistoryItem._id,
                id_user1: matchHistoryItem.id_user1,
                id_user2: matchHistoryItem.id_user2,
                displayname_user1: matchHistoryItem.displayname_user1,
                displayname_user2: matchHistoryItem.displayname_user2,
                createdAt: matchHistoryItem.createdAt
            }
        }
    }   
});

export const { matchHistoryItemUpdated } = matchHistoryItemSlice.actions
export default matchHistoryItemSlice.reducer;

export const selectMatchHistoryItem = (state) =>  state.matchHistoryItem[0];