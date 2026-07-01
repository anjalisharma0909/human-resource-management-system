'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Search, Plus, Edit2, Trash2, X, Filter, UserCheck, Eye, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  departmentId: string;
  joinDate: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  salary: number;
  phone: string;
  avatarUrl: string;
}

interface Department {
  id: string;
  name: string;
}

export default function EmployeesPage() {
  const { authAxios, user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    departmentId: '',
    joinDate: '',
    status: 'Active' as Employee['status'],
    salary: '',
    phone: '',
    avatarUrl: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedDept) params.append('departmentId', selectedDept);
      if (selectedStatus) params.append('status', selectedStatus);

      const response = await authAxios.get(`/api/employees?${params.toString()}`);
      if (response.data.success) {
        setEmployees(response.data.employees);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Failed to load employee records');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await authAxios.get('/api/departments');
      if (response.data.success) {
        setDepartments(response.data.departments);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  useEffect(() => {
    if (authAxios) {
      fetchEmployees();
      fetchDepartments();
    }
  }, [authAxios, searchTerm, selectedDept, selectedStatus]);

  const handleOpenAddModal = () => {
    setEditingEmployee(null);
    setFormData({
      name: '',
      email: '',
      role: '',
      departmentId: departments[0]?.id || '',
      joinDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      salary: '60000',
      phone: '',
      avatarUrl: '',
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleOpenEditModal = (emp: Employee) => {
    setEditingEmployee(emp);
    setFormData({
      name: emp.name,
      email: emp.email,
      role: emp.role,
      departmentId: emp.departmentId,
      joinDate: emp.joinDate,
      status: emp.status,
      salary: emp.salary.toString(),
      phone: emp.phone,
      avatarUrl: emp.avatarUrl,
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email address';
    }
    if (!formData.role.trim()) errors.role = 'Role / Position is required';
    if (!formData.departmentId) errors.departmentId = 'Department selection is required';
    if (!formData.salary || isNaN(Number(formData.salary)) || Number(formData.salary) <= 0) {
      errors.salary = 'Please enter a valid positive salary';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingEmployee) {
        
        const response = await authAxios.put(`/api/employees?id=${editingEmployee.id}`, formData);
        if (response.data.success) {
          toast.success(`Profile updated for ${formData.name}`);
          setModalOpen(false);
          fetchEmployees();
        }
      } else {
        
        const response = await authAxios.post('/api/employees', formData);
        if (response.data.success) {
          toast.success(`Employee profile created for ${formData.name}`);
          setModalOpen(false);
          fetchEmployees();
        }
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 'Failed to submit employee form';
      toast.error(errorMsg);
    }
  };

  const handleDeleteEmployee = async (emp: Employee) => {
    if (confirm(`Are you sure you want to delete the record for ${emp.name}?`)) {
      try {
        const response = await authAxios.delete(`/api/employees?id=${emp.id}`);
        if (response.data.success) {
          toast.success(`Deleted record of ${emp.name}`);
          fetchEmployees();
        }
      } catch (error: any) {
        const errorMsg = error.response?.data?.error || 'Failed to delete record';
        toast.error(errorMsg);
      }
    }
  };

  const getDeptName = (id: string) => {
    const d = departments.find((dept) => dept.id === id);
    return d ? d.name : 'Unknown';
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Employees <span className="text-xs bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-full px-2.5 py-0.5">{employees.length} Records</span>
          </h1>
          <p className="text-slate-400 text-xs mt-0.5">Manage and organize organization staff rosters</p>
        </div>

        {user?.role === 'Admin' && (
          <button
            onClick={handleOpenAddModal}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 border border-violet-500/30 transition-all active:scale-95 shadow-lg shadow-violet-900/10 text-sm cursor-pointer"
          >
            <Plus size={16} />
            Add Employee
          </button>
        )}
      </div>

      <div className="glass-panel rounded-2xl p-4 border border-white/5 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 text-slate-500" size={16} />
          <input
            type="text"
            placeholder="Search by name, email or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs"
          />
        </div>

        <div className="flex flex-wrap w-full md:w-auto gap-3 items-center">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-bold shrink-0">
            <Filter size={14} className="text-slate-500" />
            Filters:
          </div>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="rounded-xl px-3 py-2 glass-select text-xs outline-none"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-xl px-3 py-2 glass-select text-xs outline-none"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Inactive">Inactive</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedDept('');
              setSelectedStatus('');
            }}
            className="p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all text-xs border border-white/5 cursor-pointer"
            title="Reset Filters"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-xs font-semibold uppercase tracking-wider">Fetching employee rosters...</p>
          </div>
        ) : employees.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <UserCheck size={48} className="mx-auto text-slate-600 mb-3" />
            <p className="text-sm font-bold text-slate-300">No Employee Records Found</p>
            <p className="text-xs text-slate-500 mt-1">Try widening your search terms or filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                  <th className="px-6 py-4">Employee ID</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Salary</th>
                  {user?.role === 'Admin' && <th className="px-6 py-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {employees.map((emp) => (
                  <tr key={emp.id} className="text-slate-300 hover:bg-white/2 transition-colors text-xs">
                    <td className="px-6 py-4 font-mono font-bold text-slate-400">{emp.id}</td>
                    <td className="px-6 py-4 font-semibold text-white">
                      <div className="flex items-center gap-3">
                        
                        <img
                          src={emp.avatarUrl}
                          alt={emp.name}
                          className="w-8 h-8 rounded-full object-cover border border-white/10"
                        />
                        <div>
                          <p className="font-bold">{emp.name}</p>
                          <p className="text-[10px] text-slate-500 font-medium">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold">{getDeptName(emp.departmentId)}</td>
                    <td className="px-6 py-4">{emp.role}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          emp.status === 'Active'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : emp.status === 'On Leave'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}
                      >
                        <span className={`w-1 h-1 rounded-full ${
                          emp.status === 'Active' ? 'bg-emerald-400' : emp.status === 'On Leave' ? 'bg-amber-400' : 'bg-red-400'
                        }`}></span>
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-white">₹{emp.salary.toLocaleString('en-IN')}</td>
                    {user?.role === 'Admin' && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          <button
                            onClick={() => handleOpenEditModal(emp)}
                            className="p-1.5 rounded-lg bg-white/5 border border-white/5 hover:border-violet-500/30 hover:bg-violet-500/10 text-slate-400 hover:text-violet-400 transition-all cursor-pointer"
                            title="Edit Record"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteEmployee(emp)}
                            className="p-1.5 rounded-lg bg-white/5 border border-white/5 hover:border-rose-500/30 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
                            title="Delete Record"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel w-full max-w-lg rounded-3xl border border-white/10 shadow-2xl p-6 relative overflow-hidden animate-slide-up">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-bold text-white mb-6">
              {editingEmployee ? 'Edit Employee Record' : 'Add New Employee'}
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                    placeholder="Rahul Sharma"
                  />
                  {formErrors.name && <p className="text-red-400 text-[10px] mt-1">{formErrors.name}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                    placeholder="email@company.com"
                    disabled={!!editingEmployee}
                  />
                  {formErrors.email && <p className="text-red-400 text-[10px] mt-1">{formErrors.email}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Position / Role</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                    placeholder="Frontend Developer"
                  />
                  {formErrors.role && <p className="text-red-400 text-[10px] mt-1">{formErrors.role}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Department</label>
                  <select
                    value={formData.departmentId}
                    onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-select text-xs outline-none"
                  >
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.departmentId && <p className="text-red-400 text-[10px] mt-1">{formErrors.departmentId}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Salary (₹ / year)</label>
                  <input
                    type="text"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                    placeholder="75000"
                  />
                  {formErrors.salary && <p className="text-red-400 text-[10px] mt-1">{formErrors.salary}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Join Date</label>
                  <input
                    type="date"
                    value={formData.joinDate}
                    onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                  />
                </div>

                {editingEmployee && (
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Employee Status</label>
                    <div className="flex gap-4">
                      {['Active', 'On Leave', 'Inactive'].map((st) => (
                        <label key={st} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                          <input
                            type="radio"
                            name="status"
                            value={st}
                            checked={formData.status === st}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                            className="text-violet-600 bg-slate-900 border-slate-700 focus:ring-violet-500/50"
                          />
                          {st}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 rounded-xl border border-transparent transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-xl shadow-lg border border-violet-500/30 transition-all active:scale-95 cursor-pointer"
                >
                  {editingEmployee ? 'Update Profile' : 'Create Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}