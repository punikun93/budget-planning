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
  AlertCircle,
  PieChart,
  TrendingUp,
  Target,
  AlertTriangle,
  Check,
  Package,
  CreditCard,
  BadgeDollarSign,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";

const CATEGORIES = [
  { id: "necessities", name: "Necessities", color: "#4F46E5", icon: Package },
  { id: "wants", name: "Wants", color: "#7C3AED", icon: CreditCard },
  {
    id: "investment",
    name: "Investment",
    color: "#0EA5E9",
    icon: BadgeDollarSign,
  },
];

const App = () => {
  // Theme handling
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const storedItems = JSON.parse(localStorage.getItem("items")) || [
    { id: 1, name: "Advan WorkPlus", price: 7800000, category: "wants" },
    { id: 2, name: "Rinjani Mountain", price: 5000000, category: "wants" },
  ];

  // State management
  const [items, setItems] = useState(storedItems);
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    category: "wants",
  });
  const [income, setIncome] = useState(localStorage.getItem("income") || "");
  const [savingPercentage, setSavingPercentage] = useState(
    localStorage.getItem("savingPercentage") || 20
  );
  const [timeUnit, setTimeUnit] = useState(
    localStorage.getItem("timeUnit") || "month"
  );
  const [activeTab, setActiveTab] = useState("overview");
  const [showProgress, setShowProgress] = useState(false);

  // Progress data
  const progressData = [
    { month: "Jan", saved: 2500000, target: 3000000 },
    { month: "Feb", saved: 2800000, target: 3000000 },
    { month: "Mar", saved: 3200000, target: 3000000 },
    { month: "Apr", saved: 2900000, target: 3000000 },
    { month: "May", saved: 3500000, target: 3000000 },
    { month: "Jun", saved: 3800000, target: 3000000 },
  ];

  // Theme handling effects
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      if (!localStorage.getItem("theme")) setDarkMode(e.matches);
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

  // Local storage sync
  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
    localStorage.setItem("income", income);
    localStorage.setItem("savingPercentage", savingPercentage);
    localStorage.setItem("timeUnit", timeUnit);
  }, [items, income, savingPercentage, timeUnit]);

  // Item management
  const addItem = () => {
    if (newItem.name && newItem.price && newItem.category) {
      setItems([...items, { ...newItem, id: Date.now() }]);
      setNewItem({ name: "", price: "", category: "wants" });
    }
  };

  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  // Calculations
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

  // Category totals for pie chart
  const categoryTotals = CATEGORIES.map((cat) => ({
    name: cat.name,
    value: items
      .filter((item) => item.category === cat.id)
      .reduce((sum, item) => sum + Number(item.price), 0),
    color: cat.color,
  }));

  return (
    <div
      className={`${
        darkMode ? "dark" : "light"
      } min-h-screen w-full bg-gray-50 dark:bg-gray-900`}
    >
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Budget Planner Pro
          </h1>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {darkMode ? (
              <Sun className="w-6 h-6 text-yellow-400" />
            ) : (
              <Moon className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </header>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {["overview", "analytics", "progress"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-colors
                ${
                  activeTab === tab
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calculator Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
                Budget Calculator
              </h2>

              <div className="space-y-6">
                {/* Income Input */}
                <div className="space-y-2">
                  <label className="text-sm text-gray-600 dark:text-gray-400">
                    Monthly Income
                  </label>
                  <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <DollarSign className="text-blue-600 dark:text-blue-400 w-5 h-5" />
                    <input
                      type="number"
                      value={income}
                      onChange={(e) => setIncome(e.target.value)}
                      className="w-full bg-transparent focus:outline-none text-gray-900 dark:text-white"
                      placeholder="Enter your monthly income"
                    />
                  </div>
                </div>

                {/* Savings Target */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Savings Target
                    </span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {savingPercentage}%
                    </span>
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
                      className={`px-4 py-2 rounded-lg text-sm transition-colors
                        ${
                          timeUnit === unit
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        }`}
                    >
                      {unit.charAt(0).toUpperCase() + unit.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Add Item Form */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Item Name"
                      value={newItem.name}
                      onChange={(e) =>
                        setNewItem({ ...newItem, name: e.target.value })
                      }
                      className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={newItem.price}
                      onChange={(e) =>
                        setNewItem({ ...newItem, price: e.target.value })
                      }
                      className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex gap-3">
                    <select
                      value={newItem.category}
                      onChange={(e) =>
                        setNewItem({ ...newItem, category: e.target.value })
                      }
                      className="flex-1 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <motion.button
                      onClick={addItem}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <PlusCircle className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>

            {/* Items List */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
                Items & Categories
              </h2>
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
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Rp {Number(item.price).toLocaleString("id-ID")}
                          </span>
                          <span className="text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                            {
                              CATEGORIES.find((cat) => cat.id === item.category)
                                ?.name
                            }
                          </span>
                        </div>
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
        )}

        {activeTab === "analytics" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
              Spending Analytics
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={categoryTotals}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {categoryTotals.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === "progress" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
              Progress Tracker
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
                  <Line type="monotone" dataKey="saved" stroke="#4CAF50" />
                  <Line type="monotone" dataKey="target" stroke="#FF9800" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
