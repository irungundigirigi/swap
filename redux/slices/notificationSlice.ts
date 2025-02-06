import { createSlice } from "@reduxjs/toolkit";

const initialState = { message: "Welcome to Swaps!", type: "success", duration: 3000 }
 
;

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotification: (state, action) => {
        state.notification = action.payload
    },
    clearNotification: (state, action) => {
        state.notification = {};
    }
  },
});

export const { setNotification, clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
