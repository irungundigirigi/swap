import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  reloadItems: false,
  loading: false,
  error: null,
};

const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    reload: (state, action) => {
        !state.reloadItems}
  },
});

export const { reload } = itemsSlice.actions;
export default itemsSlice.reducer;