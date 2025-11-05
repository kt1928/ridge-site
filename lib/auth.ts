import { NextRequest } from 'next/server';

/**
 * Simple auth check for admin routes
 * TODO: Replace with Authelia/Authentik SSO or proper auth middleware
 * For now, checks for a basic auth header or admin API key
 */
export function isAdmin(request: NextRequest): boolean {
  // Check for admin API key in header
  const apiKey = request.headers.get('x-admin-api-key');
  const expectedKey = process.env.ADMIN_API_KEY || 'dev-admin-key';

  if (apiKey === expectedKey) {
    return true;
  }

  // Check for basic auth
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Basic ')) {
    const base64Credentials = authHeader.slice(6);
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    const expectedUser = process.env.ADMIN_USERNAME || 'admin';
    const expectedPass = process.env.ADMIN_PASSWORD || 'admin';

    return username === expectedUser && password === expectedPass;
  }

  return false;
}

export function unauthorizedResponse() {
  return new Response(
    JSON.stringify({ error: 'Unauthorized' }),
    {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
        'WWW-Authenticate': 'Basic realm="Admin Area"',
      },
    }
  );
}
