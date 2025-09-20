import { withCors } from '../_cors.js';

export default withCors(async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const path = req.query.path || [];
  const base = process.env.REUSELY_BASE || 'api-us.reusely.com';
  const url = `https://${base}/public/v1/${path.join('/')}${req.url.includes('?') ? '' : ''}`;

  try {
    const r = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-tenant-id': process.env.REUSELY_TENANT_ID,
        'x-api-key': process.env.REUSELY_API_KEY,
      },
    });

    const data = await r.json();
    if (!r.ok) {
      return res.status(r.status).json({ error: 'Upstream error', status: r.status, detail: data?.message || data });
    }
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Proxy failed', detail: String(err) });
  }
});
