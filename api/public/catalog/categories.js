// /api/public/catalog/categories
export default async function handler(req, res) {
  // --- CORS ---
  res.setHeader('Access-Control-Allow-Origin', '*'); // or your store domain
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  // --------------

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const base = process.env.REUSELY_BASE || 'https://api-us.reusely.com';
  const url  = `${base}/api/v2/public/catalog/categories`;

  try {
    const r = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-tenant-id': process.env.REUSELY_TENANT_ID,
        'x-api-key'  : process.env.REUSELY_API_KEY
      }
    });

    const data = await r.json();
    if (!r.ok) {
      return res.status(r.status).json({ error: 'Upstream error', status: r.status, detail: data?.message || data });
    }
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Proxy failed', detail: String(err) });
  }
}
