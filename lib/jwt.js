import { sign } from 'jsonwebtoken';
import { jwtVerify } from 'jose';

const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) {
  throw new Error("JWT_SECRET environment variable is not defined.");
}

export const signToken = (payload) => {
  return sign(payload, SECRET_KEY, { expiresIn: '1h' });
};



export async function verifyToken(token) {
  const secret = new TextEncoder().encode(process.env.SECRET_KEY);
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.error("JWT Doğrulama Hatası:", error);
    return null;
  }
}