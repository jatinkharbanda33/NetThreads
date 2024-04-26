import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  initialState: null,
  name: 'user',
  reducers: {
    changeUser: (state,action) =>{
        return action.payload;
    },
    changeName:(state,action)=>{
      return {...state,name:action.payload};
    },
    changeUsername:(state,action)=>{
      return {...state,username:action.payload};
    }
  }
});

export const { changeUser,changeName,changeUsername } = userSlice.actions;

export default userSlice.reducer;
