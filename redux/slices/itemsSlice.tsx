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
        !state.reloadItems},
    setItems: (state, action) => {
        state.items = action.payload;
    }
  },
});

export const { reload,setItems } = itemsSlice.actions;
export default itemsSlice.reducer;