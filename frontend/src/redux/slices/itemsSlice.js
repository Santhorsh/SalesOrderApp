import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { itemsApi } from "../../services/api";

export const fetchItems = createAsyncThunk("items/fetchAll", async () => {
  const res = await itemsApi.getAll();
  return res.data;
});

const itemsSlice = createSlice({
  name: "items",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default itemsSlice.reducer;
