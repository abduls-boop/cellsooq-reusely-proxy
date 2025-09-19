export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const path = req.query.path || [];
  const url = `${process.env.REUSELY_BASE}/public/v1/${path.join('/')}`;

  try {
    const response = await fetch(url, {
      headers: {
        'X-Tenant-Id': process.env.REUSELY_TENANT_ID,
        'X-Public-Key': process.env.REUSELY_PUBLIC_KEY
      }
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
