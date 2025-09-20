// api/_cors.js
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
  'Access-Control-Allow-Headers': 'content-type, x-tenant-id, x-api-key, authorization',
};

export function withCors(handler) {
  return async (req, res) => {
    if (req.method === 'OPTIONS') {
      for (const [k, v] of Object.entries(corsHeaders)) res.setHeader(k, v);
      return res.status(200).end();
    }
    const out = await handler(req, res);
    for (const [k, v] of Object.entries(corsHeaders)) res.setHeader(k, v);
    return out;
  };
}
