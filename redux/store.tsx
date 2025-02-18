import { configureStore } from "@reduxjs/toolkit";
import listingsReducer from "./slices/listingsSlice";
import notificationReducer from "./slices/notificationSlice";
import itemsReducer from "./slices/itemsSlice";




export const store = configureStore({
  reducer: {
    listings: listingsReducer,
    items:itemsReducer,
    notification: notificationReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
