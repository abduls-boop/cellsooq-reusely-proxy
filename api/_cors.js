// api/_cors.js
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Tenant-Id, X-API-Key',
};

export function withCors(handler) {
  return async (req, res) => {
    if (req.method === 'OPTIONS') {
      Object.entries(corsHeaders).forEach(([k, v]) => res.setHeader(k, v));
      return res.status(200).end();
    }
    try {
      const out = await handler(req, res);
      Object.entries(corsHeaders).forEach(([k, v]) => res.setHeader(k, v));
      return out;
    } catch (e) {
      Object.entries(corsHeaders).forEach(([k, v]) => res.setHeader(k, v));
      return res.status(500).json({ error: 'Proxy failed', detail: String(e) });
    }
  };
}
