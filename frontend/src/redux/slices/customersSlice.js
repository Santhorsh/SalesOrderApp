import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { clientsApi } from "../../services/api";

export const fetchCustomers = createAsyncThunk("customers/fetchAll", async () => {
  const res = await clientsApi.getAll();
  return res.data;
});

const customersSlice = createSlice({
  name: "customers",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default customersSlice.reducer;
