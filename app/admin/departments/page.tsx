'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Plus, Edit2, Trash2, X, Building, IndianRupee, Users, Award } from 'lucide-react';
import toast from 'react-hot-toast';

interface Employee {
  id: string;
  name: string;
  role: string;
  departmentId: string;
  avatarUrl: string;
}

interface Department {
  id: string;
  name: string;
  managerId: string;
  managerName?: string;
  budget: number;
  employeeCount: number;
}

export default function DepartmentsPage() {
  const { authAxios, user } = useAuth();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    managerId: '',
    budget: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const fetchData = async () => {
    try {
      setLoading(true);
      const [deptRes, empRes] = await Promise.all([
        authAxios.get('/api/departments'),
        authAxios.get('/api/employees'),
      ]);

      if (deptRes.data.success) {
        setDepartments(deptRes.data.departments);
      }
      if (empRes.data.success) {
        setEmployees(empRes.data.employees);
      }
    } catch (error) {
      console.error('Error loading department data:', error);
      toast.error('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authAxios) {
      fetchData();
    }
  }, [authAxios]);

  const handleOpenAddModal = () => {
    setEditingDept(null);
    setFormData({
      name: '',
      managerId: employees[0]?.id || '',
      budget: '150000',
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleOpenEditModal = (dept: Department) => {
    setEditingDept(dept);
    setFormData({
      name: dept.name,
      managerId: dept.managerId,
      budget: dept.budget.toString(),
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Department name is required';
    if (!formData.budget || isNaN(Number(formData.budget)) || Number(formData.budget) <= 0) {
      errors.budget = 'Please enter a valid positive budget amount';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingDept) {
        
        const response = await authAxios.put(`/api/departments?id=${editingDept.id}`, formData);
        if (response.data.success) {
          toast.success(`Department ${formData.name} updated`);
          setModalOpen(false);
          fetchData();
        }
      } else {
        
        const response = await authAxios.post('/api/departments', formData);
        if (response.data.success) {
          toast.success(`Department ${formData.name} created`);
          setModalOpen(false);
          fetchData();
        }
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 'Failed to submit department form';
      toast.error(errorMsg);
    }
  };

  const handleDeleteDept = async (dept: Department) => {
    if (dept.employeeCount > 0) {
      toast.error(`Cannot delete ${dept.name}. There are employees assigned to it.`);
      return;
    }

    if (confirm(`Are you sure you want to delete the department ${dept.name}?`)) {
      try {
        const response = await authAxios.delete(`/api/departments?id=${dept.id}`);
        if (response.data.success) {
          toast.success(`Deleted ${dept.name}`);
          fetchData();
        }
      } catch (error: any) {
        const errorMsg = error.response?.data?.error || 'Failed to delete department';
        toast.error(errorMsg);
      }
    }
  };

  const getDeptEmployees = (deptId: string) => {
    return employees.filter((emp) => emp.departmentId === deptId).slice(0, 4);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Departments <span className="text-xs bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-full px-2.5 py-0.5">{departments.length} Units</span>
          </h1>
          <p className="text-slate-400 text-xs mt-0.5">Configure organization structure and budget controls</p>
        </div>

        {user?.role === 'Admin' && (
          <button
            onClick={handleOpenAddModal}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 border border-violet-500/30 transition-all active:scale-95 shadow-lg shadow-violet-900/10 text-sm cursor-pointer"
          >
            <Plus size={16} />
            Add Department
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400">
          <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-xs font-semibold uppercase tracking-wider">Loading structure cards...</p>
        </div>
      ) : departments.length === 0 ? (
        <div className="py-20 text-center text-slate-400">
          <Building size={48} className="mx-auto text-slate-600 mb-3" />
          <p className="text-sm font-bold text-slate-300">No Departments Found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {departments.map((dept) => {
            const deptEmps = getDeptEmployees(dept.id);
            return (
              <div
                key={dept.id}
                className="glass-panel glass-card-hover rounded-3xl p-6 border border-white/5 relative overflow-hidden group flex flex-col justify-between"
              >
                
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-400 to-violet-500 opacity-50"></div>

                <div>
                  
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">{dept.id}</span>
                      <h3 className="text-base font-bold text-white mt-1 group-hover:text-cyan-300 transition-colors">
                        {dept.name}
                      </h3>
                    </div>

                    {user?.role === 'Admin' && (
                      <div className="flex gap-1.5 opacity-60 group-hover:opacity-100 transition-all">
                        <button
                          onClick={() => handleOpenEditModal(dept)}
                          className="p-1.5 rounded-lg bg-white/5 border border-white/5 hover:border-violet-500/30 hover:bg-violet-500/10 text-slate-400 hover:text-violet-400 transition-all cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={() => handleDeleteDept(dept)}
                          className="p-1.5 rounded-lg bg-white/5 border border-white/5 hover:border-rose-500/30 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-5 px-3 py-2 bg-white/2 border border-white/5 rounded-xl text-xs">
                    <Award size={14} className="text-cyan-400" />
                    <span className="text-slate-400">Manager:</span>
                    <span className="font-bold text-slate-200">{dept.managerName || 'Unassigned'}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="space-y-1.5">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                        <IndianRupee size={10} className="text-emerald-400" />
                        Annual Budget
                      </p>
                      <p className="text-sm font-extrabold text-white">
                        ₹{dept.budget.toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                        <Users size={10} className="text-indigo-400" />
                        Members
                      </p>
                      <p className="text-sm font-extrabold text-white">
                        {dept.employeeCount} Assigned
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Staff Preview</p>
                  {deptEmps.length === 0 ? (
                    <p className="text-[10px] text-slate-500 italic">No assigned staff yet</p>
                  ) : (
                    <div className="flex items-center">
                      <div className="flex -space-x-2 overflow-hidden">
                        {deptEmps.map((emp) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            key={emp.id}
                            src={emp.avatarUrl}
                            alt={emp.name}
                            className="inline-block h-6 w-6 rounded-full ring-2 ring-[#080612] object-cover"
                            title={`${emp.name} - ${emp.role}`}
                          />
                        ))}
                      </div>
                      {dept.employeeCount > 4 && (
                        <span className="text-[10px] text-slate-400 font-bold ml-2">
                          +{dept.employeeCount - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel w-full max-w-md rounded-3xl border border-white/10 shadow-2xl p-6 relative overflow-hidden animate-slide-up">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-bold text-white mb-6">
              {editingDept ? 'Edit Department Details' : 'Add New Department'}
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Department Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl glass-input text-xs"
                  placeholder="Engineering & IT"
                />
                {formErrors.name && <p className="text-red-400 text-[10px] mt-1">{formErrors.name}</p>}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Department Manager</label>
                <select
                  value={formData.managerId}
                  onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl glass-select text-xs outline-none"
                >
                  <option value="">No Manager Assigned</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Annual Budget (₹)</label>
                <input
                  type="text"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl glass-input text-xs"
                  placeholder="250000"
                />
                {formErrors.budget && <p className="text-red-400 text-[10px] mt-1">{formErrors.budget}</p>}
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
                  {editingDept ? 'Save Changes' : 'Create Unit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
