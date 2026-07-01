import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/utils/db';
import { verifyToken, signAccessToken } from '@/utils/auth';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token missing' },
        { status: 401 }
      );
    }

    const payload = await verifyToken(refreshToken);
    if (!payload || !payload.userId) {
      return NextResponse.json(
        { error: 'Invalid or expired refresh token' },
        { status: 401 }
      );
    }

    const user = db.users.find((u) => u.id === payload.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      );
    }

    const newPayload = {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const accessToken = await signAccessToken(newPayload);

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
    console.error('Refresh token error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
