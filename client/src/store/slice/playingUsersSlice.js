import {
    createSlice,
    createAsyncThunk,
    createSelector,
    createEntityAdapter,
} from '@reduxjs/toolkit';

import axios from '../../utils/axios';

const initialState = [false, null, null];

export const updateHostStatistic = createAsyncThunk('boards/updateHostStatistic', async (iduser1) => {
    const api_user1 = await axios.get('api/users/id/' + iduser1);
    return api_user1.data.data.user;
})

export const updateGuestStatistic = createAsyncThunk('boards/updateGuestStatistic', async (iduser2) => {
    const api_user2 = await axios.get('api/users/id/' + iduser2);
    console.log("update 1: " + api_user2.data.data.user);
    return api_user2.data.data.user;
})

const playingUserSlice = createSlice({
    name: 'playingUsers',
    initialState,
    reducers: {
        addHost(state, action) {
            state[1] = action.payload.hostUser;
            state[0] = !state[0];
        },
        addGuest(state, action) {
            state[2] = action.payload.guestUser;
            state[0] = !state[0];
        },
        addHostAndGuest(state, action) {
            state[1] = action.payload.hostUser;
            state[2] = action.payload.guestUser;
            state[0] = !state[0];
        },
        delGuest(state) {
            state[2] = null;
            state[0] = !state[0];
        }
    },
    extraReducers: {
        [updateHostStatistic.fulfilled]: (state, action) => {
            const user1 = action.payload;
            if (user1 && state[1]) {
                state[1].cup = user1.cup;
                state[1].win_percent = user1.win_percent;  
                state[0] = !state[0];  
            }
        },
        [updateGuestStatistic.fulfilled]: (state, action) => {
            const user2 = action.payload;
            console.log("update 2: " + user2);
            if (user2 && state[2]) {
                state[2].cup = user2.cup;
                state[2].win_percent = user2.win_percent;
                state[0] = !state[0];
            }
        }
    }
});

export const { addHost, addGuest, delGuest, addHostAndGuest } = playingUserSlice.actions
export default playingUserSlice.reducer;

export const selectPlayingUser = (state) =>  state.playingUsers.slice(1);
export const selectRerender = (state) => state.playingUsers[0];