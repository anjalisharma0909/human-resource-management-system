// "use client";
// import React, { useEffect, useState } from "react";
// import { useAuth } from "@/context/AuthContext";

// export default function AdminDashboard() {
//   const { user, logout } = useAuth();
//   const [activeTab, setActiveTab] = useState("departments"); // Default to departments for testing
  
//   const [stats, setStats] = useState<any>(null);
//   const [employees, setEmployees] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [leaves, setLeaves] = useState([]);
//   const [attendance, setAttendance] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Live Date & Time State
//   const [liveTime, setLiveTime] = useState("");

//   // Form states for adding new Department Modal
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [newDeptName, setNewDeptName] = useState("");
//   const [newManagerName, setNewManagerName] = useState("");
//   const [newBudget, setNewBudget] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const API_BASE = "http://127.0.0.1:8000/api/v1/admin";
//   const currentAdminName = user?.name || stats?.admin_name || "Monu01";
  
//   const adminInitials = currentAdminName
//     .split(" ")
//     .map((n: string) => n[0])
//     .join("")
//     .toUpperCase()
//     .slice(0, 2);

//   // Function to refetch departments after adding a new one
//   const fetchDepartmentsOnly = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/departments`);
//       if (res.ok) setDepartments(await res.json());
//     } catch (err) {
//       console.error("Error updating departments list:", err);
//     }
//   };

//   useEffect(() => {
//     const updateClock = () => {
//       const now = new Date();
//       const options: Intl.DateTimeFormatOptions = { 
//         weekday: 'long', 
//         year: 'numeric', 
//         month: 'long', 
//         day: 'numeric' 
//       };
//       const dateStr = now.toLocaleDateString('en-US', options);
//       const timeStr = now.toLocaleTimeString('en-US', { 
//         hour: '2-digit', 
//         minute: '2-digit', 
//         second: '2-digit',
//         hour12: true 
//       });
//       setLiveTime(`${dateStr} | ${timeStr}`);
//     };

//     updateClock(); 
//     const intervalId = setInterval(updateClock, 1000); 

//     async function fetchAdminData() {
//       try {
//         const [statsRes, empRes, deptRes, leaveRes, attendRes] = await Promise.all([
//           fetch(`${API_BASE}/dashboard-stats`),
//           fetch(`${API_BASE}/employees`),
//           fetch(`${API_BASE}/departments`),
//           fetch(`${API_BASE}/leaves`),
//           fetch(`${API_BASE}/attendance`)
//         ]);

//         if (statsRes.ok) setStats(await statsRes.json());
//         if (empRes.ok) setEmployees(await empRes.json());
//         if (deptRes.ok) setDepartments(await deptRes.json());
//         if (leaveRes.ok) setLeaves(await leaveRes.json());
//         if (attendRes.ok) setAttendance(await attendRes.json());
        
//       } catch (err) {
//         console.error("Error fetching admin data:", err);
//       } finally { 
//         setLoading(false);
//       }
//     }

//     fetchAdminData();
//     return () => clearInterval(intervalId);
//   }, []);

//   // Handle Form Submit to Database via Backend API
//   const handleAddDepartment = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newDeptName.trim()) return alert("Department name is required!");
    
//     setIsSubmitting(true);
//     try {
//       const res = await fetch(`${API_BASE}/departments`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           department_name: newDeptName,
//           manager_name: newManagerName || "Unassigned",
//           annual_budget: parseFloat(newBudget) || 0,
//           members_count: 0 
//         }),
//       });

//       if (res.ok) {
//         setNewDeptName("");
//         setNewManagerName("");
//         setNewBudget("");
//         setIsModalOpen(false);
//         await fetchDepartmentsOnly();
//       } else {
//         alert("Failed to save department to database. Check API schema.");
//       }
//     } catch (err) {
//       console.error("Network error saving department:", err);
//       alert("Backend server is unreachable!");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleLeaveAction = async (id: number, status: string) => {
//     try {
//       const res = await fetch(`${API_BASE}/leaves/${id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ status, reviewer: currentAdminName })
//       });
//       if (res.ok) {
//         const updateRes = await fetch(`${API_BASE}/leaves`);
//         setLeaves(await updateRes.json());
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-[#0d0e12] text-white font-semibold">
//         Loading HRMS Admin Engine...
//       </div>
//     );
//   }

//   const displayTotalEmployees = employees.length > 0 ? employees.length : (stats?.total_employees || 0);
//   const displayTotalDepartments = departments.length > 0 ? departments.length : (stats?.total_departments || 0);
//   const displayPendingLeaves = leaves.filter((l: any) => l.status === "Pending").length;

//   return (
//     <div className="flex min-h-screen bg-[#0d0e12] text-white overflow-hidden select-none">
      
//       {/* Sidebar Navigation */}
//       <aside className="w-64 bg-[#14161f] border-r border-gray-800 flex flex-col justify-between p-6 shrink-0 h-screen overflow-hidden">
//         <div>
//           <div className="flex items-center gap-3 mb-10">
//             <div className="h-9 w-9 rounded-xl bg-purple-600 flex items-center justify-center font-bold">H</div>
//             <div>
//               <h1 className="font-bold text-lg leading-none">HRMS</h1>
//             </div>
//           </div>

//           <nav className="space-y-2">
//             {[
//               { id: "dashboard", label: "Dashboard", icon: "📊" },
//               { id: "employees", label: "Employees", icon: "👥" },
//               { id: "departments", label: "Departments", icon: "🏢" },
//               { id: "leave", label: "Leave Requests", icon: "📅" },
//               { id: "attendance", label: "Attendance", icon: "⏱️" },
//             ].map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition text-sm font-medium cursor-pointer ${
//                   activeTab === tab.id ? "bg-purple-600 text-white font-semibold shadow-lg shadow-purple-600/20" : "text-gray-400 hover:bg-[#1c1e2a] hover:text-white"
//                 }`}
//               >
//                 <span>{tab.icon}</span>
//                 {tab.label}
//               </button>
//             ))}
//           </nav>
//         </div>

//         <div className="pt-4 border-t border-gray-800/60">
//           <button onClick={logout} className="w-full flex items-center gap-4 px-4 py-2 rounded-xl text-red-400 hover:bg-red-500/10 transition text-sm font-medium cursor-pointer">
//             <span>🚪</span> Sign Out
//           </button>
//         </div>
//       </aside>

//       {/* Main Container */}
//       <main className="flex-1 p-8 overflow-y-auto h-screen">
        
//         {/* Header Section */}
//         <header className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
//           <div>
//             <p className="text-xs text-gray-500 uppercase font-medium tracking-wider mb-0.5">System Live Clock</p>
//             <h2 className="text-sm font-semibold text-purple-400 font-mono">
//               {liveTime || "Syncing with system core..."}
//             </h2>
//           </div>
//           <div className="flex items-center gap-3">
//             <div className="text-right">
//               <p className="text-sm font-semibold">{currentAdminName}</p>
//               <p className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Admin Role</p>
//             </div>
//             <div className="h-10 w-10 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center font-bold text-purple-400">
//               {adminInitials}
//             </div>
//           </div>
//         </header>

//         {activeTab === "dashboard" && (
//           <div className="space-y-6">
//             <div className="bg-gradient-to-r from-purple-900/20 to-indigo-900/10 border border-purple-800/20 rounded-2xl p-6">
//               <h2 className="text-2xl font-bold mb-1">Welcome back, {currentAdminName.split(" ")[0]}</h2>
//               <p className="text-xs text-gray-400">Here is the real-time activity metrics log for today.</p>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//               <div className="bg-[#14161f] p-5 rounded-2xl border border-gray-800">
//                 <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Employees</p>
//                 <p className="text-3xl font-bold mt-2 text-purple-400">{displayTotalEmployees}</p>
//               </div>
//               <div className="bg-[#14161f] p-5 rounded-2xl border border-gray-800">
//                 <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Departments</p>
//                 <p className="text-3xl font-bold mt-2 text-emerald-400">{displayTotalDepartments}</p>
//               </div>
//               <div className="bg-[#14161f] p-5 rounded-2xl border border-gray-800">
//                 <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Pending Leaves</p>
//                 <p className="text-3xl font-bold mt-2 text-amber-400">{displayPendingLeaves}</p>
//               </div>
//               <div className="bg-[#14161f] p-5 rounded-2xl border border-gray-800">
//                 <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Today's Attendance</p>
//                 <p className="text-3xl font-bold mt-2 text-blue-400">
//                   {stats?.today_attendance_present || attendance.length}/{stats?.today_attendance_total || displayTotalEmployees}
//                 </p>
//               </div>
//             </div>

//             {/* Quick Actions Panel */}
//             <div className="w-full mt-6">
//               <div className="bg-[#14161f] border border-gray-800 rounded-2xl p-6">
//                 <h3 className="text-sm font-bold text-gray-300 mb-5 uppercase tracking-wider">Quick Actions & Shortcuts</h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//                   <button onClick={() => setActiveTab("employees")} className="p-5 bg-[#1c1e2a] hover:bg-purple-600/10 border border-gray-800 hover:border-purple-500/40 rounded-xl transition cursor-pointer group flex flex-col justify-between min-h-[120px]">
//                     <div className="text-2xl group-hover:scale-110 transition-transform duration-200">👥</div>
//                     <div>
//                       <p className="text-sm font-semibold text-white">Manage Staff</p>
//                       <p className="text-[10px] text-gray-500 mt-0.5">View & edit roster</p>
//                     </div>
//                   </button>

//                   <button onClick={() => setActiveTab("leave")} className="p-5 bg-[#1c1e2a] hover:bg-amber-600/10 border border-gray-800 hover:border-amber-500/40 rounded-xl transition cursor-pointer group flex flex-col justify-between min-h-[120px]">
//                     <div className="text-2xl group-hover:scale-110 transition-transform duration-200">📅</div>
//                     <div>
//                       <p className="text-sm font-semibold text-white">Leave Requests</p>
//                       <p className="text-[10px] text-gray-500 mt-0.5">Approve employee leaves</p>
//                     </div>
//                   </button>

//                   <button onClick={() => setActiveTab("departments")} className="p-5 bg-[#1c1e2a] hover:bg-emerald-600/10 border border-gray-800 hover:border-emerald-500/40 rounded-xl transition cursor-pointer group flex flex-col justify-between min-h-[120px]">
//                     <div className="text-2xl group-hover:scale-110 transition-transform duration-200">🏢</div>
//                     <div>
//                       <p className="text-sm font-semibold text-white">Manage Departments</p>
//                       <p className="text-[10px] text-gray-500 mt-0.5">Check budget & leads</p>
//                     </div>
//                   </button>

//                   <button onClick={() => setActiveTab("attendance")} className="p-5 bg-[#1c1e2a] hover:bg-blue-600/10 border border-gray-800 hover:border-blue-500/40 rounded-xl transition cursor-pointer group flex flex-col justify-between min-h-[120px]">
//                     <div className="text-2xl group-hover:scale-110 transition-transform duration-200">⏱️</div>
//                     <div>
//                       <p className="text-sm font-semibold text-white">Track Attendance</p>
//                       <p className="text-[10px] text-gray-500 mt-0.5">Real-time status feed</p>
//                     </div>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* EMP */}
//         {activeTab === "employees" && (
//           <div className="bg-[#14161f] rounded-2xl border border-gray-800 p-6">
//             <h3 className="text-lg font-bold mb-4">Organization Staff Roster</h3>
//             <table className="w-full text-left border-collapse">
//               <thead>
//                 <tr className="border-b border-gray-800 text-xs text-gray-500 uppercase">
//                   <th className="pb-3">Employee ID</th>
//                   <th className="pb-3">Name</th>
//                   <th className="pb-3">Department</th>
//                   <th className="pb-3">Role</th>
//                   <th className="pb-3">Status</th>
//                 </tr>
//               </thead>
//               <tbody className="text-sm divide-y divide-gray-800/50">
//                 {employees.map((emp: any) => (
//                   <tr key={emp.employee_id} className="hover:bg-[#1c1e2a]/30">
//                     <td className="py-4 text-gray-400 font-mono">{emp.employee_id}</td>
//                     <td className="py-4 font-semibold text-white">{emp.name}</td>
//                     <td className="py-4 text-gray-300">{emp.department}</td>
//                     <td className="py-4 text-gray-400">{emp.role}</td>
//                     <td className="py-4">
//                       <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${emp.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
//                         {emp.status}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* Department */}
//         {activeTab === "departments" && (
//           <div className="space-y-6">
//             <div className="flex justify-between items-center bg-[#14161f] p-4 rounded-xl border border-gray-800">
//               <div>
//                 <h3 className="text-base font-bold text-white">Company Departments</h3>
//                 <p className="text-xs text-gray-500">Configure and monitor administrative business units</p>
//               </div>
//               <button 
//                 onClick={() => setIsModalOpen(true)}
//                 className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-purple-600/10 transition cursor-pointer flex items-center gap-2"
//               >
//                 <span>➕</span> Add Department
//               </button>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               {departments.map((dept: any) => (
//                 <div key={dept.department_id || dept.id} className="bg-[#14161f] p-6 rounded-2xl border border-gray-800 flex flex-col justify-between">
//                   <div>
//                     <h4 className="text-base font-bold text-white mb-1">{dept.department_name}</h4>
//                     <p className="text-xs text-gray-500 mb-4">Manager: {dept.manager_name || "Unassigned"}</p>
//                   </div>
//                   <div className="border-t border-gray-800 pt-4 flex justify-between text-xs text-gray-400">
//                     <div>
//                       <p>Annual Budget</p>
//                       <p className="font-bold text-white mt-0.5">₹{dept.annual_budget?.toLocaleString()}</p>
//                     </div>
//                     <div className="text-right">
//                       <p>Active Staff</p>
//                       <p className="font-bold text-purple-400 mt-0.5">{dept.members_count || 0} Assigned</p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Leave  */}
//         {activeTab === "leave" && (
//           <div className="space-y-6">
//             <div className="bg-[#14161f] p-6 rounded-2xl border border-gray-800">
//               <h3 className="text-base font-bold text-amber-400 mb-4">Pending Authorization Records</h3>
//               <div className="space-y-4">
//                 {leaves.filter((l: any) => l.status === "Pending").map((leave: any) => (
//                   <div key={leave.leave_id} className="bg-[#1c1e2a] p-5 rounded-xl border border-gray-800 flex justify-between items-center">
//                     <div>
//                       <h4 className="font-bold text-sm">{leave.employee_name} <span className="text-xs font-normal text-gray-500">({leave.leave_type})</span></h4>
//                       <p className="text-xs text-purple-400 mt-1">Duration Log: {leave.dates}</p>
//                       <p className="text-xs text-gray-400 mt-2 italic">" {leave.reason} "</p>
//                     </div>
//                     <div className="flex gap-2">
//                       <button onClick={() => handleLeaveAction(leave.leave_id, "REJECTED")} className="px-3 py-1.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg text-xs hover:bg-red-500 hover:text-white transition cursor-pointer">Reject</button>
//                       <button onClick={() => handleLeaveAction(leave.leave_id, "APPROVED")} className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs hover:bg-emerald-500 hover:text-white transition cursor-pointer">Approve</button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/*  Attendance*/}
//         {activeTab === "attendance" && (
//           <div className="bg-[#14161f] rounded-2xl border border-gray-800 p-6">
//             <h3 className="text-lg font-bold mb-4">Real-Time Attendance Feed</h3>
//             <table className="w-full text-left border-collapse">
//               <thead>
//                 <tr className="border-b border-gray-800 text-xs text-gray-500 uppercase">
//                   <th className="pb-3">Feed ID</th>
//                   <th className="pb-3">Employee</th>
//                   <th className="pb-3">Clock In</th>
//                   <th className="pb-3">Clock Out</th>
//                   <th className="pb-3">Duration</th>
//                   <th className="pb-3">Status</th>
//                 </tr>
//               </thead>
//               <tbody className="text-sm divide-y divide-gray-800/50">
//                 {attendance.map((log: any) => (
//                   <tr key={log.id} className="hover:bg-[#1c1e2a]/30">
//                     <td className="py-4 font-mono text-gray-500">{log.id}</td>
//                     <td className="py-4 font-semibold">{log.employee}</td>
//                     <td className="py-4 text-gray-300">{log.clock_in}</td>
//                     <td className="py-4 text-gray-300">{log.clock_out}</td>
//                     <td className="py-4 text-gray-400">{log.work_duration}</td>
//                     <td className="py-4">
//                       <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${log.status === "ON-TIME" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
//                         {log.status}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </main>

//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
//           <div className="bg-[#14161f] w-full max-w-md p-6 rounded-2xl border border-gray-800 shadow-2xl relative">
//             <div className="flex justify-between items-center mb-5">
//               <h3 className="text-base font-bold text-white flex items-center gap-2">
//                 <span>🏢</span> Create New Department
//               </h3>
//               <button 
//                 onClick={() => setIsModalOpen(false)} 
//                 className="text-gray-400 hover:text-white transition text-lg font-bold cursor-pointer"
//               >
//                 ✕
//               </button>
//             </div>

//             <form onSubmit={handleAddDepartment} className="space-y-4">
//               {/* Field 1: Department Name */}
//               <div>
//                 <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Department Name *</label>
//                 <input 
//                   type="text"
//                   required
//                   placeholder="e.g., Marketing, Development"
//                   value={newDeptName}
//                   onChange={(e) => setNewDeptName(e.target.value)}
//                   className="w-full bg-[#0d0e12] border border-gray-800 focus:border-purple-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition"
//                 />
//               </div>

//               {/* Field 2: Manager Name */}
//               <div>
//                 <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Assigned Manager</label>
//                 <input 
//                   type="text"
//                   placeholder="e.g., Sarah Jenkins"
//                   value={newManagerName}
//                   onChange={(e) => setNewManagerName(e.target.value)}
//                   className="w-full bg-[#0d0e12] border border-gray-800 focus:border-purple-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition"
//                 />
//               </div>

//               {/* Field 3: Budget Input */}
//               <div>
//                 <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Annual Budget (INR ₹)</label>
//                 <input 
//                   type="number"
//                   placeholder="e.g., 500000"
//                   value={newBudget}
//                   onChange={(e) => setNewBudget(e.target.value)}
//                   className="w-full bg-[#0d0e12] border border-gray-800 focus:border-purple-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
//                 />
//               </div>

//               {/* Form Actions Buttons */}
//               <div className="flex gap-3 justify-end pt-3 border-t border-gray-800/50 mt-5">
//                 <button 
//                   type="button" 
//                   onClick={() => setIsModalOpen(false)}
//                   className="px-4 py-2 bg-transparent text-gray-400 hover:text-white text-xs font-semibold rounded-xl transition cursor-pointer"
//                 >
//                   Cancel
//                 </button>
//                 <button 
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl transition cursor-pointer shadow-lg shadow-purple-600/10 disabled:opacity-50"
//                 >
//                   {isSubmitting ? "Saving to DB..." : "Save Department"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }




// "use client"; 
// import React, { useEffect, useState } from "react";
// import { useAuth } from "@/context/AuthContext";

// export default function AdminDashboard() {
//   const { user, logout } = useAuth();
//   const [activeTab, setActiveTab] = useState("leave"); // Set default to leave for testing sync
  
//   const [stats, setStats] = useState<any>(null);
//   const [employees, setEmployees] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [leaves, setLeaves] = useState([]);
//   const [attendance, setAttendance] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [liveTime, setLiveTime] = useState("");

//   // Modal form states
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [newDeptName, setNewDeptName] = useState("");
//   const [newManagerName, setNewManagerName] = useState("");
//   const [newBudget, setNewBudget] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const API_BASE = "http://127.0.0.1:8000/api/v1/admin";
//   const currentAdminName = user?.name || stats?.admin_name || "Jek"; // Synced to Jek as per your image
  
//   const adminInitials = currentAdminName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

//   // Separate function to fetch leaves to ensure real-time update on action
//   const fetchLeavesOnly = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/leaves`);
//       if (res.ok) setLeaves(await res.json());
//     } catch (err) {
//       console.error("Error refreshing leaves:", err);
//     }
//   };

//   useEffect(() => {
//     const updateClock = () => {
//       const now = new Date();
//       const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
//       setLiveTime(`${now.toLocaleDateString('en-US', options)} | ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}`);
//     };

//     updateClock(); 
//     const intervalId = setInterval(updateClock, 1000); 

//     async function fetchAdminData() {
//       try {
//         const [statsRes, empRes, deptRes, leaveRes, attendRes] = await Promise.all([
//           fetch(`${API_BASE}/dashboard-stats`),
//           fetch(`${API_BASE}/employees`),
//           fetch(`${API_BASE}/departments`),
//           fetch(`${API_BASE}/leaves`),
//           fetch(`${API_BASE}/attendance`)
//         ]);

//         if (statsRes.ok) setStats(await statsRes.json());
//         if (empRes.ok) setEmployees(await empRes.json());
//         if (deptRes.ok) setDepartments(await deptRes.json());
//         if (leaveRes.ok) setLeaves(await leaveRes.json());
//         if (attendRes.ok) setAttendance(await attendRes.json());
        
//       } catch (err) {
//         console.error("Error fetching admin data:", err);
//       } finally { 
//         setLoading(false);
//       }
//     }

//     fetchAdminData();
//     return () => clearInterval(intervalId);
//   }, []);

//   // Handle Leave Status Actions (Approve / Reject) and Save into DB
//   const handleLeaveAction = async (id: number, status: string) => {
//     try {
//       const res = await fetch(`${API_BASE}/leaves/${id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ status, reviewer: currentAdminName })
//       });
//       if (res.ok) {
//         // Fetch refreshed state directly from database to mirror sync changes
//         await fetchLeavesOnly();
//       } else {
//         alert("Action failed on database update.");
//       }
//     } catch (err) {
//       console.error("Error updating leave action:", err);
//     }
//   };

//   const handleAddDepartment = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newDeptName.trim()) return;
//     setIsSubmitting(true);
//     try {
//       const res = await fetch(`${API_BASE}/departments`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ department_name: newDeptName, manager_name: newManagerName || "Unassigned", annual_budget: parseFloat(newBudget) || 0, members_count: 0 }),
//       });
//       if (res.ok) {
//         setNewDeptName(""); setNewManagerName(""); setNewBudget(""); setIsModalOpen(false);
//         const resDept = await fetch(`${API_BASE}/departments`);
//         if (resDept.ok) setDepartments(await resDept.json());
//       }
//     } catch (err) { console.error(err); } finally { setIsSubmitting(false); }
//   };

//   if (loading) return <div className="flex min-h-screen items-center justify-center bg-[#0d0e12] text-white font-semibold">Loading HRMS Admin Engine...</div>;

//   const displayTotalEmployees = employees.length > 0 ? employees.length : (stats?.total_employees || 0);
//   const displayTotalDepartments = departments.length > 0 ? departments.length : (stats?.total_departments || 0);
//   const displayPendingLeaves = leaves.filter((l: any) => l.status === "Pending").length;

//   return (
//     <div className="flex min-h-screen bg-[#0d0e12] text-white overflow-hidden select-none">
      
//       {/* Sidebar Navigation */}
//       <aside className="w-64 bg-[#14161f] border-r border-gray-800 flex flex-col justify-between p-6 shrink-0 h-screen overflow-hidden">
//         <div>
//           <div className="flex items-center gap-3 mb-10">
//             <div className="h-9 w-9 rounded-xl bg-purple-600 flex items-center justify-center font-bold">H</div>
//             <h1 className="font-bold text-lg leading-none">HRMS</h1>
//           </div>

//           <nav className="space-y-2">
//             {[
//               { id: "dashboard", label: "Dashboard", icon: "📊" },
//               { id: "employees", label: "Employees", icon: "👥" },
//               { id: "departments", label: "Departments", icon: "🏢" },
//               { id: "leave", label: "Leave Requests", icon: "📅" },
//               { id: "attendance", label: "Attendance", icon: "⏱️" },
//             ].map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition text-sm font-medium cursor-pointer ${
//                   activeTab === tab.id ? "bg-purple-600 text-white font-semibold shadow-lg shadow-purple-600/20" : "text-gray-400 hover:bg-[#1c1e2a] hover:text-white"
//                 }`}
//               >
//                 <span>{tab.icon}</span> {tab.label}
//               </button>
//             ))}
//           </nav>
//         </div>
//         <div className="pt-4 border-t border-gray-800/60">
//           <button onClick={logout} className="w-full flex items-center gap-4 px-4 py-2 rounded-xl text-red-400 hover:bg-red-500/10 transition text-sm font-medium cursor-pointer"><span>🚪</span> Sign Out</button>
//         </div>
//       </aside>

//       {/* Main Container */}
//       <main className="flex-1 p-8 overflow-y-auto h-screen">
        
//         {/* Header Section */}
//         <header className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
//           <div>
//             <p className="text-xs text-gray-500 uppercase font-medium tracking-wider mb-0.5">System Live Clock</p>
//             <h2 className="text-sm font-semibold text-purple-400 font-mono">{liveTime || "Syncing..."}</h2>
//           </div>
//           <div className="flex items-center gap-3">
//             <div className="text-right">
//               <p className="text-sm font-semibold">{currentAdminName}</p>
//               <p className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Admin Role</p>
//             </div>
//             <div className="h-10 w-10 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center font-bold text-purple-400">{adminInitials}</div>
//           </div>
//         </header>

//         {activeTab === "dashboard" && (
//           <div className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//               <div className="bg-[#14161f] p-5 rounded-2xl border border-gray-800"><p className="text-xs text-gray-500 uppercase font-medium">Total Employees</p><p className="text-3xl font-bold mt-2 text-purple-400">{displayTotalEmployees}</p></div>
//               <div className="bg-[#14161f] p-5 rounded-2xl border border-gray-800"><p className="text-xs text-gray-500 uppercase font-medium">Departments</p><p className="text-3xl font-bold mt-2 text-emerald-400">{displayTotalDepartments}</p></div>
//               <div className="bg-[#14161f] p-5 rounded-2xl border border-gray-800"><p className="text-xs text-gray-500 uppercase font-medium">Pending Leaves</p><p className="text-3xl font-bold mt-2 text-amber-400">{displayPendingLeaves}</p></div>
//               <div className="bg-[#14161f] p-5 rounded-2xl border border-gray-800"><p className="text-xs text-gray-500 uppercase font-medium">Today's Attendance</p><p className="text-3xl font-bold mt-2 text-blue-400">{attendance.length}/{displayTotalEmployees}</p></div>
//             </div>
//           </div>
//         )}

//         {/* Leave Panel: Top Layout Grid with Action Pipeline integration */}
//         {activeTab === "leave" && (
//           <div className="space-y-6 animate-fadeIn">
//             <div className="bg-[#14161f] p-6 rounded-2xl border border-gray-800">
//               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
//                 <div>
//                   <h3 className="text-lg font-bold text-white flex items-center gap-2">
//                     <span className="text-amber-400">📅</span> Pending Authorization Records
//                   </h3>
//                   <p className="text-xs text-gray-500">Review, approve, or decline system leave request items from database pipeline</p>
//                 </div>
//                 <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold rounded-lg uppercase tracking-wider">
//                   {displayPendingLeaves} Pending
//                 </span>
//               </div>

//               {displayPendingLeaves === 0 ? (
//                 <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-gray-800 rounded-xl bg-[#0d0e12]/40">
//                   <p className="text-sm font-medium text-gray-400">All clear! No pending leave tokens waiting.</p>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {leaves.filter((l: any) => l.status === "Pending").map((leave: any) => (
//                     <div 
//                       key={leave.leave_id} 
//                       className="bg-[#1c1e2a] border border-gray-800 hover:border-gray-700 rounded-xl p-5 flex flex-col justify-between transition shadow-md group"
//                     >
//                       <div>
//                         <div className="flex justify-between items-start mb-3">
//                           <div>
//                             <h4 className="font-bold text-sm text-white group-hover:text-purple-400 transition-colors">{leave.employee_name}</h4>
//                             <span className="inline-block mt-1 px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 rounded text-[10px] font-bold text-purple-400 uppercase tracking-wider">
//                               {leave.leave_type}
//                             </span>
//                           </div>
//                           <div className="text-right">
//                             <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Duration Log</p>
//                             <p className="text-xs text-gray-400 font-mono mt-0.5">{leave.dates}</p>
//                           </div>
//                         </div>
                        
//                         <div className="bg-[#0d0e12]/50 rounded-lg p-3 border border-gray-800/40 my-3">
//                           <p className="text-[9px] text-gray-500 uppercase font-bold tracking-wider mb-1">Statement Reason</p>
//                           <p className="text-xs text-gray-300 italic">"{leave.reason}"</p>
//                         </div>
//                       </div>

//                       <div className="flex gap-2 justify-end pt-3 border-t border-gray-800/40 mt-2">
//                         <button 
//                           onClick={() => handleLeaveAction(leave.leave_id, "REJECTED")} 
//                           className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition cursor-pointer"
//                         >
//                           Reject
//                         </button>
//                         <button 
//                           onClick={() => handleLeaveAction(leave.leave_id, "APPROVED")} 
//                           className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-bold hover:bg-emerald-500 hover:text-white transition cursor-pointer"
//                         >
//                           Approve Token
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }




// "use client"; 
// import React, { useEffect, useState } from "react";
// import { useAuth } from "@/context/AuthContext";

// export default function AdminDashboard() {
//   const { user, logout } = useAuth();
//   const [activeTab, setActiveTab] = useState("dashboard"); 
  
//   const [stats, setStats] = useState<any>(null);
//   const [employees, setEmployees] = useState<any[]>([]);
//   const [departments, setDepartments] = useState([]);
//   const [leaves, setLeaves] = useState<any[]>([]);
//   const [attendance, setAttendance] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [liveTime, setLiveTime] = useState("");

//   // Admin name ke liye strict local state
//   const [currentAdminName, setCurrentAdminName] = useState("Admin");

//   // Modal form states
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [newDeptName, setNewDeptName] = useState("");
//   const [newManagerName, setNewManagerName] = useState("");
//   const [newBudget, setNewBudget] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const API_BASE = "http://127.0.0.1:8000/api/v1/admin";
//   const API_LEAVE = "http://127.0.0.1:8000/api/v1/leave"; 

//   // Initials ke liye logic
//   const adminInitials = currentAdminName
//     ? currentAdminName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
//     : "AD";

//   // Leaves refresh karne ka function
//   const fetchLeavesOnly = async () => {
//     try {
//       const res = await fetch(`${API_LEAVE}/all-requests`);
//       if (res.ok) setLeaves(await res.json());
//     } catch (err) {
//       console.error("Error refreshing leaves:", err);
//     }
//   };

//   // STRICT PROFILE NAME TRACKING
//   useEffect(() => {
//     if (user?.name) {
//       setCurrentAdminName(user.name);
//     } else {
//       const localName = localStorage.getItem("user_name");
//       if (localName) setCurrentAdminName(localName);
//     }
//   }, [user]);

//   useEffect(() => {
//     const updateClock = () => {
//       const now = new Date();
//       const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
//       setLiveTime(`${now.toLocaleDateString('en-US', options)} | ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}`);
//     };

//     updateClock(); 
//     const intervalId = setInterval(updateClock, 1000); 

//     async function fetchAdminData() {
//       try {
//         const [statsRes, empRes, deptRes, leaveRes, attendRes] = await Promise.all([
//           fetch(`${API_BASE}/dashboard-stats`),
//           fetch(`${API_BASE}/employees`),
//           fetch(`${API_BASE}/departments`),
//           fetch(`${API_LEAVE}/all-requests`), 
//           fetch(`${API_BASE}/attendance`)
//         ]);

//         if (statsRes.ok) setStats(await statsRes.json());
//         if (empRes.ok) setEmployees(await empRes.json());
//         if (deptRes.ok) setDepartments(await deptRes.json());
//         if (leaveRes.ok) setLeaves(await leaveRes.json());
//         if (attendRes.ok) setAttendance(await attendRes.json());
        
//       } catch (err) {
//         console.error("Error fetching admin data:", err);
//       } finally { 
//         setLoading(false);
//       }
//     }

//     fetchAdminData();
//     return () => clearInterval(intervalId);
//   }, []);

//   const handleLeaveAction = async (id: number, status: string) => {
//     try {
//       const res = await fetch(`${API_LEAVE}/admin/leaves/${id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ 
//           status: status === "APPROVED" ? "Approved" : "Rejected", 
//           reviewer: currentAdminName 
//         })
//       });
//       if (res.ok) {
//         alert(`Leave request ${status.toLowerCase()} successfully!`);
//         await fetchLeavesOnly(); 
//       } else {
//         alert("Action failed on database update.");
//       }
//     } catch (err) {
//       console.error("Error updating leave action:", err);
//     }
//   };

//   const handleAddDepartment = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newDeptName.trim()) return;
//     setIsSubmitting(true);
//     try {
//       const res = await fetch(`${API_BASE}/departments`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ department_name: newDeptName, manager_name: newManagerName || "Unassigned", annual_budget: parseFloat(newBudget) || 0, members_count: 0 }),
//       });
//       if (res.ok) {
//         setNewDeptName(""); setNewManagerName(""); setNewBudget(""); setIsModalOpen(false);
//         const resDept = await fetch(`${API_BASE}/departments`);
//         if (resDept.ok) setDepartments(await resDept.json());
//       }
//     } catch (err) { console.error(err); } finally { setIsSubmitting(false); }
//   };

//   if (loading) return <div className="flex min-h-screen items-center justify-center bg-[#0d0e12] text-white font-semibold">Loading HRMS Admin Engine...</div>;

//   const displayTotalEmployees = employees.length > 0 ? employees.length : (stats?.total_employees || 0);
//   const displayTotalDepartments = departments.length > 0 ? departments.length : (stats?.total_departments || 0);
//   const displayPendingLeaves = leaves.filter((l: any) => l.status?.toUpperCase() === "PENDING").length;

//   return (
//     <div className="flex min-h-screen bg-[#0d0e12] text-white overflow-hidden select-none">
      
//       {/* Sidebar Navigation */}
//       <aside className="w-64 bg-[#14161f] border-r border-gray-800 flex flex-col justify-between p-6 shrink-0 h-screen overflow-hidden">
//         <div>
//           <div className="flex items-center gap-3 mb-10">
//             <div className="h-9 w-9 rounded-xl bg-purple-600 flex items-center justify-center font-bold">H</div>
//             <h1 className="font-bold text-lg leading-none">HRMS</h1>
//           </div>

//           <nav className="space-y-2">
//             {[
//               { id: "dashboard", label: "Dashboard", icon: "📊" },
//               { id: "employees", label: "Employees", icon: "👥" },
//               { id: "departments", label: "Departments", icon: "🏢" },
//               { id: "leave", label: "Leave Requests", icon: "📅" },
//               { id: "attendance", label: "Attendance", icon: "⏱️" },
//             ].map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition text-sm font-medium cursor-pointer ${
//                   activeTab === tab.id ? "bg-purple-600 text-white font-semibold shadow-lg shadow-purple-600/20" : "text-gray-400 hover:bg-[#1c1e2a] hover:text-white"
//                 }`}
//               >
//                 <span>{tab.icon}</span> {tab.label}
//               </button>
//             ))}
//           </nav>
//         </div>
//         <div className="pt-4 border-t border-gray-800/60">
//           <button onClick={logout} className="w-full flex items-center gap-4 px-4 py-2 rounded-xl text-red-400 hover:bg-red-500/10 transition text-sm font-medium cursor-pointer"><span>🚪</span> Sign Out</button>
//         </div>
//       </aside>

//       {/* Main Container */}
//       <main className="flex-1 p-8 overflow-y-auto h-screen">
        
//         {/* Header Section */}
//         <header className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
//           <div>
//             <p className="text-xs text-gray-500 uppercase font-medium tracking-wider mb-0.5">System Live Clock</p>
//             <h2 className="text-sm font-semibold text-purple-400 font-mono">{liveTime || "Syncing..."}</h2>
//           </div>
//           <div className="flex items-center gap-3">
//             <div className="text-right">
//               <p className="text-sm font-semibold">{currentAdminName}</p>
//               <p className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Admin Role</p>
//             </div>
//             <div className="h-10 w-10 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center font-bold text-purple-400">{adminInitials}</div>
//           </div>
//         </header>

//         {activeTab === "dashboard" && (
//           <div className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//               <div className="bg-[#14161f] p-5 rounded-2xl border border-gray-800"><p className="text-xs text-gray-500 uppercase font-medium">Total Employees</p><p className="text-3xl font-bold mt-2 text-purple-400">{displayTotalEmployees}</p></div>
//               <div className="bg-[#14161f] p-5 rounded-2xl border border-gray-800"><p className="text-xs text-gray-500 uppercase font-medium">Departments</p><p className="text-3xl font-bold mt-2 text-emerald-400">{displayTotalDepartments}</p></div>
//               <div className="bg-[#14161f] p-5 rounded-2xl border border-gray-800"><p className="text-xs text-gray-500 uppercase font-medium">Pending Leaves</p><p className="text-3xl font-bold mt-2 text-amber-400">{displayPendingLeaves}</p></div>
//               <div className="bg-[#14161f] p-5 rounded-2xl border border-gray-800"><p className="text-xs text-gray-500 uppercase font-medium">Today's Attendance</p><p className="text-3xl font-bold mt-2 text-blue-400">{attendance.length}/{displayTotalEmployees}</p></div>
//             </div>
//           </div>
//         )}

//         {/* Leave Panel */}
//         {activeTab === "leave" && (
//           <div className="space-y-6 animate-fadeIn">
//             <div className="bg-[#14161f] p-6 rounded-2xl border border-gray-800">
//               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
//                 <div>
//                   <h3 className="text-lg font-bold text-white flex items-center gap-2">
//                     <span className="text-amber-400">📅</span> Master Leave Authorization Logs
//                   </h3>
//                   <p className="text-xs text-gray-500">Database table se user_id map karke live employees ke real tracks yahan rander ho rhe h.</p>
//                 </div>
//                 <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold rounded-lg uppercase tracking-wider">
//                   {displayPendingLeaves} Pending Actions
//                 </span>
//               </div>

//               {leaves.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-gray-800 rounded-xl bg-[#0d0e12]/40">
//                   <p className="text-sm font-medium text-gray-400">No leave requests found inside database network.</p>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {leaves.map((leave: any, index: number) => {
//                     const matchEmp = employees.find((e: any) => e.user_id === leave.user_id);
                    
//                     const employeeFullName = matchEmp 
//                       ? `${matchEmp.first_name || matchEmp.name || ""} ${matchEmp.last_name || ""}`.trim()
//                       : (leave.user_id === 1 ? "Divit" : `Staff Member (ID: ${leave.user_id})`);

//                     const durationTimeline = `${leave.start_date || ""} to ${leave.end_date || ""}`;
//                     const currentStatus = leave.status?.toUpperCase() || "PENDING";

//                     return (
//                       <div 
//                         key={leave.leave_id || index} 
//                         className="bg-[#1c1e2a] border border-gray-800 hover:border-gray-700 rounded-xl p-5 flex flex-col justify-between transition shadow-md group"
//                       >
//                         <div>
//                           <div className="flex justify-between items-start mb-3">
//                             <div>
//                               <h4 className="font-bold text-sm text-white group-hover:text-purple-400 transition-colors">
//                                 {employeeFullName}
//                               </h4>
//                               <span className="inline-block mt-1 px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 rounded text-[10px] font-bold text-purple-400 uppercase tracking-wider">
//                                 {leave.leave_type}
//                               </span>
//                             </div>
//                             <div className="text-right">
//                               <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Duration Log</p>
//                               <p className="text-xs text-gray-400 font-mono mt-0.5">{durationTimeline}</p>
//                             </div>
//                           </div>
                          
//                           <div className="bg-[#0d0e12]/50 rounded-lg p-3 border border-gray-800/40 my-3">
//                             <p className="text-[9px] text-gray-500 uppercase font-bold tracking-wider mb-1">Statement Reason</p>
//                             <p className="text-xs text-gray-300 italic">"{leave.reason || "No context attached"}"</p>
//                           </div>
//                         </div>

//                         <div className="flex gap-2 justify-end pt-3 border-t border-gray-800/40 mt-2">
//                           {currentStatus === "PENDING" ? (
//                             <>
//                               <button 
//                                 onClick={() => handleLeaveAction(leave.leave_id, "REJECTED")} 
//                                 className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition cursor-pointer"
//                               >
//                                 Reject
//                               </button>
//                               <button 
//                                 onClick={() => handleLeaveAction(leave.leave_id, "APPROVED")} 
//                                 className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-bold hover:bg-emerald-500 hover:text-white transition cursor-pointer"
//                               >
//                                 Approve Token
//                               </button>
//                             </>
//                           ) : (
//                             <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
//                               currentStatus === "APPROVED" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
//                             }`}>
//                               ● {leave.status}
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

"use client"; 
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard"); 
  
  const [stats, setStats] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [liveTime, setLiveTime] = useState("");

  // Admin name tracker
  const [currentAdminName, setCurrentAdminName] = useState("Admin");

  // Modal form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDeptName, setNewDeptName] = useState("");
  const [newManagerName, setNewManagerName] = useState("");
  const [newBudget, setNewBudget] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_BASE = "http://127.0.0.1:8000/api/v1/admin";
  const API_LEAVE = "http://127.0.0.1:8000/api/v1/leave"; 

  const fetchLeavesOnly = async () => {
    try {
      const res = await fetch(`${API_LEAVE}/all-requests`);
      if (res.ok) setLeaves(await res.json());
    } catch (err) {
      console.error("Error refreshing leaves:", err);
    }
  };

  useEffect(() => {
    if (user?.name) {
      setCurrentAdminName(user.name);
    } else {
      const localName = localStorage.getItem("user_name");
      if (localName) setCurrentAdminName(localName);
    }
  }, [user]);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      setLiveTime(`${now.toLocaleDateString('en-US', options)} | ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}`);
    };

    updateClock(); 
    const intervalId = setInterval(updateClock, 1000); 

    async function fetchAdminData() {
      try {
        const [statsRes, empRes, deptRes, leaveRes, attendRes] = await Promise.all([
          fetch(`${API_BASE}/dashboard-stats`),
          fetch(`${API_BASE}/employees`),
          fetch(`${API_BASE}/departments`),
          fetch(`${API_LEAVE}/all-requests`), 
          fetch(`${API_BASE}/attendance`)
        ]);

        if (statsRes.ok) setStats(await statsRes.json());
        if (empRes.ok) setEmployees(await empRes.json());
        if (deptRes.ok) setDepartments(await deptRes.json());
        if (leaveRes.ok) setLeaves(await leaveRes.json());
        if (attendRes.ok) setAttendance(await attendRes.json());
        
      } catch (err) {
        console.error("Error fetching admin data:", err);
      } finally { 
        setLoading(false);
      }
    }

    fetchAdminData();
    return () => clearInterval(intervalId);
  }, []);

  const handleLeaveAction = async (id: number, status: string) => {
    try {
      const res = await fetch(`${API_LEAVE}/admin/leaves/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          status: status === "APPROVED" ? "Approved" : "Rejected", 
          reviewer: currentAdminName 
        })
      });
      if (res.ok) {
        alert(`Leave request ${status.toLowerCase()} successfully!`);
        await fetchLeavesOnly(); 
      } else {
        alert("Action failed on database update.");
      }
    } catch (err) {
      console.error("Error updating leave action:", err);
    }
  };

  const handleAddDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/departments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ department_name: newDeptName, manager_name: newManagerName || "Unassigned", annual_budget: parseFloat(newBudget) || 0, members_count: 0 }),
      });
      if (res.ok) {
        setNewDeptName(""); setNewManagerName(""); setNewBudget(""); setIsModalOpen(false);
        const resDept = await fetch(`${API_BASE}/departments`);
        if (resDept.ok) setDepartments(await resDept.json());
      }
    } catch (err) { console.error(err); } finally { setIsSubmitting(false); }
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-[#0d0e12] text-white font-semibold tracking-wide">Loading HRMS System Architecture...</div>;

  const displayTotalEmployees = employees.length > 0 ? employees.length : (stats?.total_employees || 0);
  const displayTotalDepartments = departments.length > 0 ? departments.length : (stats?.total_departments || 0);
  const displayPendingLeaves = leaves.filter((l: any) => l.status?.toUpperCase() === "PENDING").length;

  return (
    <div className="flex min-h-screen bg-[#090a0f] text-white overflow-hidden font-sans">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#0d0f17] border-r border-gray-800/60 flex flex-col justify-between p-5 shrink-0 h-screen">
        <div>
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold shadow-md shadow-indigo-600/20 text-sm">H</div>
            <div>
              <h1 className="font-bold text-sm tracking-wide leading-none">HRMS</h1>
              <span className="text-[10px] text-gray-500 font-medium">ACME CORP LTD</span>
            </div>
          </div>

          <nav className="space-y-1">
            {[
              { id: "dashboard", label: "Dashboard", icon: "📊" },
              { id: "employees", label: "Employees", icon: "👥" },
              { id: "departments", label: "Departments", icon: "🏢" },
              { id: "leave", label: "Leave Requests", icon: "📅" },
              { id: "attendance", label: "Attendance", icon: "⏱️" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl transition text-xs font-semibold cursor-pointer ${
                  activeTab === tab.id ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" : "text-gray-400 hover:bg-[#141724] hover:text-white"
                }`}
              >
                <span className="text-sm">{tab.icon}</span> {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar Bottom Profile */}
        <div className="pt-4 border-t border-gray-800/50 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="h-8 w-8 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center font-bold text-xs text-indigo-400">
              {currentAdminName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-bold leading-none">{currentAdminName}</p>
              <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider">Admin</span>
            </div>
          </div>
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-red-400 hover:bg-red-500/10 transition text-xs font-semibold cursor-pointer">
            <span>🚪</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Framework View */}
      <main className="flex-1 p-8 overflow-y-auto h-screen bg-[#090a0f]">
        
        {/* Dynamic Global Navbar */}
        <header className="flex justify-between items-center mb-6 border-b border-gray-800/40 pb-4">
          <h2 className="text-xs font-semibold text-gray-400 tracking-wider font-mono">{liveTime}</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input type="text" placeholder="Search anything..." className="bg-[#11131f] border border-gray-800 rounded-xl px-4 py-1.5 text-xs text-gray-300 placeholder-gray-500 w-56 focus:outline-none focus:border-indigo-500 transition" />
            </div>
            <div className="h-7 w-7 rounded-full bg-[#11131f] flex items-center justify-center text-xs border border-gray-800 cursor-pointer">🔔</div>
          </div>
        </header>

        {/* ---------------- DYNAMIC MAPPED PREMIUM DASHBOARD VIEW ---------------- */}
        {activeTab === "dashboard" && (
          <div className="space-y-5 animate-fadeIn">
            
            {/* 1. Welcoming Hero Section */}
            <div className="bg-gradient-to-r from-[#121424] to-[#171a30] border border-gray-800/80 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">Admin Portal</span>
                <h3 className="text-lg font-bold text-white mt-2">Welcome back, {currentAdminName}</h3>
                <p className="text-xs text-gray-400 mt-0.5">Manage employees, departments, leaves, and track attendance tracks.</p>
              </div>
              <div className="flex gap-2.5">
                <button onClick={() => setIsModalOpen(true)} className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-indigo-600/10 cursor-pointer">
                  ➕ Add Dept
                </button>
                <button onClick={() => alert("Report compiled via server log engine.")} className="px-3.5 py-2 bg-[#1b1e36] hover:bg-[#232747] text-gray-300 font-bold text-xs rounded-xl border border-gray-700/50 transition cursor-pointer">
                  📄 Export Report
                </button>
              </div>
            </div>

            {/* 2. Custom Metrics Grid Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              {/* Box 1: Total Employees */}
              <div className="bg-[#0e111d] border border-gray-800/80 rounded-2xl p-5 flex justify-between items-start">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Total Employees</p>
                  <p className="text-3xl font-extrabold mt-2 tracking-tight text-white">{displayTotalEmployees}</p>
                  <span className="text-[10px] text-emerald-400 font-semibold block mt-2">● Live synced cluster</span>
                </div>
                <div className="h-8 w-8 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-sm">👥</div>
              </div>

              {/* Box 2: Departments */}
              <div className="bg-[#0e111d] border border-gray-800/80 rounded-2xl p-5 flex justify-between items-start">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Departments</p>
                  <p className="text-3xl font-extrabold mt-2 tracking-tight text-white">{displayTotalDepartments}</p>
                  <span className="text-[10px] text-gray-400 font-medium block mt-2">● Active workspace units</span>
                </div>
                <div className="h-8 w-8 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-sm">🏢</div>
              </div>

              {/* Box 3: Pending Leaves */}
              <div className="bg-[#0e111d] border border-gray-800/80 rounded-2xl p-5 flex justify-between items-start">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Pending Leaves</p>
                  <p className="text-3xl font-extrabold mt-2 tracking-tight text-white">{displayPendingLeaves}</p>
                  <span className="text-[10px] text-amber-400 font-semibold block mt-2">● Needs admin review</span>
                </div>
                <div className="h-8 w-8 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-sm">📅</div>
              </div>

              {/* Box 4: Attendance Stats */}
              <div className="bg-[#0e111d] border border-gray-800/80 rounded-2xl p-5 flex justify-between items-start">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Today's Attendance</p>
                  <p className="text-3xl font-extrabold mt-2 tracking-tight text-white">{attendance.length}/{displayTotalEmployees}</p>
                  <span className="text-[10px] text-blue-400 font-semibold block mt-2">● Realtime punch logs</span>
                </div>
                <div className="h-8 w-8 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-sm">⏱️</div>
              </div>
            </div>

            {/* 3. Bottom Grid: Quick Actions vs Recent Activity Logs */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
              
              {/* Left Column: Quick Access (Span 2) */}
              <div className="lg:col-span-2 space-y-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">Quick Access</h4>
                <div className="grid grid-cols-1 gap-2.5">
                  
                  <div onClick={() => setActiveTab("employees")} className="bg-[#0e111d] border border-gray-800/60 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:border-gray-700 transition">
                    <div className="flex items-center gap-3.5">
                      <div className="h-8 w-8 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex items-center justify-center text-sm">👥</div>
                      <div>
                        <h5 className="text-xs font-bold text-gray-200">Employees</h5>
                        <p className="text-[10px] text-gray-500 mt-0.5">Manage organization profiles</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-600">➔</span>
                  </div>

                  <div onClick={() => setActiveTab("departments")} className="bg-[#0e111d] border border-gray-800/60 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:border-gray-700 transition">
                    <div className="flex items-center gap-3.5">
                      <div className="h-8 w-8 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center text-sm">🏢</div>
                      <div>
                        <h5 className="text-xs font-bold text-gray-200">Departments</h5>
                        <p className="text-[10px] text-gray-500 mt-0.5">Structure & budget allocations</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-600">➔</span>
                  </div>

                  <div onClick={() => setActiveTab("leave")} className="bg-[#0e111d] border border-gray-800/60 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:border-gray-700 transition">
                    <div className="flex items-center gap-3.5">
                      <div className="h-8 w-8 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center justify-center text-sm">📅</div>
                      <div>
                        <h5 className="text-xs font-bold text-gray-200">Leave Manager</h5>
                        <p className="text-[10px] text-gray-500 mt-0.5">Apply & approve requests</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-600">➔</span>
                  </div>

                  <div onClick={() => setActiveTab("attendance")} className="bg-[#0e111d] border border-gray-800/60 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:border-gray-700 transition">
                    <div className="flex items-center gap-3.5">
                      <div className="h-8 w-8 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center text-sm">⏱️</div>
                      <div>
                        <h5 className="text-xs font-bold text-gray-200">Attendance Tracker</h5>
                        <p className="text-[10px] text-gray-500 mt-0.5">Punch check and log tracking</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-600">➔</span>
                  </div>

                </div>
              </div>

              {/* Right Column: Dynamic System Recent Activities (Span 3) */}
              <div className="lg:col-span-3 bg-[#0e111d] border border-gray-800/80 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs text-indigo-400">⚡</span>
                    <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider">Recent Activity</h4>
                  </div>
                  
                  {/* Dynamic Feed compiled directly through system arrays */}
                  <div className="space-y-4 font-mono text-[11px] text-gray-400">
                    <div className="border-l-2 border-indigo-500/40 pl-3 py-0.5">
                      <p className="text-gray-200 font-medium"><span className="text-indigo-400">System Log:</span> Admin session successfully compiled.</p>
                      <span className="text-[9px] text-gray-600 block mt-0.5">JUST NOW</span>
                    </div>

                    {leaves.length > 0 && (
                      <div className="border-l-2 border-amber-500/40 pl-3 py-0.5">
                        <p className="text-gray-200 font-medium">Total <span className="text-amber-400">{leaves.length} Leave records</span> verified inside memory tables.</p>
                        <span className="text-[9px] text-gray-600 block mt-0.5">UPDATED TODAY</span>
                      </div>
                    )}

                    {attendance.length > 0 ? (
                      <div className="border-l-2 border-blue-500/40 pl-3 py-0.5">
                        <p className="text-gray-200 font-medium">Punch synchronization engine cached <span className="text-blue-400">{attendance.length} check-ins</span>.</p>
                        <span className="text-[9px] text-gray-600 block mt-0.5">LIVE LOGS</span>
                      </div>
                    ) : (
                      <div className="border-l-2 border-gray-700 pl-3 py-0.5">
                        <p className="text-gray-500">No shift actions checked in on central server clusters today.</p>
                        <span className="text-[9px] text-gray-600 block mt-0.5">YESTERDAY</span>
                      </div>
                    )}

                    <div className="border-l-2 border-emerald-500/40 pl-3 py-0.5">
                      <p className="text-gray-200 font-medium">Data structural node linked up with Fast API server at port <span className="text-emerald-400">8000</span>.</p>
                      <span className="text-[9px] text-gray-600 block mt-0.5">STABLE FRAMEWORK</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-800/40 text-[10px] text-gray-500 text-right font-medium">
                  HRMS Engine v1.2.0 • Operations secured
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ---------------- EMPLOYEES GRID VIEW ---------------- */}
        {activeTab === "employees" && (
          <div className="bg-[#0e111d] p-6 rounded-2xl border border-gray-800/80 animate-fadeIn">
            <h3 className="text-sm font-bold mb-4 tracking-wide">👥 Workspace Cluster Records</h3>
            {employees.length === 0 ? (
              <p className="text-xs text-gray-500 italic">No staff logs stored inside database node.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                      <th className="py-3 px-4">User ID</th>
                      <th className="py-3 px-4">First Name</th>
                      <th className="py-3 px-4">Department</th>
                      <th className="py-3 px-4">Email Address</th>
                      <th className="py-3 px-4">System Access</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/30">
                    {employees.map((emp: any, i: number) => (
                      <tr key={emp.user_id || i} className="hover:bg-[#141724]/40 transition">
                        <td className="py-3 px-4 font-mono text-indigo-400">{emp.user_id}</td>
                        <td className="py-3 px-4 font-semibold text-gray-200">{emp.first_name || emp.name || "N/A"}</td>
                        <td className="py-3 px-4 text-gray-400">{emp.department || "General"}</td>
                        <td className="py-3 px-4 font-mono text-gray-400">{emp.email}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] uppercase font-bold rounded">
                            {emp.role || "Employee"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ---------------- DEPARTMENTS PANELS ---------------- */}
        {activeTab === "departments" && (
          <div className="bg-[#0e111d] p-6 rounded-2xl border border-gray-800/80 animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold tracking-wide">🏢 Functional Infrastructure Sectors</h3>
              <button onClick={() => setIsModalOpen(true)} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer">
                + Create Department
              </button>
            </div>
            {departments.length === 0 ? (
              <p className="text-xs text-gray-500 italic">No operational units allocated on mainframes.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {departments.map((dept: any, i: number) => (
                  <div key={dept.id || i} className="p-4 bg-[#141724] border border-gray-800 rounded-xl">
                    <h4 className="font-bold text-xs text-indigo-400 mb-1">{dept.department_name}</h4>
                    <p className="text-[11px] text-gray-400">Sector Leader: <span className="text-gray-200 font-medium">{dept.manager_name}</span></p>
                    <p className="text-[10px] text-gray-500 mt-2 font-mono">Budget: ${dept.annual_budget || 0}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ---------------- ATTENDANCE CLUSTER LOGS ---------------- */}
        {activeTab === "attendance" && (
          <div className="bg-[#0e111d] p-6 rounded-2xl border border-gray-800/80 animate-fadeIn">
            <h3 className="text-sm font-bold mb-4 tracking-wide">⏱️ Live Matrix Stream</h3>
            {attendance.length === 0 ? (
              <div className="py-12 border border-dashed border-gray-800 text-center rounded-xl">
                <p className="text-xs text-gray-500">No telemetry checkpoints recorded for today.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                      <th className="py-3 px-4">Record ID</th>
                      <th className="py-3 px-4">Employee ID</th>
                      <th className="py-3 px-4">Verification Checkpoint</th>
                      <th className="py-3 px-4">Network Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/30 font-mono text-xs">
                    {attendance.map((att: any, i: number) => (
                      <tr key={i} className="hover:bg-[#141724]/40">
                        <td className="py-3 px-4 text-gray-500">#{att.id || i+401}</td>
                        <td className="py-3 px-4 text-indigo-400">UID-{att.user_id}</td>
                        <td className="py-3 px-4 text-emerald-400">{att.timestamp || att.date || "Logged"}</td>
                        <td className="py-3 px-4"><span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase">Success</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ---------------- LEAVE AUTHORIZATION MANAGER ---------------- */}
        {activeTab === "leave" && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-[#0e111d] p-6 rounded-2xl border border-gray-800/80">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>📅</span> Master Leave Authorization Logs
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">Process real-time structured exceptions and tokens below.</p>
                </div>
                <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                  {displayPendingLeaves} Actions Required
                </span>
              </div>

              {leaves.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-gray-800 rounded-xl">
                  <p className="text-xs text-gray-500">No requests floating on database nodes.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {leaves.map((leave: any, index: number) => {
                    const matchEmp = employees.find((e: any) => e.user_id === leave.user_id);
                    const employeeFullName = matchEmp 
                      ? `${matchEmp.first_name || matchEmp.name || ""} ${matchEmp.last_name || ""}`.trim()
                      : (leave.user_id === 1 ? "Divit" : `Staff Member (ID: ${leave.user_id})`);

                    const durationTimeline = `${leave.start_date || ""} to ${leave.end_date || ""}`;
                    const currentStatus = leave.status?.toUpperCase() || "PENDING";

                    return (
                      <div key={leave.leave_id || index} className="bg-[#141724] border border-gray-800/80 hover:border-gray-700 rounded-xl p-5 flex flex-col justify-between transition shadow-sm group">
                        <div>
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-bold text-xs text-white group-hover:text-indigo-400 transition-colors">
                                {employeeFullName}
                              </h4>
                              <span className="inline-block mt-1 px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded text-[9px] font-bold text-indigo-400 uppercase tracking-wider">
                                {leave.leave_type}
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Duration Log</p>
                              <p className="text-xs text-gray-400 font-mono mt-0.5">{durationTimeline}</p>
                            </div>
                          </div>
                          
                          <div className="bg-[#090a0f]/80 rounded-lg p-3 border border-gray-800/40 my-3">
                            <p className="text-[9px] text-gray-500 uppercase font-bold tracking-wider mb-1">Statement Reason</p>
                            <p className="text-xs text-gray-300 italic">"{leave.reason || "No context attached"}"</p>
                          </div>
                        </div>

                        <div className="flex gap-2 justify-end pt-3 border-t border-gray-800/40 mt-2">
                          {currentStatus === "PENDING" ? (
                            <>
                              <button onClick={() => handleLeaveAction(leave.leave_id, "REJECTED")} className="px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition cursor-pointer">Reject</button>
                              <button onClick={() => handleLeaveAction(leave.leave_id, "APPROVED")} className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-bold hover:bg-emerald-500 hover:text-white transition cursor-pointer">Approve Token</button>
                            </>
                          ) : (
                            <span className={`inline-block px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                              currentStatus === "APPROVED" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                            }`}>
                              ● {leave.status}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* MODAL WINDOW */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[#0e111d] border border-gray-800 w-full max-w-sm rounded-2xl p-5">
            <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-4">Create Sector Entry</h3>
            <form onSubmit={handleAddDepartment} className="space-y-3">
              <div>
                <label className="block text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Department Name</label>
                <input type="text" value={newDeptName} onChange={(e) => setNewDeptName(e.target.value)} required className="w-full bg-[#141724] border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500" placeholder="E.g. Engineering" />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Manager Name</label>
                <input type="text" value={newManagerName} onChange={(e) => setNewManagerName(e.target.value)} className="w-full bg-[#141724] border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500" placeholder="E.g. Shruti Sharma" />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Annual Budget ($)</label>
                <input type="number" value={newBudget} onChange={(e) => setNewBudget(e.target.value)} className="w-full bg-[#141724] border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500" placeholder="75000" />
              </div>
              <div className="flex justify-end gap-2 pt-2 text-xs font-bold">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-3 py-1.5 text-gray-400 hover:text-white transition">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition">{isSubmitting ? "Saving..." : "Commit"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}






