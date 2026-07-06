import { NextRequest, NextResponse } from 'next/server';
import { db, AttendanceLog } from '@/utils/db';
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

    let results = [...db.attendanceLogs];

    if (user.role === 'Employee') {
      const employee = db.employees.find((e) => e.email.toLowerCase() === user.email.toLowerCase());
      if (employee) {
        results = results.filter((log) => log.employeeId === employee.id);
      } else {
        results = [];
      }
    }

    return NextResponse.json({ success: true, attendanceLogs: results });
  } catch (error) {
    console.error('GET Attendance error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await checkAuth(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action } = await req.json(); 

    if (!action || !['clock-in', 'clock-out'].includes(action)) {
      return NextResponse.json({ error: 'Valid action (clock-in/clock-out) is required' }, { status: 400 });
    }

    const employee = db.employees.find((e) => e.email.toLowerCase() === user.email.toLowerCase());
    if (!employee) {
      return NextResponse.json({ error: 'Associated employee record not found' }, { status: 400 });
    }

    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const currentTimeStr = now.toTimeString().split(' ')[0].substring(0, 5); 

    if (action === 'clock-in') {
      
      const alreadyClockedIn = db.attendanceLogs.some(
        (log) => log.employeeId === employee.id && log.date === today
      );

      if (alreadyClockedIn) {
        return NextResponse.json({ error: 'Already clocked in for today' }, { status: 400 });
      }

      const [hours, minutes] = currentTimeStr.split(':').map(Number);
      const isLate = hours > 9 || (hours === 9 && minutes > 15);
      const attendanceStatus = isLate ? 'Late' : 'On-Time';

      const nextIdNum = db.attendanceLogs.length + 1;
      const newLog: AttendanceLog = {
        id: `ATT${nextIdNum.toString().padStart(3, '0')}`,
        employeeId: employee.id,
        employeeName: employee.name,
        date: today,
        clockIn: currentTimeStr,
        status: attendanceStatus,
      };

      db.attendanceLogs.push(newLog);

      return NextResponse.json({ success: true, log: newLog, message: 'Clocked in successfully' });
    } else {
      
      const logIndex = db.attendanceLogs.findIndex(
        (log) => log.employeeId === employee.id && log.date === today && !log.clockOut
      );

      if (logIndex === -1) {
        return NextResponse.json({ error: 'No active clock-in log found for today' }, { status: 400 });
      }

      const log = db.attendanceLogs[logIndex];
      log.clockOut = currentTimeStr;

      const [inH, inM] = log.clockIn.split(':').map(Number);
      const [outH, outM] = currentTimeStr.split(':').map(Number);
      const diffMs = (outH * 60 + outM) - (inH * 60 + inM);
      const hoursWorked = Math.round((diffMs / 60) * 100) / 100; 

      log.totalHours = hoursWorked;

      return NextResponse.json({ success: true, log, message: 'Clocked out successfully' });
    }
  } catch (error) {
    console.error('POST Attendance error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
