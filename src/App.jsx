import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  Trash2,
  Calculator,
  DollarSign,
  Calendar,
  Sun,
  Moon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const App = () => {
  // Theme handling
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme
      ? savedTheme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      if (!localStorage.getItem("theme")) {
        setDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const storedItems = JSON.parse(localStorage.getItem("items")) || [];
  const storedIncome = localStorage.getItem("income") || "";
  const storedSavingPercentage = localStorage.getItem("savingPercentage") || 20;
  const storedTimeUnit = localStorage.getItem("timeUnit") || "month";
  const storedWallet = localStorage.getItem("wallet") || 1000000;

  const [items, setItems] = useState(storedItems);
  const [newItem, setNewItem] = useState({ name: "", price: "" });
  const [income, setIncome] = useState(storedIncome);
  const [savingPercentage, setSavingPercentage] = useState(
    storedSavingPercentage
  );
  const [timeUnit, setTimeUnit] = useState(storedTimeUnit);
  const [wallet, setWallet] = useState(storedWallet);
  const [error, setError] = useState("");

  const addItem = () => {
    if (
      !newItem.name ||
      !newItem.price ||
      isNaN(newItem.price) ||
      newItem.price <= 0
    ) {
      setError("Please enter a valid item name and price.");
      return;
    }
    setItems([...items, { ...newItem, id: Date.now() }]);
    setNewItem({ name: "", price: "" });
    setError("");
  };

  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
    localStorage.setItem("income", income);
    localStorage.setItem("savingPercentage", savingPercentage);
    localStorage.setItem("timeUnit", timeUnit);
    localStorage.setItem("wallet", wallet);
  }, [items, income, savingPercentage, timeUnit, wallet]);

  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const totalTarget = items.reduce((sum, item) => sum + Number(item.price), 0);
  const monthlySaving = income ? Number(income) * (savingPercentage / 100) : 0;
  const savingsPerUnit = {
    day: monthlySaving / 30,
    week: monthlySaving / 4,
    month: monthlySaving,
    year: monthlySaving * 12,
  }[timeUnit];

  const timeToTarget =
    savingsPerUnit > 0 ? Math.ceil(totalTarget / savingsPerUnit) : 0;

  return (
    <div
      className={`${
        darkMode ? "dark" : "light"
      } min-h-screen w-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6`}
    >
      {/* Header */}
      <header className="flex justify-between items-center mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Budget Planner</h1>
        <button
          onClick={toggleDarkMode}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </header>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calculator Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-6">
          <h2 className="text-xl font-semibold mb-6">Budget Calculator</h2>

          {/* Income Input */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <DollarSign className="text-blue-600 dark:text-blue-400 w-5 h-5" />
              <input
                type="number"
                placeholder="Monthly Income"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className="w-full bg-transparent focus:outline-none"
              />
            </div>

            {/* Savings Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Savings Target</span>
                <span className="font-semibold">{savingPercentage}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={savingPercentage}
                onChange={(e) => setSavingPercentage(e.target.value)}
                className="w-full accent-blue-600"
              />
            </div>

            {/* Time Unit Selector */}
            <div className="flex flex-wrap gap-2">
              {["day", "week", "month", "year"].map((unit) => (
                <button
                  key={unit}
                  onClick={() => setTimeUnit(unit)}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    timeUnit === unit
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {unit.charAt(0).toUpperCase() + unit.slice(1)}
                </button>
              ))}
            </div>

            {/* Add Item Form */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Item Name"
                value={newItem.name}
                onChange={(e) =>
                  setNewItem({ ...newItem, name: e.target.value })
                }
                className="flex-1 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="number"
                placeholder="Price"
                value={newItem.price}
                onChange={(e) =>
                  setNewItem({ ...newItem, price: e.target.value })
                }
                className="sm:w-32 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <motion.button
                onClick={addItem}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusCircle className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        </div>

        {/* Items List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-6">
          <h2 className="text-xl font-semibold mb-6">Items & Suggestions</h2>
          <div className="space-y-3">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="p-4 flex items-center gap-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Rp {Number(item.price).toLocaleString("id-ID")}
                    </p>
                  </div>
                  <motion.button
                    onClick={() => removeItem(item.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <SummaryCard
          title="Total Target"
          value={`Rp ${totalTarget.toLocaleString("id-ID")}`}
          icon={<Calculator className="text-blue-600" />}
        />
        <SummaryCard
          title={`Savings per ${
            timeUnit.charAt(0).toUpperCase() + timeUnit.slice(1)
          }`}
          value={`Rp ${Math.round(savingsPerUnit).toLocaleString("id-ID")}`}
          icon={<DollarSign className="text-green-600" />}
        />
        <SummaryCard
          title="Time to Target"
          value={`${timeToTarget} ${timeUnit}${timeToTarget !== 1 ? "s" : ""}`}
          icon={<Calendar className="text-purple-600" />}
        />
      </div>
    </div>
  );
};

const SummaryCard = ({ title, value, icon }) => (
  <motion.div
    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 flex items-center gap-4"
    whileHover={{ y: -2 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <div className="p-3 rounded-full bg-gray-50 dark:bg-gray-700">{icon}</div>
    <div className="flex-1 min-w-0">
      <h3 className="text-sm text-gray-600 dark:text-gray-400">{title}</h3>
      <p className="text-lg font-semibold truncate">{value}</p>
    </div>
  </motion.div>
);

export default App;
