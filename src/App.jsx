import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  Trash2,
  Calculator,
  DollarSign,
  Calendar,
} from "lucide-react";
import "./App.css";
import "./index.css"; // Ensure CSS is imported here

const App = () => {
  // Load initial state from localStorage or set default values
  const storedItems = JSON.parse(localStorage.getItem("items")) || [
    { id: 1, name: "Advan WorkPlus", price: 7800000 },
    { id: 2, name: "Rinjani Mountain", price: 5000000 },
  ];
  const storedIncome = localStorage.getItem("income") || "";
  const storedSavingPercentage = localStorage.getItem("savingPercentage") || 20;
  const storedTimeUnit = localStorage.getItem("timeUnit") || "day";

  const [items, setItems] = useState(storedItems);
  const [newItem, setNewItem] = useState({ name: "", price: "" });
  const [income, setIncome] = useState(storedIncome);
  const [savingPercentage, setSavingPercentage] = useState(
    storedSavingPercentage
  );
  const [timeUnit, setTimeUnit] = useState(storedTimeUnit);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
    localStorage.setItem("income", income);
    localStorage.setItem("savingPercentage", savingPercentage);
    localStorage.setItem("timeUnit", timeUnit);
  }, [items, income, savingPercentage, timeUnit]);

  const addItem = () => {
    if (newItem.name && newItem.price) {
      setItems([...items, { ...newItem, id: Date.now() }]);
      setNewItem({ name: "", price: "" });
    }
  };

  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const totalTarget = items.reduce((sum, item) => sum + Number(item.price), 0);

  // Adjust daily saving based on selected time unit (Day, Week, Month, Year)
  let savingsPerUnit;
  if (timeUnit === "day") {
    savingsPerUnit = income
      ? (Number(income) * (savingPercentage / 100)) / 30
      : 0;
  } else if (timeUnit === "week") {
    savingsPerUnit = income
      ? (Number(income) * (savingPercentage / 100)) / 4
      : 0; // 4 weeks in a month
  } else if (timeUnit === "month") {
    savingsPerUnit = income ? Number(income) * (savingPercentage / 100) : 0;
  } else if (timeUnit === "year") {
    savingsPerUnit = income
      ? Number(income) * (savingPercentage / 100) * 12
      : 0;
  }

  // Calculate how much time it takes to reach the total target based on the selected unit
  let timeToTarget = 0;
  if (savingsPerUnit > 0) {
    if (timeUnit === "day") {
      timeToTarget = Math.ceil(totalTarget / savingsPerUnit);
    } else if (timeUnit === "week") {
      timeToTarget = Math.ceil(totalTarget / savingsPerUnit);
    } else if (timeUnit === "month") {
      timeToTarget = Math.ceil(totalTarget / savingsPerUnit);
    } else if (timeUnit === "year") {
      timeToTarget = Math.ceil(totalTarget / savingsPerUnit);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">
          Budget Planning Calculator
        </h2>

        {/* Example Income Buttons */}
        <div className="flex gap-4 mb-6 justify-center">
          <button
            onClick={() => setIncome(1000000)}
            className="p-2 bg-gray-300 rounded-lg hover:bg-gray-400 text-black transition-colors"
          >
            1jt
          </button>
          <button
            onClick={() => setIncome(5000000)}
            className="p-2 bg-gray-300 rounded-lg hover:bg-gray-400 text-black transition-colors"
          >
            5jt
          </button>
          <button
            onClick={() => setIncome(20000000)}
            className="p-2 bg-gray-300 rounded-lg hover:bg-gray-400 text-black transition-colors"
          >
            20jt
          </button>
        </div>

        {/* Income Input Section */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-4">
            <DollarSign className="text-blue-600" />
            <input
              type="number"
              placeholder="Masukkan Penghasilan per Bulan"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              className="flex-1 p-2 bg-white dark:text-black border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Persentase Menabung:</span>
            <input
              type="range"
              min="1"
              max="100"
              value={savingPercentage}
              onChange={(e) => setSavingPercentage(e.target.value)}
              className="flex-1"
            />
            <span className="text-sm font-medium text-blue-600">
              {savingPercentage}%
            </span>
          </div>

          {/* Time Unit Select */}
          <div className="flex items-center gap-4 mt-4">
            <span className="text-sm text-gray-600">Waktu per:</span>
            <select
              value={timeUnit}
              onChange={(e) => setTimeUnit(e.target.value)}
              className="p-2 bg-white text-zinc-800 border rounded-lg"
            >
              <option value="day">Hari</option>
              <option value="week">Minggu</option>
              <option value="month">Bulan</option>
              <option value="year">Tahun</option>
            </select>
          </div>
        </div>

        {/* Add New Item Section */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Nama Item"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            className="bg-white text-black flex-1 p-2 border rounded-lg"
          />
          <input
            type="number"
            placeholder="Harga"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
            className="bg-white text-black w-32 p-2 border rounded-lg"
          />
          <button
            onClick={addItem}
            className="p-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Items List */}
        <div className="space-y-2 mb-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 bg-white dark:text-black rounded-lg shadow-sm"
            >
              <span className="font-medium">{item.name}</span>
              <div className="flex items-center gap-4">
                <span className="text-blue-600">
                  Rp {Number(item.price).toLocaleString()}
                </span>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <Calculator className="w-8 h-8" />
              <div className="text-right">
                <p className="text-sm opacity-80">Total Target</p>
                <p className="text-xl font-bold">
                  Rp {totalTarget.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-500 text-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <DollarSign className="w-8 h-8" />
              <div className="text-right">
                <p className="text-sm opacity-80">Tabungan per {timeUnit}</p>
                <p className="text-xl font-bold">
                  Rp {savingsPerUnit.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-500 text-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <Calendar className="w-8 h-8" />
              <div className="text-right">
                <p className="text-sm opacity-80">
                  Waktu untuk Mencapai Target
                </p>
                <p className="text-xl font-bold">
                  {timeToTarget > 0
                    ? `${timeToTarget} ${
                        timeUnit === "day"
                          ? "hari"
                          : timeUnit === "week"
                          ? "minggu"
                          : timeUnit === "month"
                          ? "bulan"
                          : "tahun"
                      }`
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
