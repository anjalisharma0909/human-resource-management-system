"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { month: "Jan", employees: 45 },
  { month: "Feb", employees: 52 },
  { month: "Mar", employees: 60 },
  { month: "Apr", employees: 75 },
  { month: "May", employees: 90 },
  { month: "Jun", employees: 120 },
];

export default function EmployeeChart() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-6">
        Employee Growth
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="employees"
            stroke="#2563eb"
            strokeWidth={3}
          />

        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}