import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  initialState: null,
  name: 'user',
  reducers: {
    changeUser: (state,action) =>{
        return action.payload;
    },
    changeName:(state,action)=>{
      return {...state,name:action.payload.name};
    },
    changeUsername:(state,action)=>{
      console.log("Hello");
      return {...state,username:action.payload.username};
    }
  }
});

export const { changeUser,changeName,changeUsername } = userSlice.actions;

export default userSlice.reducer;
