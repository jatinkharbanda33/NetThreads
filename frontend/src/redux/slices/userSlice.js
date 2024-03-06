import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  initialState: null,
  name: 'user',
  reducers: {
    changeUser: (state,action) =>{
        return action.payload;
    }
  }
});

export const { changeUser } = userSlice.actions;

export default userSlice.reducer;
