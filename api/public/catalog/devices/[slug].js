export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { slug } = req.query; // e.g. 'smartphones'
  const url = `${process.env.REUSELY_BASE}/public/catalog/category-brand/${encodeURIComponent(slug)}`;

  try {
    const r = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'x-tenant-id': process.env.REUSELY_TENANT_ID,
        'x-api-key': process.env.REUSELY_API_KEY,
      },
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: 'Upstream error', status: r.status, detail: data?.message || data });
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Proxy failed', detail: String(err) });
  }
}
