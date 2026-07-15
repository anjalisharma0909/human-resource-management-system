import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/utils/db';
import { signAccessToken, signRefreshToken } from '@/utils/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Identifier and password are required' },
        { status: 400 }
      );
    }

    const identifier = (email as string).trim();

    const isEmail = identifier.includes('@');

    let user;
    if (isEmail) {
      user = db.users.find(
        (u) => u.email.toLowerCase() === identifier.toLowerCase()
      );
    } else {
      
      const upperIdentifier = identifier.toUpperCase();
      
      user = db.users.find((u) => u.id.toUpperCase() === upperIdentifier);

      if (!user) {
        
        const employeeRecord = db.employees.find(
          (e) => e.id.toUpperCase() === upperIdentifier
        );
        if (employeeRecord) {
          user = db.users.find(
            (u) => u.email.toLowerCase() === employeeRecord.email.toLowerCase()
          );
        }
      }
    }

    if (!user || user.passwordHash !== password) {
      return NextResponse.json(
        { error: 'Invalid credentials. Please check your ID/email and password.' },
        { status: 401 }
      );
    }

    const payload = {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const accessToken = await signAccessToken(payload);
    const refreshToken = await signRefreshToken({ userId: user.id });

    const cookieStore = await cookies();
    cookieStore.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, 
    });

    return NextResponse.json({
      success: true,
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        organization: user.organization,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
