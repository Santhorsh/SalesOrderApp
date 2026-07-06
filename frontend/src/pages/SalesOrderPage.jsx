import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCustomers } from "../redux/slices/customersSlice";
import { fetchItems } from "../redux/slices/itemsSlice";
import {
  fetchOrderById,
  createOrder,
  updateOrder,
  clearCurrentOrder,
} from "../redux/slices/ordersSlice";
import OrderLineTable from "../components/OrderLineTable";

const emptyAddress = {
  address1: "",
  address2: "",
  address3: "",
  suburb: "",
  state: "",
  postCode: "",
};

export default function SalesOrderPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: customers } = useSelector((state) => state.customers);
  const { items: catalogItems } = useSelector((state) => state.items);
  const { current, saveStatus } = useSelector((state) => state.orders);

  const [clientName, setClientName] = useState("");
  const [clientId, setClientId] = useState(null);
  const [address, setAddress] = useState(emptyAddress);
  const [invoiceNo, setInvoiceNo] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [referenceNo, setReferenceNo] = useState("");
  const [note, setNote] = useState("");
  const [lines, setLines] = useState([]);

  useEffect(() => {
    dispatch(fetchCustomers());
    dispatch(fetchItems());
    if (isEdit) {
      dispatch(fetchOrderById(id));
    } else {
      dispatch(clearCurrentOrder());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // When editing, populate form once the order + customers are loaded
  useEffect(() => {
    if (isEdit && current && current.id === Number(id)) {
      // Find the customer name from the clientId
      const client = customers.find(c => c.id === current.clientId);
      setClientName(client ? client.name : "");
      setClientId(current.clientId);
      setInvoiceNo(current.invoiceNo);
      setInvoiceDate(current.invoiceDate?.slice(0, 10) || "");
      setReferenceNo(current.referenceNo || "");
      setNote(current.note || "");
      setLines(
        current.lines.map((l) => ({
          id: l.id,
          itemId: l.itemId,
          itemCode: l.itemCode,
          description: l.description,
          note: l.note || "",
          quantity: l.quantity,
          price: l.price,
          taxRate: l.taxRate,
          exclAmount: l.exclAmount,
          taxAmount: l.taxAmount,
          inclAmount: l.inclAmount,
        }))
      );
    }
  }, [current, isEdit, id, customers]);

  // Auto-fill address when a customer name matches an existing customer
  useEffect(() => {
    if (!clientName.trim()) {
      setAddress(emptyAddress);
      setClientId(null);
      return;
    }

    // Find customer by name (case-insensitive)
    const matchedCustomer = customers.find(
      (c) => c.name.toLowerCase() === clientName.toLowerCase().trim()
    );

    if (matchedCustomer) {
      setClientId(matchedCustomer.id);
      setAddress({
        address1: matchedCustomer.address1 || "",
        address2: matchedCustomer.address2 || "",
        address3: matchedCustomer.address3 || "",
        suburb: matchedCustomer.suburb || "",
        state: matchedCustomer.state || "",
        postCode: matchedCustomer.postCode || "",
      });
    } else {
      // If no match, keep the address as is (user might be typing a new customer)
      setClientId(null);
    }
  }, [clientName, customers]);

  const totals = useMemo(() => {
    return lines.reduce(
      (acc, l) => {
        acc.excl += Number(l.exclAmount) || 0;
        acc.tax += Number(l.taxAmount) || 0;
        acc.incl += Number(l.inclAmount) || 0;
        return acc;
      },
      { excl: 0, tax: 0, incl: 0 }
    );
  }, [lines]);

  const handleSave = async () => {
    if (!clientName.trim()) {
      alert("Please enter a customer name.");
      return;
    }

    // Validate lines
    const invalidLines = lines.filter(l => !l.itemCode && !l.description);
    if (invalidLines.length > 0) {
      alert("Please fill in item code and description for all lines.");
      return;
    }

    const payload = {
      invoiceNo,
      invoiceDate: new Date(invoiceDate).toISOString(),
      referenceNo,
      note,
      clientName: clientName.trim(),
      clientId: clientId || null, // Will be null if customer doesn't exist in database
      address: address, // Save the address with the order
      lines: lines
        .filter((l) => l.itemCode || l.description)
        .map((l) => ({
          id: l.id,
          itemId: Number(l.itemId) || 0,
          itemCode: l.itemCode || "",
          description: l.description || "",
          note: l.note || "",
          quantity: Number(l.quantity) || 0,
          price: Number(l.price) || 0,
          taxRate: Number(l.taxRate) || 0,
        })),
    };

    let result;
    if (isEdit) {
      result = await dispatch(updateOrder({ id, payload }));
    } else {
      result = await dispatch(createOrder(payload));
    }

    if (!result.error) {
      navigate("/");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl rounded-lg border border-gray-300 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-300 bg-gray-50 px-4 py-3">
          <h1 className="text-lg font-semibold text-gray-700">Sales Order</h1>
        </div>

        <div className="border-b border-gray-300 px-4 py-3">
          <button
            onClick={handleSave}
            disabled={saveStatus === "saving"}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {saveStatus === "saving" ? "Saving..." : "Save Order"}
          </button>
          <button
            onClick={handlePrint}
            className="ml-2 rounded-md border border-gray-400 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Print
          </button>
          <button
            onClick={() => navigate("/")}
            className="ml-2 rounded-md border border-gray-400 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Back to Home
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 p-4 md:grid-cols-2">
          {/* Left column: customer + address */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <label className="w-32 text-sm font-medium text-gray-700">Customer Name</label>
              <div className="flex-1 relative">
                <input
                  type="text"
                  className="w-full rounded border border-gray-300 px-2 py-1"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Type customer name"
                  autoComplete="off"
                />
                {clientName && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-48 overflow-auto">
                    {customers
                      .filter(c => 
                        c.name.toLowerCase().includes(clientName.toLowerCase().trim())
                      )
                      .slice(0, 10)
                      .map((c) => (
                        <div
                          key={c.id}
                          className="px-3 py-1 hover:bg-gray-100 cursor-pointer text-sm"
                          onClick={() => {
                            setClientName(c.name);
                            setClientId(c.id);
                            setAddress({
                              address1: c.address1 || "",
                              address2: c.address2 || "",
                              address3: c.address3 || "",
                              suburb: c.suburb || "",
                              state: c.state || "",
                              postCode: c.postCode || "",
                            });
                          }}
                        >
                          {c.name}
                        </div>
                      ))}
                    {customers.filter(c => 
                      c.name.toLowerCase().includes(clientName.toLowerCase().trim())
                    ).length === 0 && (
                      <div className="px-3 py-1 text-sm text-gray-500 italic">
                        New customer (will be created)
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {[
              ["Address 1", "address1"],
              ["Address 2", "address2"],
              ["Address 3", "address3"],
              ["Suburb", "suburb"],
              ["State", "state"],
              ["Post Code", "postCode"],
            ].map(([label, key]) => (
              <div className="flex items-center gap-2" key={key}>
                <label className="w-32 text-sm font-medium text-gray-700">{label}</label>
                <input
                  type="text"
                  className="flex-1 rounded border border-gray-300 px-2 py-1"
                  value={address[key]}
                  onChange={(e) => setAddress({ ...address, [key]: e.target.value })}
                />
              </div>
            ))}
          </div>

          {/* Right column: invoice details + note */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <label className="w-32 text-sm font-medium text-gray-700">Invoice No.</label>
              <input
                type="text"
                className="flex-1 rounded border border-gray-300 px-2 py-1"
                value={invoiceNo}
                onChange={(e) => setInvoiceNo(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="w-32 text-sm font-medium text-gray-700">Invoice Date</label>
              <input
                type="date"
                className="flex-1 rounded border border-gray-300 px-2 py-1"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="w-32 text-sm font-medium text-gray-700">Reference No</label>
              <input
                type="text"
                className="flex-1 rounded border border-gray-300 px-2 py-1"
                value={referenceNo}
                onChange={(e) => setReferenceNo(e.target.value)}
              />
            </div>
            <div className="flex items-start gap-2">
              <label className="w-32 pt-1 text-sm font-medium text-gray-700">Note</label>
              <textarea
                rows={5}
                className="flex-1 rounded border border-gray-300 px-2 py-1"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Item lines */}
        <div className="px-4 pb-4">
          <OrderLineTable lines={lines} items={catalogItems} onChange={setLines} />
        </div>

        {/* Totals */}
        <div className="flex justify-end px-4 pb-6">
          <div className="w-64 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <label className="text-sm font-medium text-gray-700">Total Excl</label>
              <input
                readOnly
                className="w-32 rounded border border-gray-300 bg-gray-50 px-2 py-1 text-right"
                value={totals.excl.toFixed(2)}
              />
            </div>
            <div className="flex items-center justify-between gap-2">
              <label className="text-sm font-medium text-gray-700">Total Tax</label>
              <input
                readOnly
                className="w-32 rounded border border-gray-300 bg-gray-50 px-2 py-1 text-right"
                value={totals.tax.toFixed(2)}
              />
            </div>
            <div className="flex items-center justify-between gap-2">
              <label className="text-sm font-medium text-gray-700">Total Incl</label>
              <input
                readOnly
                className="w-32 rounded border border-gray-300 bg-gray-50 px-2 py-1 text-right"
                value={totals.incl.toFixed(2)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}