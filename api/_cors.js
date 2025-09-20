// api/_cors.js
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
  // allow the headers we send to Reusely and common ones
  'Access-Control-Allow-Headers': 'Content-Type, X-Tenant-Id, X-API-Key',
};

export function withCors(handler) {
  return async (req, res) => {
    // handle preflight
    if (req.method === 'OPTIONS') {
      Object.entries(corsHeaders).forEach(([k, v]) => res.setHeader(k, v));
      return res.status(200).end();
    }

    // run the real handler
    const out = await handler(req, res);

    // ensure CORS on every response
    Object.entries(corsHeaders).forEach(([k, v]) => res.setHeader(k, v));
    return out;
  };
}
