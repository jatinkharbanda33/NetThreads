import { createSlice } from "@reduxjs/toolkit"; 

export const authSlice=createSlice({
    initialState:"login",
    name:'auth',
    reducers:{
        changeAuth:(state,action)=>{
           return action.payload;
        }
    }
});
export const { changeAuth } = authSlice.actions;

export default authSlice.reducer;