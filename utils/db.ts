
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Employee';
  organization?: string;
  avatarUrl: string;
  passwordHash: string;
  phone?: string;
}

export interface Employee {
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

export interface Department {
  id: string;
  name: string;
  managerId: string; 
  budget: number;
  employeeCount: number;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: 'Sick' | 'Casual' | 'Annual';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  requestDate: string;
  reviewedBy?: string; 
}

export interface AttendanceLog {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  clockIn: string;
  clockOut?: string;
  totalHours?: number;
  status: 'On-Time' | 'Late' | 'Absent';
}

interface MockDatabase {
  users: User[];
  employees: Employee[];
  departments: Department[];
  leaveRequests: LeaveRequest[];
  attendanceLogs: AttendanceLog[];
  resetTokens: Record<string, { email: string; expires: number }>;
}

const today = new Date().toISOString().split('T')[0];

const initialDbState: MockDatabase = {
  users: [
    {
      id: "USR001",
      name: "Shruti Sharma",
      email: "shruti14@gmail.com",
      role: "Admin",
      organization: "Acme Corp Ltd",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&h=256&fit=crop",
      passwordHash: "admin123",
      phone: "+91 7078723456",
    },
    {
      id: "USR002",
      name: "Sarah Kapoor",
      email: "sarah24@gmail.com",
      role: "Manager",
      organization: "Acme Corp Ltd",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&h=256&fit=crop",
      passwordHash: "manager123",
      phone: "+919870987654",
    },
    {
      id: "USR003",
      name: "Rahul Sharma",
      email: "employee@example.com",
      role: "Employee",
      organization: "Acme Corp Ltd",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&fit=crop",
      passwordHash: "employee123",
      phone: "+919876543210",
    },
  ],
  employees: [
    {
      id: "EMP001",
      name: "Rahul Sharma",
      email: "employee@example.com",
      role: "Frontend Developer",
      departmentId: "DEP001",
      joinDate: "2024-03-15",
      status: "Active",
      salary: 75000,
      phone: "+919876543459",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&fit=crop",
    },
    {
      id: "EMP002",
      name: "Priya Singh",
      email: "priya@example.com",
      role: "HR Generalist",
      departmentId: "DEP002",
      joinDate: "2023-06-20",
      status: "Active",
      salary: 62000,
      phone: "+919870987654",
      avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&h=256&fit=crop",
    },
    {
      id: "EMP003",
      name: "Aman Gupta",
      email: "aman@example.com",
      role: "Financial Analyst",
      departmentId: "DEP003",
      joinDate: "2022-11-01",
      status: "On Leave",
      salary: 80000,
      phone: "+919876543459",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&h=256&fit=crop",
    },
    {
      id: "EMP004",
      name: "Sneha Patel",
      email: "sneha@example.com",
      role: "Marketing Manager",
      departmentId: "DEP004",
      joinDate: "2023-01-10",
      status: "Active",
      salary: 68000,
      phone: "+919876543459",
      avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=256&h=256&fit=crop",
    },
  ],
  departments: [
    {
      id: "DEP001",
      name: "Engineering & IT",
      managerId: "EMP001",
      budget: 450000,
      employeeCount: 1,
    },
    {
      id: "DEP002",
      name: "Human Resources",
      managerId: "EMP002",
      budget: 180000,
      employeeCount: 1,
    },
    {
      id: "DEP003",
      name: "Finance",
      managerId: "EMP003",
      budget: 250000,
      employeeCount: 1,
    },
    {
      id: "DEP004",
      name: "Marketing",
      managerId: "EMP004",
      budget: 150000,
      employeeCount: 1,
    },
  ],
  leaveRequests: [
    {
      id: "LV001",
      employeeId: "EMP003",
      employeeName: "Aman Gupta",
      leaveType: "Annual",
      startDate: "2026-07-05",
      endDate: "2026-07-12",
      reason: "Family vacation trip",
      status: "Pending",
      requestDate: "2026-06-28",
    },
    {
      id: "LV002",
      employeeId: "EMP002",
      employeeName: "Priya Singh",
      leaveType: "Sick",
      startDate: "2026-06-25",
      endDate: "2026-06-26",
      reason: "Flu symptoms",
      status: "Approved",
      requestDate: "2026-06-24",
      reviewedBy: "Shruti Sharma",
    },
    {
      id: "LV003",
      employeeId: "EMP004",
      employeeName: "Sneha Patel",
      leaveType: "Casual",
      startDate: "2026-07-15",
      endDate: "2026-07-16",
      reason: "Personal urgent work",
      status: "Approved",
      requestDate: "2026-06-29",
      reviewedBy: "Sarah Jenkins",
    },
  ],
  attendanceLogs: [

    {
      id: "ATT002",
      employeeId: "EMP002",
      employeeName: "Priya Singh",
      date: today,
      clockIn: "09:05",
      clockOut: "18:00",
      totalHours: 8.92,
      status: "On-Time",
    },
    {
      id: "ATT003",
      employeeId: "EMP004",
      employeeName: "Sneha Patel",
      date: today,
      clockIn: "09:45",
      clockOut: "17:15",
      totalHours: 7.5,
      status: "Late",
    },
  ],
  resetTokens: {},
};

declare global {
  // eslint-disable-next-line no-var
  var __mockDb: MockDatabase | undefined;
}

if (!global.__mockDb) {
  global.__mockDb = initialDbState;
} else if (global.__mockDb.attendanceLogs[0]?.date !== today) {

  global.__mockDb.attendanceLogs.forEach((log) => {
    log.date = today;
  });
}

export const db = global.__mockDb;
