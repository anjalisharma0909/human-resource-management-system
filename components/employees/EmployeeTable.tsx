import { Pencil, Trash2 } from "lucide-react";

const employees = [
  {
    id: "EMP001",
    name: "Rahul Sharma",
    department: "IT",
    role: "Frontend Developer",
    status: "Active",
  },
  {
    id: "EMP002",
    name: "Priya Singh",
    department: "HR",
    role: "HR Manager",
    status: "Active",
  },
  {
    id: "EMP003",
    name: "Aman Gupta",
    department: "Finance",
    role: "Accountant",
    status: "On Leave",
  },
  {
    id: "EMP004",
    name: "Sneha Patel",
    department: "Marketing",
    role: "Executive",
    status: "Active",
  },
];

export default function EmployeeTable() {
  return (
    <div className="bg-white rounded-2xl shadow-md mt-6 overflow-hidden">

      <table className="w-full">

        <thead className="bg-gray-100">

          <tr className="text-left">

            <th className="p-4">Employee ID</th>
            <th className="p-4">Name</th>
            <th className="p-4">Department</th>
            <th className="p-4">Role</th>
            <th className="p-4">Status</th>
            <th className="p-4 text-center">Actions</th>

          </tr>

        </thead>

        <tbody>

          {employees.map((emp) => (

            <tr
              key={emp.id}
              className="border-t hover:bg-gray-50"
            >

              <td className="p-4">{emp.id}</td>

              <td className="p-4 font-medium">
                {emp.name}
              </td>

              <td className="p-4">{emp.department}</td>

              <td className="p-4">{emp.role}</td>

              <td className="p-4">

                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    emp.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {emp.status}
                </span>

              </td>

              <td className="p-4">

                <div className="flex justify-center gap-3">

                  <button className="text-blue-600 hover:text-blue-800">
                    <Pencil size={18} />
                  </button>

                  <button className="text-red-600 hover:text-red-800">
                    <Trash2 size={18} />
                  </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}