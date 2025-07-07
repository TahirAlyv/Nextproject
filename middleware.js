import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

export async function middleware(request) {
  const token = request.cookies.get('token')?.value;
  console.log('Token:', token);

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    await verifyToken(token);
    return NextResponse.next();
  } catch (error) {
    console.log("Error: ", error)
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('token', { path: '/' });
    return response;
  }
}

export const config = {
  matcher: ['/review', '/watchlist', '/comment/:path*', '/profile/:path*', '/movie/:id:path*']
};
