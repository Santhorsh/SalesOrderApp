import { configureStore } from "@reduxjs/toolkit";
import customersReducer from "./slices/customersSlice";
import itemsReducer from "./slices/itemsSlice";
import ordersReducer from "./slices/ordersSlice";

export const store = configureStore({
  reducer: {
    customers: customersReducer,
    items: itemsReducer,
    orders: ordersReducer,
  },
});
