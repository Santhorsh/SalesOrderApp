import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { salesOrdersApi } from "../../services/api";

export const fetchOrders = createAsyncThunk("orders/fetchAll", async () => {
  const res = await salesOrdersApi.getAll();
  return res.data;
});

export const fetchOrderById = createAsyncThunk("orders/fetchById", async (id) => {
  const res = await salesOrdersApi.getById(id);
  return res.data;
});

export const createOrder = createAsyncThunk("orders/create", async (payload) => {
  const res = await salesOrdersApi.create(payload);
  return res.data;
});

export const updateOrder = createAsyncThunk("orders/update", async ({ id, payload }) => {
  const res = await salesOrdersApi.update(id, payload);
  return res.data;
});

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    list: [],
    current: null,
    status: "idle",
    saveStatus: "idle",
    error: null,
  },
  reducers: {
    clearCurrentOrder: (state) => {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(createOrder.pending, (state) => {
        state.saveStatus = "saving";
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.saveStatus = "succeeded";
        state.current = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.saveStatus = "failed";
        state.error = action.error.message;
      })
      .addCase(updateOrder.pending, (state) => {
        state.saveStatus = "saving";
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.saveStatus = "succeeded";
        state.current = action.payload;
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.saveStatus = "failed";
        state.error = action.error.message;
      });
  },
});

export const { clearCurrentOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
