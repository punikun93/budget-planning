import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  Trash2,
  Calculator,
  DollarSign,
  Calendar,
  Wallet,
  Sun,
  Moon,
} from "lucide-react";
import { motion } from "framer-motion";
import "./App.css";
import "./index.css";

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const storedItems = JSON.parse(localStorage.getItem("items")) || [
    { id: 1, name: "Advan WorkPlus", price: 7800000 },
    { id: 2, name: "Rinjani Mountain", price: 5000000 },
  ];
  const storedIncome = localStorage.getItem("income") || "";
  const storedSavingPercentage = localStorage.getItem("savingPercentage") || 20;
  const storedTimeUnit = localStorage.getItem("timeUnit") || "day";
  const storedWallet = localStorage.getItem("wallet") || 1000000;

  const [items, setItems] = useState(storedItems);
  const [newItem, setNewItem] = useState({ name: "", price: "" });
  const [income, setIncome] = useState(storedIncome);
  const [savingPercentage, setSavingPercentage] = useState(
    storedSavingPercentage
  );
  const [timeUnit, setTimeUnit] = useState(storedTimeUnit);
  const [wallet, setWallet] = useState(storedWallet);

  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
    localStorage.setItem("income", income);
    localStorage.setItem("savingPercentage", savingPercentage);
    localStorage.setItem("timeUnit", timeUnit);
    localStorage.setItem("wallet", wallet);
  }, [items, income, savingPercentage, timeUnit, wallet]);

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
  const monthlySaving = income ? Number(income) * (savingPercentage / 100) : 0;
  const savingsPerUnit =
    timeUnit === "day"
      ? monthlySaving / 30
      : timeUnit === "week"
      ? monthlySaving / 4
      : timeUnit === "month"
      ? monthlySaving
      : monthlySaving * 12;
  const timeToTarget =
    savingsPerUnit > 0 ? Math.ceil(totalTarget / savingsPerUnit) : 0;

  return (
    <div
      className={`app-container ${
        darkMode ? "dark" : "light"
      } max-w-4xl mx-auto p-6`}
    >
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Budget Planner</h1>
        <button onClick={toggleDarkMode} className="p-2 bg-transparent">
          {darkMode ? (
            <Sun className="text-yellow-400" />
          ) : (
            <Moon className="text-gray-600" />
          )}
        </button>
      </header>

      <div className="flex flex-col md:flex-row mt-6 gap-4">
        {/* Main Section */}
        <div className="main-section p-6 rounded-lg shadow-lg bg-gradient-to-br from-indigo-100 to-blue-50 dark:from-gray-700 dark:to-gray-800 text-gray-800 dark:text-gray-200">
          <h2 className="text-xl font-semibold text-center mb-4">
            Budget Planning Calculator
          </h2>

          {/* Income & Savings Controls */}
          <div className="income-controls mb-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="text-blue-600" />
              <input
                type="number"
                placeholder="Monthly Income"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className="flex-1 p-2 rounded-lg focus:ring-2 dark:bg-gray-800 dark:text-gray-200 focus:ring-blue-400 outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <span>Save Percentage:</span>
              <input
                type="range"
                min="1"
                max="100"
                value={savingPercentage}
                onChange={(e) => setSavingPercentage(e.target.value)}
                className="flex-1"
              />
              <span>{savingPercentage}%</span>
            </div>
          </div>

          {/* Add Item */}
          <div className="add-item flex gap-2 mb-6">
            <input
              type="text"
              placeholder="Item Name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="flex-1 p-2 rounded-lg dark:bg-gray-800 dark:text-gray-200"
            />
            <input
              type="number"
              placeholder="Price"
              value={newItem.price}
              onChange={(e) =>
                setNewItem({ ...newItem, price: e.target.value })
              }
              className="w-32 p-2 rounded-lg dark:bg-gray-800 dark:text-gray-200"
            />
            <motion.button
              onClick={addItem}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-blue-600 text-white rounded-lg"
            >
              <PlusCircle />
            </motion.button>
          </div>

          {/* Item List */}
          <div className="item-list space-y-4">
            {items.map((item) => (
              <motion.div
                key={item.id}
                className="p-3 flex justify-between items-center bg-white dark:bg-gray-800 rounded-lg shadow-md"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span>{item.name}</span>
                <div className="flex items-center gap-2">
                  <span>Rp {Number(item.price).toLocaleString("id-ID")}</span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500"
                  >
                    <Trash2 />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="summary mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SummaryCard
              title="Total Target"
              value={`Rp ${totalTarget.toLocaleString()}`}
              icon={<Calculator />}
            />
            <SummaryCard
              title="Savings per Month"
              value={`Rp ${savingsPerUnit.toLocaleString()}`}
              icon={<DollarSign />}
            />
            <SummaryCard
              title="Time to Reach Target"
              value={`${timeToTarget} ${timeUnit}`}
              icon={<Calendar />}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ title, value, icon }) => (
  <motion.div
    className="summary-card p-4 rounded-lg shadow-md flex items-center justify-between bg-white dark:bg-gray-800"
    whileHover={{ scale: 1.05 }}
  >
    {icon}
    <div>
      <h3 className="text-sm">{title}</h3>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  </motion.div>
);

export default App;
