import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchOrders } from "../redux/slices/ordersSlice";

const columns = [
  { key: "invoiceNo", label: "Invoice No" },
  { key: "invoiceDate", label: "Invoice Date" },
  { key: "clientName", label: "Customer" },
  { key: "referenceNo", label: "Reference No" },
  { key: "totalExcl", label: "Total Excl" },
  { key: "totalTax", label: "Total Tax" },
  { key: "totalIncl", label: "Total Incl" },
];

function formatValue(key, value) {
  if (value == null) return "";
  if (key === "invoiceDate") return new Date(value).toLocaleDateString();
  if (["totalExcl", "totalTax", "totalIncl"].includes(key)) {
    return Number(value).toFixed(2);
  }
  return value;
}

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, status } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl rounded-lg border border-gray-300 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-300 bg-gray-50 px-4 py-3">
          <h1 className="text-lg font-semibold text-gray-700">Home</h1>
        </div>

        <div className="p-4">
          <button
            onClick={() => navigate("/sales-order")}
            className="mb-4 rounded-md border border-gray-400 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Add New
          </button>

          <div className="overflow-x-auto rounded-md border border-gray-300">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-300">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className="px-3 py-2 text-left font-semibold text-gray-800"
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {status === "loading" && (
                  <tr>
                    <td colSpan={columns.length} className="px-3 py-4 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                )}
                {status === "succeeded" && list.length === 0 && (
                  <tr>
                    <td colSpan={columns.length} className="px-3 py-4 text-center text-gray-500">
                      No orders yet. Click "Add New" to create one.
                    </td>
                  </tr>
                )}
                {list.map((order, idx) => (
                  <tr
                    key={order.id}
                    onDoubleClick={() => navigate(`/sales-order/${order.id}`)}
                    className={`cursor-pointer hover:bg-blue-50 ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                    title="Double-click to open"
                  >
                    {columns.map((col) => (
                      <td key={col.key} className="px-3 py-2 text-gray-700">
                        {formatValue(col.key, order[col.key])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}