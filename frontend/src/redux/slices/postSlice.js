import { createSlice } from '@reduxjs/toolkit';

export const postSlice = createSlice({
  initialState: [],
  name: 'post',
  reducers: {
    changePost: (state, action) => {
      return action.payload;
    },
    updatePost: (state, action) => {
      const updatedPost = action.payload;
      const index = state.findIndex(post => post._id === updatedPost._id);
      if (index !== -1) {
        state[index] = updatedPost;
      }
    }
  }
});

export const { changePost, updatePost } = postSlice.actions;

export default postSlice.reducer;