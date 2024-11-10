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
  Image as ImageIcon,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const App = () => {
  // Theme handling
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    // Otherwise use system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
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

  const storedItems = JSON.parse(localStorage.getItem("items")) || [
    { id: 1, name: "Advan WorkPlus", price: 7800000, image: null },
    { id: 2, name: "Rinjani Mountain", price: 5000000, image: null },
  ];
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const addItem = () => {
    if (newItem.name && newItem.price) {
      setItems([...items, { ...newItem, id: Date.now()}]);
      setNewItem({ name: "", price: "" });
    }
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
      className={`app-container ${
        darkMode ? "dark" : "light"
      } max-w-6xl mx-auto p-6`}
    >
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-center sm:text-left">
          Budget Planner
        </h1>
        <button
          onClick={toggleDarkMode}
          className="p-2 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          {darkMode ? (
            <Sun className="text-yellow-400" />
          ) : (
            <Moon className="text-gray-600" />
          )}
        </button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
        {/* Main Budget Section */}
        <div className="p-6 rounded-lg shadow-lg bg-gradient-to-br from-indigo-100 to-blue-50 dark:from-gray-700 dark:to-gray-800">
          <h2 className="text-xl font-semibold mb-6">Budget Calculator</h2>

          <div className="space-y-6">
            {/* Income Input */}
            <div className="flex items-center gap-2">
              <DollarSign className="text-blue-600 dark:text-blue-400" />
              <input
                type="number"
                placeholder="Monthly Income"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className="flex-1 p-2 rounded-lg dark:bg-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* Savings Slider */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Savings Target</span>
                <span className="font-semibold">{savingPercentage}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={savingPercentage}
                onChange={(e) => setSavingPercentage(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Time Unit Selector */}
            <div className="flex gap-2 flex-wrap">
              {["day", "week", "month", "year"].map((unit) => (
                <button
                  key={unit}
                  onClick={() => setTimeUnit(unit)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    timeUnit === unit
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-gray-600"
                  }`}
                >
                  {unit.charAt(0).toUpperCase() + unit.slice(1)}
                </button>
              ))}
            </div>

            {/* Add Item Form */}
            <div className="flex gap-2 flex-wrap">
              <input
                type="text"
                placeholder="Item Name"
                value={newItem.name}
                onChange={(e) =>
                  setNewItem({ ...newItem, name: e.target.value })
                }
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
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusCircle />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Items and Suggestions Section */}
        <div className="p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-6">Items & Suggestions</h2>

          <div className="space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="p-4 flex items-center gap-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Rp {Number(item.price).toLocaleString("id-ID")}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
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
    className="p-6 rounded-lg shadow-md bg-white dark:bg-gray-800 flex items-center gap-4"
    whileHover={{ scale: 1.02 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700">{icon}</div>
    <div>
      <h3 className="text-sm text-gray-600 dark:text-gray-400">{title}</h3>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  </motion.div>
);

export default App;
