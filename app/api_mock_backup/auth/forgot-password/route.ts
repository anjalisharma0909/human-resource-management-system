import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/utils/db';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const user = db.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!user) {

      return NextResponse.json(
        { error: 'User with this email does not exist' },
        { status: 404 }
      );
    }

    const token = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
    const expires = Date.now() + 3600000; 

    db.resetTokens[token] = {
      email: user.email,
      expires,
    };

    const resetLink = `/reset-password?token=${token}`;
    console.log(`[MOCK EMAIL] Password reset request for ${user.email}. Link: ${resetLink}`);

    return NextResponse.json({
      success: true,
      message: 'Reset link generated successfully. Check server logs or use the link below.',
      resetLink,
      token,
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
