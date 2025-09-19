export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const path = req.query.path || [];
  const qs = new URLSearchParams(req.query);
  qs.delete('path'); // remove the internal catch-all param

  const url = `${process.env.REUSELY_BASE}/public/v1/${path.join('/')}${qs.toString() ? `?${qs}` : ''}`;

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
    return res.status(r.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch data' });
  }
}

