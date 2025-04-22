import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const systemKey = req.headers.get('x-system-key');
  const validSystemKey = process.env.NEXT_PUBLIC_X_SYSTEM_KEY;

  // Enforce x-system-key on all /api/* routes
  if (pathname.startsWith('/api')) {
    if (systemKey !== validSystemKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
