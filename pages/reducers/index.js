import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./userReducers";

export const rootStore = configureStore({
    // untuk mengelompokkan seluruh reducer yang dibuat
    reducer: {
        userReducer
    }
})