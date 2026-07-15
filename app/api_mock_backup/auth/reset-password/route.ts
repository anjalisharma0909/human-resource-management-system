import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/utils/db';

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and new password are required' },
        { status: 400 }
      );
    }

    const resetInfo = db.resetTokens[token];

    if (!resetInfo) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    if (Date.now() > resetInfo.expires) {
      delete db.resetTokens[token];
      return NextResponse.json(
        { error: 'Reset token has expired' },
        { status: 400 }
      );
    }

    const userIndex = db.users.findIndex(
      (u) => u.email.toLowerCase() === resetInfo.email.toLowerCase()
    );

    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    db.users[userIndex].passwordHash = password;

    delete db.resetTokens[token];

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully. You can now login with your new password.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
