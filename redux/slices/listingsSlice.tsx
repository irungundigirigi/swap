import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listings: [],
  loading: false,
  error: null,
};

const listingsSlice = createSlice({
  name: "listings",
  initialState,
  reducers: {
    setItems: (state, action) => {
        state.listings = action.payload;}
  },
});

export const { setItems } = listingsSlice.actions;
export default listingsSlice.reducer;
