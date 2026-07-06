import { NextRequest, NextResponse } from 'next/server';
import { db, Department } from '@/utils/db';
import { verifyToken } from '@/utils/auth';

async function checkAuth(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  return await verifyToken(token);
}

export async function GET(req: NextRequest) {
  try {
    const user = await checkAuth(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const enrichedDepartments = db.departments.map((dept) => {
      const manager = db.employees.find((e) => e.id === dept.managerId);
      return {
        ...dept,
        managerName: manager ? manager.name : 'Unassigned',
      };
    });

    return NextResponse.json({ success: true, departments: enrichedDepartments });
  } catch (error) {
    console.error('GET Departments error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await checkAuth(req);
    if (!user || user.role !== 'Admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { name, managerId, budget } = await req.json();

    if (!name) {
      return NextResponse.json({ error: 'Department name is required' }, { status: 400 });
    }

    const nextIdNum = db.departments.length + 1;
    const newId = `DEP${nextIdNum.toString().padStart(3, '0')}`;

    const newDept: Department = {
      id: newId,
      name,
      managerId: managerId || '',
      budget: Number(budget) || 100000,
      employeeCount: 0,
    };

    db.departments.push(newDept);

    return NextResponse.json({ success: true, department: newDept });
  } catch (error) {
    console.error('POST Departments error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await checkAuth(req);
    if (!user || user.role !== 'Admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Department ID is required' }, { status: 400 });
    }

    const body = await req.json();
    const index = db.departments.findIndex((d) => d.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Department not found' }, { status: 404 });
    }

    db.departments[index] = {
      ...db.departments[index],
      ...body,
      id, 
      budget: body.budget ? Number(body.budget) : db.departments[index].budget,
    };

    return NextResponse.json({ success: true, department: db.departments[index] });
  } catch (error) {
    console.error('PUT Departments error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await checkAuth(req);
    if (!user || user.role !== 'Admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Department ID is required' }, { status: 400 });
    }

    const index = db.departments.findIndex((d) => d.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Department not found' }, { status: 404 });
    }

    const dept = db.departments[index];
    if (dept.employeeCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete department. There are employees assigned to it.' },
        { status: 400 }
      );
    }

    db.departments = db.departments.filter((d) => d.id !== id);

    return NextResponse.json({ success: true, message: 'Department deleted successfully' });
  } catch (error) {
    console.error('DELETE Departments error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
