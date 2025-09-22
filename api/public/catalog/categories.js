import { withCors } from '../../_cors.js';

async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const base = (process.env.REUSELY_BASE || 'https://api-us.reusely.com/api/v2').replace(/\/+$/,'');
  const url  = `${base}/public/catalog/categories`;

  try {
    const r = await fetch(url, {
      headers: {
        'x-tenant-id': (process.env.REUSELY_TENANT_ID || '').trim(),
        'x-api-key'  : (process.env.REUSELY_API_KEY   || '').trim(),
      },
    });
    const data = await r.json().catch(() => null);
    if (!r.ok) return res.status(r.status).json({ error: 'Upstream error', status: r.status, detail: data?.message || data || 'Unknown' });
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: 'Proxy failed', detail: String(e) });
  }
}

export default withCors(handler);

