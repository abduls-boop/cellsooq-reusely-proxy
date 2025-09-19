// api/public/catalog/categories.js
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const base = process.env.REUSELY_BASE || 'api-us.reusely.com'; // no https
  const url  = `https://${base}/public/v1/catalog/categories`;

  try {
    const r = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-tenant-id': process.env.REUSELY_TENANT_ID,
        'x-api-key':    process.env.REUSELY_API_KEY,
      },
    });

    const data = await r.json();
    if (!r.ok) {
      return res.status(r.status).json({ error: data?.message || 'Upstream error' });
    }
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Proxy failed', detail: String(err) });
  }
}
