import React, { useState, useRef, useEffect } from "react";

function calcAmounts(quantity, price, taxRate) {
  const qty = Number(quantity) || 0;
  const p = Number(price) || 0;
  const rate = Number(taxRate) || 0;
  const exclAmount = Math.round(qty * p * 100) / 100;
  const taxAmount = Math.round(exclAmount * (rate / 100) * 100) / 100;
  const inclAmount = Math.round((exclAmount + taxAmount) * 100) / 100;
  return { exclAmount, taxAmount, inclAmount };
}

export default function OrderLineTable({ lines, items, onChange }) {
  const [showSuggestions, setShowSuggestions] = useState({});
  const suggestionRefs = useRef({});

  const updateLine = (index, patch) => {
    const updated = [...lines];
    const line = { ...updated[index], ...patch };
    const amounts = calcAmounts(line.quantity, line.price, line.taxRate);
    updated[index] = { ...line, ...amounts };
    onChange(updated);
  };

  const handleItemCodeChange = (index, value) => {
    updateLine(index, { itemCode: value });
    
    // Auto-fill description and price if exact match found
    if (value && value.trim()) {
      const exactMatch = items.find(i => 
        i.code.toLowerCase() === value.toLowerCase().trim()
      );
      if (exactMatch) {
        updateLine(index, { 
          itemCode: exactMatch.code,
          description: exactMatch.description,
          price: exactMatch.price || 0
        });
        setShowSuggestions(prev => ({ ...prev, [index]: false }));
        return;
      }
    }
    
    // Show suggestions if there's a partial match
    const hasMatches = items.some(i => 
      i.code.toLowerCase().includes(value.toLowerCase().trim())
    );
    if (value && value.trim() && hasMatches) {
      setShowSuggestions(prev => ({ ...prev, [index]: true }));
    } else {
      setShowSuggestions(prev => ({ ...prev, [index]: false }));
    }
  };

  const handleDescriptionChange = (index, value) => {
    updateLine(index, { description: value });
  };

  const selectSuggestion = (index, item) => {
    updateLine(index, {
      itemCode: item.code,
      description: item.description,
      price: item.price || 0
    });
    setShowSuggestions(prev => ({ ...prev, [index]: false }));
  };

  const addLine = () => {
    onChange([
      ...lines,
      {
        itemId: "",
        itemCode: "",
        description: "",
        note: "",
        quantity: 0,
        price: 0,
        taxRate: 0,
        exclAmount: 0,
        taxAmount: 0,
        inclAmount: 0,
      },
    ]);
  };

  const removeLine = (index) => {
    onChange(lines.filter((_, i) => i !== index));
  };

  const getFilteredSuggestions = (searchTerm) => {
    if (!searchTerm || !searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase().trim();
    return items
      .filter(item => 
        item.code.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term)
      )
      .slice(0, 10);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside all suggestion containers
      let isOutside = true;
      Object.keys(suggestionRefs.current).forEach(key => {
        const ref = suggestionRefs.current[key];
        if (ref && ref.contains && ref.contains(event.target)) {
          isOutside = false;
        }
      });
      if (isOutside) {
        setShowSuggestions({});
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="overflow-x-auto rounded-md border border-gray-300">
      <div className="bg-blue-50 px-3 py-2 border-b border-gray-300 flex justify-between items-center">
        <span className="text-sm text-gray-700">
          <span className="font-semibold">Manual Entry Mode</span> - Type item code or description
        </span>
        <span className="text-xs text-gray-500">
          {lines.length} item{lines.length !== 1 ? 's' : ''}
        </span>
      </div>

      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-2 py-2 text-left font-semibold text-gray-800 w-32">Item Code</th>
            <th className="px-2 py-2 text-left font-semibold text-gray-800">Description</th>
            <th className="px-2 py-2 text-left font-semibold text-gray-800">Note</th>
            <th className="px-2 py-2 text-left font-semibold text-gray-800 w-20">Qty</th>
            <th className="px-2 py-2 text-left font-semibold text-gray-800 w-24">Price</th>
            <th className="px-2 py-2 text-left font-semibold text-gray-800 w-20">Tax %</th>
            <th className="px-2 py-2 text-right font-semibold text-gray-800 w-24">Excl Amt</th>
            <th className="px-2 py-2 text-right font-semibold text-gray-800 w-24">Tax Amt</th>
            <th className="px-2 py-2 text-right font-semibold text-gray-800 w-24">Incl Amt</th>
            <th className="px-2 py-2 w-10"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {lines.map((line, index) => {
            const suggestions = getFilteredSuggestions(line.itemCode);
            const showSuggestion = showSuggestions[index] && suggestions.length > 0;

            return (
              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-2 py-1 relative">
                  <div 
                    ref={el => suggestionRefs.current[index] = el}
                    className="relative"
                  >
                    <input
                      type="text"
                      className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={line.itemCode}
                      onChange={(e) => handleItemCodeChange(index, e.target.value)}
                      placeholder="Type code..."
                      autoComplete="off"
                    />
                    {showSuggestion && (
                      <div className="absolute z-20 left-0 top-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg w-full max-h-48 overflow-auto">
                        {suggestions.map((item) => (
                          <div
                            key={item.id}
                            className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm border-b border-gray-100 last:border-0"
                            onClick={() => selectSuggestion(index, item)}
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            <div className="font-medium text-gray-800">{item.code}</div>
                            <div className="text-xs text-gray-500">{item.description}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-2 py-1">
                  <input
                    type="text"
                    className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={line.description}
                    onChange={(e) => handleDescriptionChange(index, e.target.value)}
                    placeholder="Enter description"
                  />
                </td>
                <td className="px-2 py-1">
                  <input
                    type="text"
                    className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={line.note}
                    onChange={(e) => updateLine(index, { note: e.target.value })}
                    placeholder="Note"
                  />
                </td>
                <td className="px-2 py-1">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full rounded border border-gray-300 px-2 py-1 text-sm text-right focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={line.quantity}
                    onChange={(e) => updateLine(index, { quantity: e.target.value })}
                    placeholder="0"
                  />
                </td>
                <td className="px-2 py-1">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full rounded border border-gray-300 px-2 py-1 text-sm text-right focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={line.price}
                    onChange={(e) => updateLine(index, { price: e.target.value })}
                    placeholder="0.00"
                  />
                </td>
                <td className="px-2 py-1">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full rounded border border-gray-300 px-2 py-1 text-sm text-right focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={line.taxRate}
                    onChange={(e) => updateLine(index, { taxRate: e.target.value })}
                    placeholder="0"
                  />
                </td>
                <td className="px-2 py-1 text-gray-700 text-right font-medium">
                  {line.exclAmount.toFixed(2)}
                </td>
                <td className="px-2 py-1 text-gray-700 text-right font-medium">
                  {line.taxAmount.toFixed(2)}
                </td>
                <td className="px-2 py-1 text-gray-700 text-right font-medium">
                  {line.inclAmount.toFixed(2)}
                </td>
                <td className="px-2 py-1 text-center">
                  <button
                    onClick={() => removeLine(index)}
                    className="text-red-500 hover:text-red-700 font-bold text-lg leading-none focus:outline-none hover:bg-red-50 rounded-full w-6 h-6 flex items-center justify-center"
                    title="Remove line"
                  >
                    ×
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      <div className="flex items-center justify-between p-3 border-t border-gray-200 bg-gray-50">
        <button
          onClick={addLine}
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <span className="mr-1 text-lg">+</span> Add Item
        </button>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span>💡 Type to search existing items or enter new ones</span>
        </div>
      </div>
    </div>
  );
}