import {
    createSlice,
    createAsyncThunk,
    createSelector,
    createEntityAdapter,
} from '@reduxjs/toolkit';
import axios from "../../utils/axios";

const userInfoDialogAdapter = createEntityAdapter();

const initialState = [{
    isOpen: false,
    idUser: "",
    displayName: "",
    statistic: "",
    cup: 0,
    avatar: null
}];

export const fetchUserInfoDialog = createAsyncThunk(
    'userInfoDialog/fetchUserInfoDialog',
    async (initialUserInfoDialog) => {
        const response = await axios.get("api/users/id/" + initialUserInfoDialog.iduser);
        
        return response.data.data.user;

    } 
)

const userInfoDialogSlice = createSlice({
    name: 'userInfoDialog',
    initialState,
    reducers: {
        closeUserInfoDialog(state) {
            state[0].isOpen = false;
        }
        // userInfoDialogUpdate(state, action) {
        //     const { displayName, totalMatch, winMatch, winPercent, cup } = action.payload;
        //     state[0].displayName = displayName;
        //     state[0].totalMatch = totalMatch;
        //     state[0].winMatch = winMatch;
        //     state[0].winPercent = winPercent;
        //     state[0].cup = cup;
        //     //userInfoDialogAdapter.upsertOne(state, action.payload);
        // }
    },
    extraReducers: {
        [fetchUserInfoDialog.fulfilled]: (state, action) => {
            const user = action.payload;
            state[0] = {
                isOpen: true,
                idUser: user._id, 
                displayName: user.displayname,
                statistic: "Đã chơi " + user.total_match + ", thắng " + user.win_match + ", tỉ lệ " + user.win_percent + "%",
                cup: user.cup,
                joinDate: user.join_date,
                avatar: user.avatar
            }
        }
    }
});

// function getFormattedDate(date) {
//     var year = date.getFullYear();
  
//     var month = (1 + date.getMonth()).toString();
//     month = month.length > 1 ? month : '0' + month;
  
//     var day = date.getDate().toString();
//     day = day.length > 1 ? day : '0' + day;
    
//     return day + '/' + month + '/' + year;
//   }

//export const {userInfoDialogUpdate} = userInfoDialogSlice.actions;
export const { closeUserInfoDialog } = userInfoDialogSlice.actions;
export default userInfoDialogSlice.reducer;

export const selectUserInfoDialog = (state) => state.userInfoDialog[0];
// export const {
//     selectAll: selectAllUserInfoDialog,
// } = userInfoDialogAdapter.getSelectors((state) => state.userInfoDialog);