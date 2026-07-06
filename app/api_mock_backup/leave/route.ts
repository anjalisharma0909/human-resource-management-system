import { NextRequest, NextResponse } from 'next/server';
import { db, LeaveRequest } from '@/utils/db';
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

    let results = [...db.leaveRequests];

    if (user.role === 'Employee') {
      const employee = db.employees.find((e) => e.email.toLowerCase() === user.email.toLowerCase());
      if (employee) {
        results = results.filter((r) => r.employeeId === employee.id);
      } else {
        results = [];
      }
    }

    return NextResponse.json({ success: true, leaveRequests: results });
  } catch (error) {
    console.error('GET Leaves error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await checkAuth(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { leaveType, startDate, endDate, reason } = await req.json();

    if (!leaveType || !startDate || !endDate || !reason) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const employee = db.employees.find((e) => e.email.toLowerCase() === user.email.toLowerCase());
    if (!employee) {
      return NextResponse.json({ error: 'Associated employee record not found' }, { status: 400 });
    }

    const nextIdNum = db.leaveRequests.length + 1;
    const newId = `LV${nextIdNum.toString().padStart(3, '0')}`;

    const newRequest: LeaveRequest = {
      id: newId,
      employeeId: employee.id,
      employeeName: employee.name,
      leaveType,
      startDate,
      endDate,
      reason,
      status: 'Pending',
      requestDate: new Date().toISOString().split('T')[0],
    };

    db.leaveRequests.push(newRequest);

    return NextResponse.json({ success: true, leaveRequest: newRequest });
  } catch (error) {
    console.error('POST Leaves error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await checkAuth(req);
    if (!user || user.role === 'Employee') {
      return NextResponse.json({ error: 'Forbidden: Admin or Manager access required' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Leave request ID is required' }, { status: 400 });
    }

    const { status } = await req.json();
    if (!status || !['Approved', 'Rejected'].includes(status)) {
      return NextResponse.json({ error: 'Valid status (Approved/Rejected) is required' }, { status: 400 });
    }

    const index = db.leaveRequests.findIndex((r) => r.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Leave request not found' }, { status: 404 });
    }

    db.leaveRequests[index].status = status;
    db.leaveRequests[index].reviewedBy = user.name;

    if (status === 'Approved') {
      const today = new Date().toISOString().split('T')[0];
      const req = db.leaveRequests[index];
      if (today >= req.startDate && today <= req.endDate) {
        const emp = db.employees.find((e) => e.id === req.employeeId);
        if (emp) {
          emp.status = 'On Leave';
        }
      }
    }

    return NextResponse.json({ success: true, leaveRequest: db.leaveRequests[index] });
  } catch (error) {
    console.error('PUT Leaves error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
