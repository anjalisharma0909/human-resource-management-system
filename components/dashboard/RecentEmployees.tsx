import { Pencil } from "lucide-react";

const employees = [
  {
    id: "EMP001",
    name: "Rahul Sharma",
    department: "IT",
    position: "Frontend Developer",
    status: "Active",
  },
  {
    id: "EMP002",
    name: "Priya Singh",
    department: "HR",
    position: "HR Manager",
    status: "Active",
  },
  {
    id: "EMP003",
    name: "Aman Gupta",
    department: "Finance",
    position: "Accountant",
    status: "On Leave",
  },
  {
    id: "EMP004",
    name: "Sneha Patel",
    department: "Marketing",
    position: "Executive",
    status: "Active",
  },
];

export default function RecentEmployees() {
  return (
    <div className="bg-white rounded-2xl shadow-md mt-8 p-6">

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          Recent Employees
        </h2>

        <button className="text-blue-600 font-medium hover:underline">
          View All
        </button>
      </div>

      <table className="w-full">

        <thead>

          <tr className="text-left border-b">

            <th className="pb-3">Employee ID</th>
            <th className="pb-3">Name</th>
            <th className="pb-3">Department</th>
            <th className="pb-3">Position</th>
            <th className="pb-3">Status</th>
            <th className="pb-3">Action</th>

          </tr>

        </thead>

        <tbody>

          {employees.map((emp) => (

            <tr
              key={emp.id}
              className="border-b hover:bg-gray-50 transition"
            >

              <td className="py-4">{emp.id}</td>

              <td className="font-medium">{emp.name}</td>

              <td>{emp.department}</td>

              <td>{emp.position}</td>

              <td>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    emp.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {emp.status}
                </span>
              </td>

              <td>
                <button className="text-blue-600 hover:text-blue-800">
                  <Pencil size={18} />
                </button>
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}