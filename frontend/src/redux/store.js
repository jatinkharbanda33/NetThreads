import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import authReducer from "./slices/authSlice";
import postReducer from "./slices/postSlice";
export const store=configureStore({
    reducer:{
        user:userReducer,
        auth:authReducer,
        post:postReducer,
    }, 
});