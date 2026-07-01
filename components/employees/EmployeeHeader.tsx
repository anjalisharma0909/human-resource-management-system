"use client";

import { Search, Plus } from "lucide-react";

export default function EmployeeHeader() {
  return (
    <div className="flex items-center justify-between mb-8">

      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Employees
        </h1>

        <p className="text-gray-500 mt-1">
          Manage all employee records
        </p>
      </div>

      <div className="flex items-center gap-4">

        <div className="relative">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search employee..."
            className="w-72 rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

        <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 transition">

          <Plus size={18} />

          Add Employee

        </button>

      </div>

    </div>
  );
}