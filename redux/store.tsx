import { configureStore } from "@reduxjs/toolkit";
import listingsReducer from "./slices/listingsSlice";
import notificationReducer from "./slices/notificationSlice";




export const store = configureStore({
  reducer: {
    listings: listingsReducer,
    notification: notificationReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
