import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'super-secret-key-hrms-1234567890-abcdef-xyz-987654'
);

export interface TokenPayload {
  userId: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Employee';
}

export async function signAccessToken(payload: TokenPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m') 
    .sign(JWT_SECRET);
}

export async function signRefreshToken(payload: { userId: string }): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') 
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<any | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}
