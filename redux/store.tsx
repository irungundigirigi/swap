import { configureStore } from "@reduxjs/toolkit";
import listingsReducer from "./slices/listingsSlice";
import notificationReducer from "./slices/notificationSlice";
import itemsReducer from "./slices/itemsSlice";
import userReducer from "./slices/userSlice"
import loaderReducer from "./slices/loadingSlice"




export const store = configureStore({
  reducer: {
    user: userReducer,
    listings: listingsReducer,
    loader: loaderReducer,
    items:itemsReducer,
    notification: notificationReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
