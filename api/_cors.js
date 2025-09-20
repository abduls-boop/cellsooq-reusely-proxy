// api/_cors.js

export function withCors(handler) {
  return async (req, res) => {
    const origin = req.headers.origin || '*';
    const requestHeaders = req.headers['access-control-request-headers'];

    // Always set CORS headers (before early returns)
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin, Access-Control-Request-Headers');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    // Mirror whatever the browser asked for, or provide a permissive default
    res.setHeader(
      'Access-Control-Allow-Headers',
      requestHeaders || 'content-type, x-tenant-id, x-api-key, accept'
    );

    // Preflight ends here
    if (req.method === 'OPTIONS') {
      // 204 = No Content (cleaner than 200)
      res.status(204).end();
      return;
    }

    // Run the actual handler
    return handler(req, res);
  };
}
