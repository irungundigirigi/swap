// redux/slices/loaderSlice.js
import { createSlice } from '@reduxjs/toolkit';

const loaderSlice = createSlice({
  name: 'loader',
  initialState: {
    loading: false,
    message: '', // Optional: to show context like "Fetching items"
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setLoadingMessage: (state, action) => {
      state.message = action.payload;
    }
  }
});

export const { setLoading, setLoadingMessage } = loaderSlice.actions;
export default loaderSlice.reducer;
