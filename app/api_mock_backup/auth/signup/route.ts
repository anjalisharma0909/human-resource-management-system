import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/utils/db';

export async function POST(req: NextRequest) {
  try {
    const { companyName, adminName, email, password } = await req.json();

    if (!adminName || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const exists = db.users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    const nextIdNum = db.users.length + 1;
    const userId = `USR${nextIdNum.toString().padStart(3, '0')}`;

    const newAdmin = {
      id: userId,
      name: adminName,
      email,
      role: 'Admin' as const,
      organization: companyName || 'Acme Corp Ltd',
      avatarUrl: `https://images.unsplash.com/photo-${1530000000000 + Math.floor(Math.random() * 900000)}?q=80&w=256&h=256&fit=crop`,
      passwordHash: password,
      phone: '',
    };

    db.users.push(newAdmin);

    const nextEmpNum = db.employees.length + 1;
    db.employees.push({
      id: `EMP${nextEmpNum.toString().padStart(3, '0')}`,
      name: adminName,
      email,
      role: 'Administrator',
      departmentId: 'DEP001', 
      joinDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      salary: 120000,
      phone: '',
      avatarUrl: newAdmin.avatarUrl,
    });

    return NextResponse.json({
      success: true,
      message: 'Organization and Admin Account created successfully. You can now login.',
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
