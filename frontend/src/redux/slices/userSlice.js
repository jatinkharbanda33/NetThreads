import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  initialState:  localStorage.getItem("authToken")|| "",
  name: 'user',
  reducers: {
    changeUser: (state,action) =>{
        return action.payload;
    }
  }
});

export const { changeUser } = userSlice.actions;

export default userSlice.reducer;
