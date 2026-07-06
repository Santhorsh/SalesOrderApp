import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SalesOrderPage from "./pages/SalesOrderPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/sales-order" element={<SalesOrderPage />} />
      <Route path="/sales-order/:id" element={<SalesOrderPage />} />
    </Routes>
  );
}
