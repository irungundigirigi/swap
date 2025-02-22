import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  fetchItems: false,
  loading: false,
  error: null,
};

const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    reload: (state, action) => {
        state.fetchItems = !state.fetchItems},
    setItems: (state, action) => {
        state.items = action.payload;
    },
    flipLoading: (state, action) => {
      state.loading = action.payload
    },
  },
});

export const { reload,setItems, flipLoading } = itemsSlice.actions;
export default itemsSlice.reducer;