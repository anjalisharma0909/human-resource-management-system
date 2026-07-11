// "use client"; 
// import React, { useEffect, useState } from "react";
// import { useAuth } from "@/context/AuthContext";

// export default function AdminDashboard() {
//   const { user, logout } = useAuth();
//   const [activeTab, setActiveTab] = useState("dashboard"); 
  
//   const [stats, setStats] = useState<any>(null);
//   const [employees, setEmployees] = useState<any[]>([]);
//   const [departments, setDepartments] = useState<any[]>([]);
//   const [leaves, setLeaves] = useState<any[]>([]);
//   const [attendance, setAttendance] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [liveTime, setLiveTime] = useState("");

//   // Admin name tracker
//   const [currentAdminName, setCurrentAdminName] = useState("Admin");

//   // Modal form states
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [newDeptName, setNewDeptName] = useState("");
//   const [newManagerName, setNewManagerName] = useState("");
//   const [newBudget, setNewBudget] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const API_BASE = "http://127.0.0.1:8000/api/v1/admin";
//   const API_LEAVE = "http://127.0.0.1:8000/api/v1/leave"; 

//   const fetchLeavesOnly = async () => {
//     try {
//       const res = await fetch(`${API_LEAVE}/all-requests`);
//       if (res.ok) setLeaves(await res.json());
//     } catch (err) {
//       console.error("Error refreshing leaves:", err);
//     }
//   };

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

//   if (loading) return <div className="flex min-h-screen items-center justify-center bg-[#0d0e12] text-white font-semibold tracking-wide">Loading HRMS System Architecture...</div>;

//   const displayTotalEmployees = employees.length > 0 ? employees.length : (stats?.total_employees || 0);
//   const displayTotalDepartments = departments.length > 0 ? departments.length : (stats?.total_departments || 0);
//   const displayPendingLeaves = leaves.filter((l: any) => l.status?.toUpperCase() === "PENDING").length;

//   return (
//     <div className="flex min-h-screen bg-[#090a0f] text-white overflow-hidden font-sans">
      
//       {/* Sidebar Navigation */}
//       <aside className="w-64 bg-[#0d0f17] border-r border-gray-800/60 flex flex-col justify-between p-5 shrink-0 h-screen">
//         <div>
//           <div className="flex items-center gap-3 mb-8 px-2">
//             <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold shadow-md shadow-indigo-600/20 text-sm">H</div>
//             <div>
//               <h1 className="font-bold text-sm tracking-wide leading-none">HRMS</h1>
//               <span className="text-[10px] text-gray-500 font-medium">ACME CORP LTD</span>
//             </div>
//           </div>

//           <nav className="space-y-1">
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
//                 className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl transition text-xs font-semibold cursor-pointer ${
//                   activeTab === tab.id ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" : "text-gray-400 hover:bg-[#141724] hover:text-white"
//                 }`}
//               >
//                 <span className="text-sm">{tab.icon}</span> {tab.label}
//               </button>
//             ))}
//           </nav>
//         </div>

//         {/* Sidebar Bottom Profile */}
//         <div className="pt-4 border-t border-gray-800/50 space-y-3">
//           <div className="flex items-center gap-3 px-2">
//             <div className="h-8 w-8 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center font-bold text-xs text-indigo-400">
//               {currentAdminName.slice(0, 2).toUpperCase()}
//             </div>
//             <div>
//               <p className="text-xs font-bold leading-none">{currentAdminName}</p>
//               <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider">Admin</span>
//             </div>
//           </div>
//           <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-red-400 hover:bg-red-500/10 transition text-xs font-semibold cursor-pointer">
//             <span>🚪</span> Sign Out
//           </button>
//         </div>
//       </aside>

//       {/* Main Framework View */}
//       <main className="flex-1 p-8 overflow-y-auto h-screen bg-[#090a0f]">
        
//         {/* Dynamic Global Navbar */}
//         <header className="flex justify-between items-center mb-6 border-b border-gray-800/40 pb-4">
//           <h2 className="text-xs font-semibold text-gray-400 tracking-wider font-mono">{liveTime}</h2>
//           <div className="flex items-center gap-4">
//             <div className="relative">
//               <input type="text" placeholder="Search anything..." className="bg-[#11131f] border border-gray-800 rounded-xl px-4 py-1.5 text-xs text-gray-300 placeholder-gray-500 w-56 focus:outline-none focus:border-indigo-500 transition" />
//             </div>
//           </div>
//         </header>

        
//         {activeTab === "dashboard" && (
//           <div className="space-y-5 animate-fadeIn">
            
            
//             <div className="bg-gradient-to-r from-[#121424] to-[#171a30] border border-gray-800/80 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//               <div>
//                 <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">Admin Portal</span>
//                 <h3 className="text-lg font-bold text-white mt-2">Welcome back, {currentAdminName}</h3>
                
//               </div>
//               <div className="flex gap-2.5">
//                 {/* <button onClick={() => setIsModalOpen(true)} className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-indigo-600/10 cursor-pointer">
//                   ➕ Add Dept
//                 </button>
//                 <button onClick={() => alert("Report compiled via server log engine.")} className="px-3.5 py-2 bg-[#1b1e36] hover:bg-[#232747] text-gray-300 font-bold text-xs rounded-xl border border-gray-700/50 transition cursor-pointer">
//                   📄 Export Report
//                 </button> */}
//               </div>
//             </div>

//             {/* 2. Custom Metrics Grid Row */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
//               {/* Box 1: Total Employees */}
//               <div className="bg-[#0e111d] border border-gray-800/80 rounded-2xl p-5 flex justify-between items-start">
//                 <div>
//                   <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Total Employees</p>
//                   <p className="text-3xl font-extrabold mt-2 tracking-tight text-white">{displayTotalEmployees}</p>
//                   <span className="text-[10px] text-emerald-400 font-semibold block mt-2">● Live </span>
//                 </div>
//                 <div className="h-8 w-8 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-sm">👥</div>
//               </div>

//               {/* Box 2: Departments */}
//               <div className="bg-[#0e111d] border border-gray-800/80 rounded-2xl p-5 flex justify-between items-start">
//                 <div>
//                   <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Departments</p>
//                   <p className="text-3xl font-extrabold mt-2 tracking-tight text-white">{displayTotalDepartments}</p>
//                   <span className="text-[10px] text-gray-400 font-medium block mt-2">● Active workspace units</span>
//                 </div>
//                 <div className="h-8 w-8 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-sm">🏢</div>
//               </div>

//               {/* Box 3: Pending Leaves */}
//               <div className="bg-[#0e111d] border border-gray-800/80 rounded-2xl p-5 flex justify-between items-start">
//                 <div>
//                   <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Pending Leaves</p>
//                   <p className="text-3xl font-extrabold mt-2 tracking-tight text-white">{displayPendingLeaves}</p>
//                   <span className="text-[10px] text-amber-400 font-semibold block mt-2">● Needs admin review</span>
//                 </div>
//                 <div className="h-8 w-8 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-sm">📅</div>
//               </div>

//               {/* Box 4: Attendance Stats */}
//               <div className="bg-[#0e111d] border border-gray-800/80 rounded-2xl p-5 flex justify-between items-start">
//                 <div>
//                   <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Today's Attendance</p>
//                   <p className="text-3xl font-extrabold mt-2 tracking-tight text-white">{attendance.length}/{displayTotalEmployees}</p>
//                   <span className="text-[10px] text-blue-400 font-semibold block mt-2">● Realtime punch logs</span>
//                 </div>
//                 <div className="h-8 w-8 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-sm">⏱️</div>
//               </div>
//             </div>

//             {/* 3. Bottom Grid: Quick Actions vs Recent Activity Logs */}
//             <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
              
//               {/* Left Column: Quick Access (Span 2) */}
//               <div className="lg:col-span-2 space-y-4">
//                 <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">Quick Access</h4>
//                 <div className="grid grid-cols-1 gap-2.5">
                  
//                   <div onClick={() => setActiveTab("employees")} className="bg-[#0e111d] border border-gray-800/60 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:border-gray-700 transition">
//                     <div className="flex items-center gap-3.5">
//                       <div className="h-8 w-8 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex items-center justify-center text-sm">👥</div>
//                       <div>
//                         <h5 className="text-xs font-bold text-gray-200">Employees</h5>
//                         <p className="text-[10px] text-gray-500 mt-0.5">Manage organization profiles</p>
//                       </div>
//                     </div>
//                     <span className="text-xs text-gray-600">➔</span>
//                   </div>

//                   <div onClick={() => setActiveTab("departments")} className="bg-[#0e111d] border border-gray-800/60 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:border-gray-700 transition">
//                     <div className="flex items-center gap-3.5">
//                       <div className="h-8 w-8 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center text-sm">🏢</div>
//                       <div>
//                         <h5 className="text-xs font-bold text-gray-200">Departments</h5>
//                         <p className="text-[10px] text-gray-500 mt-0.5">Structure & budget allocations</p>
//                       </div>
//                     </div>
//                     <span className="text-xs text-gray-600">➔</span>
//                   </div>

//                   <div onClick={() => setActiveTab("leave")} className="bg-[#0e111d] border border-gray-800/60 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:border-gray-700 transition">
//                     <div className="flex items-center gap-3.5">
//                       <div className="h-8 w-8 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center justify-center text-sm">📅</div>
//                       <div>
//                         <h5 className="text-xs font-bold text-gray-200">Leave Manager</h5>
//                         <p className="text-[10px] text-gray-500 mt-0.5">Apply & approve requests</p>
//                       </div>
//                     </div>
//                     <span className="text-xs text-gray-600">➔</span>
//                   </div>

//                   <div onClick={() => setActiveTab("attendance")} className="bg-[#0e111d] border border-gray-800/60 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:border-gray-700 transition">
//                     <div className="flex items-center gap-3.5">
//                       <div className="h-8 w-8 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center text-sm">⏱️</div>
//                       <div>
//                         <h5 className="text-xs font-bold text-gray-200">Attendance Tracker</h5>
//                         <p className="text-[10px] text-gray-500 mt-0.5">Punch check and log tracking</p>
//                       </div>
//                     </div>
//                     <span className="text-xs text-gray-600">➔</span>
//                   </div>

//                 </div>
//               </div>

//               {/* Right Column: Dynamic System Recent Activities (Span 3) */}
//               <div className="lg:col-span-3 bg-[#0e111d] border border-gray-800/80 rounded-2xl p-5 flex flex-col justify-between">
//                 <div>
//                   <div className="flex items-center gap-2 mb-4">
//                     <span className="text-xs text-indigo-400">⚡</span>
//                     <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider">Recent Activity</h4>
//                   </div>
                  
//                   {/* Dynamic Feed compiled directly through system arrays */}
//                   <div className="space-y-4 font-mono text-[11px] text-gray-400">
//                     <div className="border-l-2 border-indigo-500/40 pl-3 py-0.5">
//                       <p className="text-gray-200 font-medium"><span className="text-indigo-400">System Log:</span> Admin session successfully compiled.</p>
//                       <span className="text-[9px] text-gray-600 block mt-0.5">JUST NOW</span>
//                     </div>

//                     {leaves.length > 0 && (
//                       <div className="border-l-2 border-amber-500/40 pl-3 py-0.5">
//                         <p className="text-gray-200 font-medium">Total <span className="text-amber-400">{leaves.length} Leave records</span> verified inside memory tables.</p>
//                         <span className="text-[9px] text-gray-600 block mt-0.5">UPDATED TODAY</span>
//                       </div>
//                     )}

//                     {attendance.length > 0 ? (
//                       <div className="border-l-2 border-blue-500/40 pl-3 py-0.5">
//                         <p className="text-gray-200 font-medium">Punch synchronization engine cached <span className="text-blue-400">{attendance.length} check-ins</span>.</p>
//                         <span className="text-[9px] text-gray-600 block mt-0.5">LIVE LOGS</span>
//                       </div>
//                     ) : (
//                       <div className="border-l-2 border-gray-700 pl-3 py-0.5">
//                         <p className="text-gray-500">No shift actions checked in on central server clusters today.</p>
//                         <span className="text-[9px] text-gray-600 block mt-0.5">YESTERDAY</span>
//                       </div>
//                     )}

//                     <div className="border-l-2 border-emerald-500/40 pl-3 py-0.5">
//                       <p className="text-gray-200 font-medium">Data structural node linked up with Fast API server at port <span className="text-emerald-400">8000</span>.</p>
//                       <span className="text-[9px] text-gray-600 block mt-0.5">STABLE FRAMEWORK</span>
//                     </div>
//                   </div>
//                 </div>

                
//               </div>

//             </div>

//           </div>
//         )}

//         {/* ---------------- EMPLOYEES GRID VIEW ---------------- */}
//         {activeTab === "employees" && (
//           <div className="bg-[#0e111d] p-6 rounded-2xl border border-gray-800/80 animate-fadeIn">
//             <h3 className="text-sm font-bold mb-4 tracking-wide">👥 Workspace Cluster Records</h3>
//             {employees.length === 0 ? (
//               <p className="text-xs text-gray-500 italic">No staff logs stored inside database node.</p>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full text-left border-collapse text-xs">
//                   <thead>
//                     <tr className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
//                       <th className="py-3 px-4">First Name</th>
//                       <th className="py-3 px-4">Department</th>
//                       <th className="py-3 px-4">Email Address</th>
//                       <th className="py-3 px-4">System Access</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-800/30">
//                     {employees.map((emp: any, i: number) => (
//                       <tr key={emp.user_id || i} className="hover:bg-[#141724]/40 transition">
                       
//                         <td className="py-3 px-4 font-semibold text-gray-200">{emp.first_name || emp.name || "N/A"}</td>
//                         <td className="py-3 px-4 text-gray-400">{emp.department || "General"}</td>
//                         <td className="py-3 px-4 font-mono text-gray-400">{emp.email}</td>
//                         <td className="py-3 px-4">
//                           <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] uppercase font-bold rounded">
//                             {emp.role || "Employee"}
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         )}

//         {/* ---------------- DEPARTMENTS PANELS ---------------- */}
//         {activeTab === "departments" && (
//           <div className="bg-[#0e111d] p-6 rounded-2xl border border-gray-800/80 animate-fadeIn">
//             <div className="flex justify-between items-center mb-6">
//               <h3 className="text-sm font-bold tracking-wide">🏢 Functional Infrastructure Sectors</h3>
//               <button onClick={() => setIsModalOpen(true)} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer">
//                 + Create Department
//               </button>
//             </div>
//             {departments.length === 0 ? (
//               <p className="text-xs text-gray-500 italic">No operational units allocated on mainframes.</p>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 {departments.map((dept: any, i: number) => (
//                   <div key={dept.id || i} className="p-4 bg-[#141724] border border-gray-800 rounded-xl">
//                     <h4 className="font-bold text-xs text-indigo-400 mb-1">{dept.department_name}</h4>
//                     <p className="text-[11px] text-gray-400">Sector Leader: <span className="text-gray-200 font-medium">{dept.manager_name}</span></p>
//                     <p className="text-[10px] text-gray-500 mt-2 font-mono">Budget: ${dept.annual_budget || 0}</p>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {/* ---------------- ATTENDANCE CLUSTER LOGS ---------------- */}
//         {activeTab === "attendance" && (
//           <div className="bg-[#0e111d] p-6 rounded-2xl border border-gray-800/80 animate-fadeIn">
//             <h3 className="text-sm font-bold mb-4 tracking-wide">⏱️ Live Matrix Stream</h3>
//             {attendance.length === 0 ? (
//               <div className="py-12 border border-dashed border-gray-800 text-center rounded-xl">
//                 <p className="text-xs text-gray-500">No telemetry checkpoints recorded for today.</p>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full text-left border-collapse text-xs">
//                   <thead>
//                     <tr className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
//                       <th className="py-3 px-4">Record ID</th>
//                       <th className="py-3 px-4">Employee ID</th>
//                       <th className="py-3 px-4">Verification Checkpoint</th>
//                       <th className="py-3 px-4">Network Status</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-800/30 font-mono text-xs">
//                     {attendance.map((att: any, i: number) => (
//                       <tr key={i} className="hover:bg-[#141724]/40">
//                         <td className="py-3 px-4 text-gray-500">#{att.id || i+401}</td>
//                         <td className="py-3 px-4 text-indigo-400">UID-{att.user_id}</td>
//                         <td className="py-3 px-4 text-emerald-400">{att.timestamp || att.date || "Logged"}</td>
//                         <td className="py-3 px-4"><span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase">Success</span></td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         )}

//         {/* ---------------- LEAVE AUTHORIZATION MANAGER ---------------- */}
//         {activeTab === "leave" && (
//   <div className="bg-[#0e111d] p-6 rounded-2xl border border-gray-800/80 animate-fadeIn">
//     <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-800/60">
//       <div>
//         <h3 className="text-sm font-bold tracking-wide">📅 Leave Authorization Records</h3>
       
//       </div>
//       <span className="text-[11px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-lg font-bold">
//         {displayPendingLeaves} Pending
//       </span>
//     </div>

//     {leaves.length === 0 ? (
//       <p className="text-xs text-gray-500 italic py-4">No request logs circulating in database tables.</p>
//     ) : (
//       <div className="space-y-1">
        
//         {/* ---- DATA HEADINGS / TABLE HEADER ---- */}
//         <div className="hidden sm:flex items-center justify-between px-4 py-2.5 bg-[#141724]/40 rounded-xl border border-gray-800/40 text-[10px] font-bold uppercase tracking-wider text-gray-400 gap-4 mb-2">
//           <div className="flex flex-1 items-center gap-4 sm:gap-12">
//             <div className="w-56 shrink-0">Leave Type & Applicant</div>
//             <div className="w-48 shrink-0">Duration Timeline</div>
//             <div className="flex-1">Reason</div>
//           </div>
//           <div className="shrink-0 min-w-[120px] text-right pr-4">Action Status</div>
//         </div>

//         {/* ---- LEAVE DATA CARDS ---- */}
//         {leaves.map((leave: any, index: number) => {
//           const currentStatus = leave.status?.toUpperCase() || "PENDING";
//           const durationTimeline = `${leave.start_date || ""} to ${leave.end_date || ""}`;

//           const matchEmp = employees.find((e: any) => e.user_id === leave.user_id);
//           const employeeName = matchEmp 
//             ? `${matchEmp.first_name || matchEmp.name || ""} ${matchEmp.last_name || ""}`.trim()
//             : `User #${leave.user_id}`;

//           return (
//             <div 
//               key={leave.leave_id || index} 
//               className="flex flex-col sm:flex-row sm:items-center justify-between py-4 px-4 border-b border-gray-800/40 hover:bg-[#141724]/20 transition gap-4"
//             >
//               <div className="flex flex-1 flex-col sm:flex-row sm:items-center gap-4 sm:gap-12">
                
//                 {/* Leave Type and Employee Name */}
//                 <div className="w-56 shrink-0">
//                   <h4 className="text-xs font-bold text-white">
//                     {leave.leave_type || "General Leave"}
//                   </h4>
//                   <div className="mt-1 flex flex-col text-[11px] text-gray-400 gap-0.5">
//                     <span className="text-indigo-300 font-medium">By: {employeeName}</span>
//                   </div>
//                 </div>

//                 {/* Date Range */}
//                 <div className="w-48 shrink-0">
//                   <span className="text-xs font-medium text-indigo-400 font-mono">
//                     {durationTimeline}
//                   </span>
//                 </div>

//                 {/* Reason */}
//                 <div className="flex-1">
//                   <span className="text-xs text-gray-400">
//                     {leave.reason || "No reason specified"}
//                   </span>
//                 </div>
//               </div>

//               {/* Actions / Custom Badges */}
//               <div className="shrink-0 flex items-center justify-end min-w-[120px]">
//                 {currentStatus === "PENDING" ? (
//                   <div className="flex items-center gap-2">
//                     <button 
//                       onClick={() => handleLeaveAction(leave.leave_id, "REJECTED")}
//                       className="px-2.5 py-1 bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-900/50 rounded-lg text-[10px] font-bold uppercase transition cursor-pointer"
//                     >
//                       Reject
//                     </button>
//                     <button 
//                       onClick={() => handleLeaveAction(leave.leave_id, "APPROVED")}
//                       className="px-2.5 py-1 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-400 border border-emerald-900/50 rounded-lg text-[10px] font-bold uppercase transition cursor-pointer"
//                     >
//                       Approve
//                     </button>
//                     <span className="px-4 py-1.5 bg-amber-950/30 text-amber-500 border border-amber-500/30 text-xs font-bold rounded-lg uppercase tracking-wider min-w-[90px] text-center">
//                       PENDING
//                     </span>
//                   </div>
//                 ) : currentStatus === "APPROVED" ? (
//                   <span className="px-4 py-1.5 bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-lg uppercase tracking-wider min-w-[90px] text-center">
//                     APPROVED
//                   </span>
//                 ) : (
//                   <span className="px-4 py-1.5 bg-red-950/40 text-red-400 border border-red-500/30 text-xs font-bold rounded-lg uppercase tracking-wider min-w-[90px] text-center">
//                     REJECTED
//                   </span>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     )}
//   </div>
// )}
//       </main>

//       {/* MODAL WINDOW */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
//           <div className="bg-[#0e111d] border border-gray-800 w-full max-w-sm rounded-2xl p-5">
//             <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-4">Create Sector Entry</h3>
//             <form onSubmit={handleAddDepartment} className="space-y-3">
//               <div>
//                 <label className="block text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Department Name</label>
//                 <input type="text" value={newDeptName} onChange={(e) => setNewDeptName(e.target.value)} required className="w-full bg-[#141724] border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500" placeholder="E.g. Engineering" />
//               </div>
//               <div>
//                 <label className="block text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Manager Name</label>
//                 <input type="text" value={newManagerName} onChange={(e) => setNewManagerName(e.target.value)} className="w-full bg-[#141724] border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500" placeholder="E.g. Shruti Sharma" />
//               </div>
//               <div>
//                 <label className="block text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Annual Budget ($)</label>
//                 <input type="number" value={newBudget} onChange={(e) => setNewBudget(e.target.value)} className="w-full bg-[#141724] border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500" placeholder="75000" />
//               </div>
//               <div className="flex justify-end gap-2 pt-2 text-xs font-bold">
//                 <button type="button" onClick={() => setIsModalOpen(false)} className="px-3 py-1.5 text-gray-400 hover:text-white transition">Cancel</button>
//                 <button type="submit" disabled={isSubmitting} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition">{isSubmitting ? "Saving..." : "Commit"}</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
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
  const [currentAdminName, setCurrentAdminName] = useState("Admin");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDeptName, setNewDeptName] = useState("");
  const [newManagerName, setNewManagerName] = useState("");
  const [newBudget, setNewBudget] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_BASE = "http://127.0.0.1:8000/api/v1/admin";
  const API_LEAVE = "http://127.0.0.1:8000/api/v1/leave";

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
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      setLiveTime(
        `${now.toLocaleDateString("en-US", options)} | ${now.toLocaleTimeString(
          "en-US",
          {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          }
        )}`
      );
    };

    updateClock();
    const intervalId = setInterval(updateClock, 1000);

    async function fetchAdminData() {
      try {
        const [statsRes, empRes, deptRes, leaveRes, attendRes] =
          await Promise.all([
            fetch(`${API_BASE}/dashboard-stats`),
            fetch(`${API_BASE}/employees`),
            fetch(`${API_BASE}/departments`),
            fetch(`${API_LEAVE}/all-requests`),
            fetch(`${API_BASE}/attendance`),
          ]);

        if (statsRes.ok) setStats(await statsRes.json());
        if (empRes.ok) {
          const data = await empRes.json();
          setEmployees(Array.isArray(data) ? data : []);
        }
        if (deptRes.ok) {
          const data = await deptRes.json();
          setDepartments(Array.isArray(data) ? data : []);
        }
        if (leaveRes.ok) {
          const data = await leaveRes.json();
          setLeaves(Array.isArray(data) ? data : []);
        }
        if (attendRes.ok) {
          const data = await attendRes.json();
          setAttendance(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Error fetching admin data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAdminData();
    return () => clearInterval(intervalId);
  }, []);

  const fetchLeavesOnly = async () => {
    try {
      const res = await fetch(`${API_LEAVE}/all-requests`);
      if (res.ok) {
        const data = await res.json();
        setLeaves(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Error refreshing leaves:", err);
    }
  };

  const handleLeaveAction = async (id: number, status: string) => {
    try {
      const res = await fetch(`${API_LEAVE}/admin/leaves/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: status === "APPROVED" ? "Approved" : "Rejected",
          reviewer: currentAdminName,
        }),
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
        body: JSON.stringify({
          department_name: newDeptName,
          manager_name: newManagerName || "Unassigned",
          annual_budget: parseFloat(newBudget) || 0,
          members_count: 0,
        }),
      });
      if (res.ok) {
        setNewDeptName("");
        setNewManagerName("");
        setNewBudget("");
        setIsModalOpen(false);
        const resDept = await fetch(`${API_BASE}/departments`);
        if (resDept.ok) {
          const data = await resDept.json();
          setDepartments(Array.isArray(data) ? data : []);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0d0e12] text-white font-semibold">
        Loading HRMS System...
      </div>
    );
  }

  const totalEmployees = employees.length > 0 ? employees.length : stats?.total_employees || 0;
  const totalDepartments = departments.length > 0 ? departments.length : stats?.total_departments || 0;
  const pendingLeaves = leaves.filter((l: any) => l.status?.toUpperCase() === "PENDING").length;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex min-h-screen bg-[#090a0f] text-white overflow-hidden font-sans">
      {/* --- Sidebar --- */}
      <aside className="w-64 bg-[#0d0f17] border-r border-gray-800/60 flex flex-col justify-between p-5 shrink-0 h-screen">
        <div>
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold shadow-md shadow-indigo-600/20 text-sm">
              H
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-wide leading-none">HRMS</h1>
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
                  activeTab === tab.id
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                    : "text-gray-400 hover:bg-[#141724] hover:text-white"
                }`}
              >
                <span className="text-sm">{tab.icon}</span> {tab.label}
              </button>
            ))}
          </nav>
        </div>

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
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-red-400 hover:bg-red-500/10 transition text-xs font-semibold cursor-pointer"
          >
            <span>🚪</span> Sign Out
          </button>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 p-8 overflow-y-auto h-screen bg-[#090a0f]">
        {/* Header */}
        <header className="flex justify-between items-center mb-6 border-b border-gray-800/40 pb-4">
          <h2 className="text-xs font-semibold text-gray-400 tracking-wider font-mono">
            {liveTime}
          </h2>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search anything..."
              className="bg-[#11131f] border border-gray-800 rounded-xl px-4 py-1.5 text-xs text-gray-300 placeholder-gray-500 w-56 focus:outline-none focus:border-indigo-500 transition"
            />
           
          </div>
        </header>

        {/* --- DASHBOARD TAB --- */}
        {activeTab === "dashboard" && (
          <div className="space-y-5 animate-fadeIn">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-[#121424] to-[#171a30] border border-gray-800/80 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">
                  Admin Portal
                </span>
                <h3 className="text-lg font-bold text-white mt-2">
                  Welcome back, {currentAdminName}
                </h3>
              </div>
              <div className="hidden sm:block">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border-2 border-indigo-400/30 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
                  <span className="text-lg font-bold text-white tracking-wider">
                    {getInitials(currentAdminName)}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[#0e111d] border border-gray-800/80 rounded-2xl p-5 flex justify-between items-start">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Total Employees</p>
                  <p className="text-3xl font-extrabold mt-2 tracking-tight text-white">{totalEmployees}</p>
                  <span className="text-[10px] text-emerald-400 font-semibold block mt-2">● Live synced cluster</span>
                </div>
                <div className="h-8 w-8 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-sm">👥</div>
              </div>
              <div className="bg-[#0e111d] border border-gray-800/80 rounded-2xl p-5 flex justify-between items-start">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Departments</p>
                  <p className="text-3xl font-extrabold mt-2 tracking-tight text-white">{totalDepartments}</p>
                  <span className="text-[10px] text-gray-400 font-medium block mt-2">● Active workspace units</span>
                </div>
                <div className="h-8 w-8 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-sm">🏢</div>
              </div>
              <div className="bg-[#0e111d] border border-gray-800/80 rounded-2xl p-5 flex justify-between items-start">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Pending Leaves</p>
                  <p className="text-3xl font-extrabold mt-2 tracking-tight text-white">{pendingLeaves}</p>
                  <span className="text-[10px] text-amber-400 font-semibold block mt-2">● Needs admin review</span>
                </div>
                <div className="h-8 w-8 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-sm">📅</div>
              </div>
              <div className="bg-[#0e111d] border border-gray-800/80 rounded-2xl p-5 flex justify-between items-start">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Today's Attendance</p>
                  <p className="text-3xl font-extrabold mt-2 tracking-tight text-white">{attendance.length}/{totalEmployees}</p>
                  <span className="text-[10px] text-blue-400 font-semibold block mt-2">● Realtime punch logs</span>
                </div>
                <div className="h-8 w-8 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-sm">⏱️</div>
              </div>
            </div>

            {/* Quick Access (LEFT) + Recent Activity (RIGHT) */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
              {/* Quick Access - left 2/5 */}
              <div className="lg:col-span-2 space-y-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">Quick Access</h4>
                <div className="grid grid-cols-1 gap-2.5">
                  <div onClick={() => setActiveTab("employees")} className="bg-[#0e111d] border border-gray-800/60 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:border-gray-700 transition">
                    <div className="flex items-center gap-3.5">
                      <div className="h-8 w-8 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex items-center justify-center text-sm">👥</div>
                      <div>
                        <h5 className="text-xs font-bold text-gray-200">Employees</h5>
                        <p className="text-[10px] text-gray-500 mt-0.5">Manage profiles</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-600">➔</span>
                  </div>
                  <div onClick={() => setActiveTab("departments")} className="bg-[#0e111d] border border-gray-800/60 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:border-gray-700 transition">
                    <div className="flex items-center gap-3.5">
                      <div className="h-8 w-8 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center text-sm">🏢</div>
                      <div>
                        <h5 className="text-xs font-bold text-gray-200">Departments</h5>
                        <p className="text-[10px] text-gray-500 mt-0.5">Structure & budgets</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-600">➔</span>
                  </div>
                  <div onClick={() => setActiveTab("leave")} className="bg-[#0e111d] border border-gray-800/60 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:border-gray-700 transition">
                    <div className="flex items-center gap-3.5">
                      <div className="h-8 w-8 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center justify-center text-sm">📅</div>
                      <div>
                        <h5 className="text-xs font-bold text-gray-200">Leave Manager</h5>
                        <p className="text-[10px] text-gray-500 mt-0.5">Approve requests</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-600">➔</span>
                  </div>
                  <div onClick={() => setActiveTab("attendance")} className="bg-[#0e111d] border border-gray-800/60 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:border-gray-700 transition">
                    <div className="flex items-center gap-3.5">
                      <div className="h-8 w-8 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center text-sm">⏱️</div>
                      <div>
                        <h5 className="text-xs font-bold text-gray-200">Attendance</h5>
                        <p className="text-[10px] text-gray-500 mt-0.5">Track logs</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-600">➔</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity - right 3/5 */}
              <div className="lg:col-span-3 bg-[#0e111d] border border-gray-800/80 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs text-indigo-400">⚡</span>
                    <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider">Recent Activity</h4>
                  </div>
                  <div className="space-y-4 font-mono text-[11px] text-gray-400">
                    <div className="border-l-2 border-indigo-500/40 pl-3 py-0.5">
                      <p className="text-gray-200 font-medium"><span className="text-indigo-400">System Log:</span> Admin session successfully compiled.</p>
                      <span className="text-[9px] text-gray-600 block mt-0.5">JUST NOW</span>
                    </div>
                    {leaves.length > 0 && (
                      <div className="border-l-2 border-amber-500/40 pl-3 py-0.5">
                        <p className="text-gray-200 font-medium">Total <span className="text-amber-400">{leaves.length} Leave records</span> verified.</p>
                        <span className="text-[9px] text-gray-600 block mt-0.5">UPDATED TODAY</span>
                      </div>
                    )}
                    {attendance.length > 0 ? (
                      <div className="border-l-2 border-blue-500/40 pl-3 py-0.5">
                        <p className="text-gray-200 font-medium">Punch sync cached <span className="text-blue-400">{attendance.length} check-ins</span>.</p>
                        <span className="text-[9px] text-gray-600 block mt-0.5">LIVE LOGS</span>
                      </div>
                    ) : (
                      <div className="border-l-2 border-gray-700 pl-3 py-0.5">
                        <p className="text-gray-500">No shift actions checked in today.</p>
                        <span className="text-[9px] text-gray-600 block mt-0.5">YESTERDAY</span>
                      </div>
                    )}
                    <div className="border-l-2 border-emerald-500/40 pl-3 py-0.5">
                      <p className="text-gray-200 font-medium">Fast API server active on port <span className="text-emerald-400">8000</span>.</p>
                      <span className="text-[9px] text-gray-600 block mt-0.5">STABLE FRAMEWORK</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- EMPLOYEES TAB --- */}
        {activeTab === "employees" && (
          <div className="bg-[#0e111d] rounded-2xl border border-gray-800/80 p-6">
            <h3 className="text-lg font-bold mb-4">Organization Staff Roster</h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800 text-xs text-gray-500 uppercase">
                  <th className="pb-3">Employee ID</th>
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Department</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-800/50">
                {Array.isArray(employees) && employees.length > 0 ? (
                  employees.map((emp: any) => (
                    <tr key={emp.employee_id || Math.random()} className="hover:bg-[#1c1e2a]/30">
                      <td className="py-4 text-gray-400 font-mono">{emp.employee_id || "—"}</td>
                      <td className="py-4 font-semibold text-white">{emp.name || "N/A"}</td>
                      <td className="py-4 text-gray-300">{emp.department || "N/A"}</td>
                      <td className="py-4 text-gray-400">{emp.role || "N/A"}</td>
                      <td className="py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${emp.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
                          {emp.status || "UNKNOWN"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={5} className="py-8 text-center text-gray-500 text-sm">No employees found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* --- DEPARTMENTS TAB --- */}
        {activeTab === "departments" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-[#0e111d] p-4 rounded-xl border border-gray-800/80">
              <div>
                <h3 className="text-base font-bold text-white">Functional Infrastructure Sectors</h3>
                <p className="text-xs text-gray-500">Configure and monitor administrative business units</p>
              </div>
              <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/10 transition cursor-pointer flex items-center gap-2">
                <span>➕</span> Add Department
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.isArray(departments) && departments.length > 0 ? (
                departments.map((dept: any) => (
                  <div key={dept.department_id || dept.id || Math.random()} className="bg-[#0e111d] p-6 rounded-2xl border border-gray-800/80 flex flex-col justify-between">
                    <div>
                      <h4 className="text-base font-bold text-white mb-1">{dept.department_name || "Unnamed"}</h4>
                      <p className="text-xs text-gray-500 mb-4">Sector Leader: {dept.manager_name || "Unassigned"}</p>
                    </div>
                    <div className="border-t border-gray-800/50 pt-4 flex justify-between text-xs text-gray-400">
                      <div>
                        <p>Annual Budget</p>
                        <p className="font-bold text-white mt-0.5">₹{dept.annual_budget?.toLocaleString("en-IN") || "0"}</p>
                      </div>
                      <div className="text-right">
                        <p>Active Staff</p>
                        <p className="font-bold text-indigo-400 mt-0.5">{dept.members_count || 0} Assigned</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 py-12 text-center text-gray-500 text-sm">No departments yet. Click "Add Department" to create one.</div>
              )}
            </div>
          </div>
        )}

        {/* --- LEAVE TAB --- */}
       {activeTab === "leave" && (
  <div className="bg-[#0e111d] rounded-2xl border border-gray-800/80 p-6">
    <h3 className="text-lg font-bold mb-4">Leave Requests</h3>
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b border-gray-800 text-xs text-gray-500 uppercase">
          <th className="pb-3">ID</th>
          <th className="pb-3">Employee</th>
          <th className="pb-3">Type</th>
          <th className="pb-3">Start Date</th>
          <th className="pb-3">End Date</th>
          <th className="pb-3">Status</th>
          <th className="pb-3">Action</th>
        </tr>
      </thead>
      <tbody className="text-sm divide-y divide-gray-800/50">
        {Array.isArray(leaves) && leaves.length > 0 ? (
          leaves.map((leave: any) => (
            <tr key={leave.leave_id || leave.id || Math.random()} className="hover:bg-[#1c1e2a]/30">
              {/* ID कॉलम */}
              <td className="py-4 text-gray-400 font-mono">{leave.leave_id || leave.id || "—"}</td>
              
              {/* एम्प्लोई नाम कॉलम (अब N/A नहीं आएगा) */}
              <td className="py-4 font-semibold text-white">
                {leave.employee || leave.employee_name || leave.user?.first_name || leave.user?.name || "N/A"}
              </td>
              
              <td className="py-4 text-gray-300">{leave.leave_type || leave.type || "N/A"}</td>
              <td className="py-4 text-gray-300">{leave.start_date || "—"}</td>
              <td className="py-4 text-gray-300">{leave.end_date || "—"}</td>
              
              {/* स्टेटस बैच */}
              <td className="py-4">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                  leave.status === "Approved" ? "bg-emerald-500/10 text-emerald-400" :
                  leave.status === "Rejected" ? "bg-red-500/10 text-red-400" :
                  "bg-amber-500/10 text-amber-400"
                }`}>
                  {leave.status || "Pending"}
                </span>
              </td>
              
              {/* एक्शन बटन्स (Approve / Reject) */}
              <td className="py-4">
                {leave.status === "Pending" && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleLeaveAction(leave.leave_id || leave.id, "APPROVED")} 
                      className="text-emerald-400 hover:text-emerald-300 text-xs font-semibold cursor-pointer bg-transparent border-none"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleLeaveAction(leave.leave_id || leave.id, "REJECTED")} 
                      className="text-red-400 hover:text-red-300 text-xs font-semibold cursor-pointer bg-transparent border-none"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={7} className="py-8 text-center text-gray-500 text-sm">
              No leave requests found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
)}
    
        {/* ---------------- ATTENDANCE CLUSTER LOGS ---------------- */}
{/* ---------------- ATTENDANCE CLUSTER LOGS ---------------- */}
{activeTab === "attendance" && (
  <div className="bg-[#0e111d] p-6 rounded-2xl border border-gray-800/80 animate-fadeIn">
    <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-800/60">
      <div>
        <h3 className="text-sm font-bold tracking-wide">⏱️ Live Matrix Stream</h3>
        <p className="text-[11px] text-gray-500 mt-0.5">Real-time punch logs for today's active cluster shifts.</p>
      </div>
      <span className="text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-lg font-bold animate-pulse">
        ● Live Tracking
      </span>
    </div>

    {(!Array.isArray(attendance) || attendance.length === 0) ? (
      <div className="py-12 border border-dashed border-gray-800/60 text-center rounded-xl bg-[#141724]/20">
        <p className="text-xs text-gray-500 font-medium">No telemetry checkpoints recorded for today.</p>
      </div>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider bg-[#141724]/40">
              <th className="py-3 px-4 rounded-l-xl">Record ID</th>
              <th className="py-3 px-4">Employee Name</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Clock In</th>
              <th className="py-3 px-4">Clock Out</th>
              <th className="py-3 px-4 rounded-r-xl">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/30 font-mono text-xs">
            {attendance.map((att: any, i: number) => {
              // ✅ FIXED: Use correct field names
              const employeeName = att.employee || att.employee_name || "N/A";
              const department = att.department || "General";
              const clockIn = att.clock_in || "--:--";
              const clockOut = att.clock_out || "--:--";
              const status = att.status || "ON-TIME";

              const formatTimeStr = (timeStr: string) => {
                if (!timeStr || timeStr === "--:--") return "--:--";
                return timeStr.substring(0, 5);
              };

              return (
                <tr key={att.attendance_id || att.id || i} className="hover:bg-[#141724]/60 transition duration-150">
                  <td className="py-3.5 px-4 text-gray-500">
                    #{att.attendance_id || att.id || (i + 401)}
                  </td>
                  <td className="py-3.5 px-4 text-indigo-400 font-semibold">
                    {employeeName}
                  </td>
                  <td className="py-3.5 px-4 text-gray-300">
                    {department}
                  </td>
                  <td className="py-3.5 px-4 text-emerald-400 font-medium">
                    {formatTimeStr(clockIn)}
                  </td>
                  <td className="py-3.5 px-4 text-amber-400 font-medium">
                    {formatTimeStr(clockOut)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[9px] border px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wide ${
                      status === "ON-TIME" || status === "Clocked In"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : status === "Clocked Out"
                        ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}>
                      {status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    )}
  </div>
)}

    {/* --- ATTENDANCE TAB ---
        {activeTab === "attendance" && (
          <div className="bg-[#0e111d] rounded-2xl border border-gray-800/80 p-6">
            <h3 className="text-lg font-bold mb-4">Real-Time Attendance Feed</h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800 text-xs text-gray-500 uppercase">
                  <th className="pb-3">Feed ID</th>
                  <th className="pb-3">Employee</th>
                  <th className="pb-3">Clock In</th>
                  <th className="pb-3">Clock Out</th>
                  <th className="pb-3">Duration</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-800/50">
                {Array.isArray(attendance) && attendance.length > 0 ? (
                  attendance.map((log: any) => (
                    <tr key={log.id || Math.random()} className="hover:bg-[#1c1e2a]/30">
                      <td className="py-4 font-mono text-gray-500">{log.id || "—"}</td>
                      <td className="py-4 font-semibold">{log.employee || "N/A"}</td>
                      <td className="py-4 text-gray-300">{log.clock_in || "—"}</td>
                      <td className="py-4 text-gray-300">{log.clock_out || "—"}</td>
                      <td className="py-4 text-gray-400">{log.work_duration || "—"}</td>
                      <td className="py-4">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${log.status === "ON-TIME" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                          {log.status || "UNKNOWN"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={6} className="py-8 text-center text-gray-500 text-sm">No attendance logs for today.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )} */}

      </main>

      {/* --- Add Department Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0e111d] w-full max-w-md p-6 rounded-2xl border border-gray-800 shadow-2xl relative">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>🏢</span> Create New Department
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition text-lg font-bold cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleAddDepartment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Department Name *</label>
                <input type="text" required placeholder="e.g., Marketing, Development" value={newDeptName} onChange={(e) => setNewDeptName(e.target.value)} className="w-full bg-[#090a0f] border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Manager Name</label>
                <input type="text" placeholder="e.g., Sarah Johnson" value={newManagerName} onChange={(e) => setNewManagerName(e.target.value)} className="w-full bg-[#090a0f] border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Annual Budget (₹)</label>
                <input type="number" placeholder="e.g., 150000" value={newBudget} onChange={(e) => setNewBudget(e.target.value)} className="w-full bg-[#090a0f] border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition" />
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-2.5 rounded-lg transition disabled:opacity-50 cursor-pointer">
                {isSubmitting ? "Creating..." : "Create Department"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}