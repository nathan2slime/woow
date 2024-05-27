import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const middleware = async (request: NextRequest) => {
  const headers = new Headers(request.headers);

  const url = new URL(request.url);
  headers.set('x-pathname', url.pathname);

  return NextResponse.next({ headers });
};

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

export default middleware;
