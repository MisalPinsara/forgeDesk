import { NextRequest, NextResponse } from 'next/server';

export function json(request: NextRequest, body: unknown, init?: ResponseInit) {
  const response = NextResponse.json(body, init);
  const origin = request.headers.get('origin');
  if (origin === (process.env.CLIENT_ORIGIN || 'http://localhost:5173')) response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  response.headers.set('Vary', 'Origin');
  return response;
}

export function error(request: NextRequest, message: string, status = 400) {
  return json(request, { error: message }, { status });
}

export function options(request: NextRequest) {
  return json(request, {}, { status: 204 });
}
