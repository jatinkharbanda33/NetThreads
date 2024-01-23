import { createSlice } from "@reduxjs/toolkit"; 

export const postSlice=createSlice({
    initialState:[],
    name:'post',
    reducers:{
        changePost:(state,action)=>{
           return action.payload;
        }
    }
});
export const { changePost } = postSlice.actions;

export default postSlice.reducer;