import {
    createSlice,
    createAsyncThunk,
    createSelector,
    createEntityAdapter,
} from '@reduxjs/toolkit';

import axios from "../../utils/axios";

const onlineUsersAdapter = createEntityAdapter({
    selectId: (user) => user._id
});

const initialState = [true];

const onlineUserSlice = createSlice({
    name: 'onlineUsers',
    initialState,
    reducers: {
        onlineUserUpdated(state, action) {
            const { listOnlineUser } = action.payload;
            while (state.length > 1) {
                state.pop();
            }
            listOnlineUser.map((item) => {
                state.push(item);
            })
        },
        closeOnlineUserList(state) {
            state[0] = false;
        },
        openOnlineUserList(state) {
            state[0] = true;
        }
    }
    
});

export const { onlineUserUpdated, openOnlineUserList, closeOnlineUserList } = onlineUserSlice.actions
export default onlineUserSlice.reducer;

export const selectOnlineUser = (state) =>  state.onlineUsers.slice(1);
export const selectOpenOnlineUserList = (state) => state.onlineUsers[0];