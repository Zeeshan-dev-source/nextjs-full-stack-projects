"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [currency, setCurrency] = useState("PKR");
  const [theme, setTheme] = useState("light");

    useEffect(() => {
    const savedCurrency = localStorage.getItem("currency");
    const savedTheme = localStorage.getItem("theme");

    if (savedCurrency) {
        setCurrency(savedCurrency);
    }

    if (savedTheme) {
  setTheme(savedTheme);

  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
  }
}
    }, []);

function handleThemeChange(value: string) {
  setTheme(value);
  localStorage.setItem("theme", value);

  if (value === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

  return (
    <main className="min-h-screen bg-gray-100 p-6 dark:bg-gray-950">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>

        <p className="mb-8 text-gray-500 dark:text-gray-400">
          Manage your expense tracker settings.
        </p>

        {/* Currency */}
        <div className="mb-6 rounded-xl bg-white p-6 shadow dark:bg-gray-900">
          <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            Currency
          </h2>

          <p className="mb-8 text-gray-500 dark:text-gray-400">
            Select the currency used throughout the app.
          </p>

          <select
            value={currency}
            onChange={(e) => {
            setCurrency(e.target.value);
            localStorage.setItem("currency", e.target.value);
            }}
            className="w-full max-w-sm rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="PKR">PKR - Pakistani Rupee</option>
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
          </select>
        </div>

        {/* Appearance */}
        <div className="mb-6 rounded-xl bg-white p-6 shadow dark:bg-gray-900">
          <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            Appearance
          </h2>

          <p className="mb-8 text-gray-500 dark:text-gray-400">
            Choose how the application looks.
          </p>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => handleThemeChange("light")}
              className={`rounded-lg px-5 py-2 font-medium ${
                theme === "light"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Light
            </button>

            <button
              type="button"
              onClick={() => handleThemeChange("dark")}
              className={`rounded-lg px-5 py-2 font-medium ${
                theme === "dark"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Dark
            </button>
          </div>
        </div>

        {/* Data Management */}
        <div className="mb-6 rounded-xl bg-white p-6 shadow dark:bg-gray-900">
          <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            Data Management
          </h2>

          <p className="mb-8 text-gray-500 dark:text-gray-400">
            Manage your transaction data.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
            >
              Export Transactions
            </button>

            <button
              type="button"
              className="rounded-lg bg-red-600 px-5 py-2 font-medium text-white hover:bg-red-700"
            >
              Clear All Transactions
            </button>
          </div>
        </div>

        {/* About */}
        <div className="rounded-xl bg-white p-6 shadow dark:bg-gray-900">
          <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            About
          </h2>

          <p className="mb-8 text-gray-500 dark:text-gray-400">
            Expense Tracker
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Version 1.0
          </p>
        </div>
      </div>
    </main>
  );
}

