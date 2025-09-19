// api/public/catalog/products.js
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Falls back to US if the env var isn't set
  const base = (process.env.REUSELY_BASE || 'https://api-us.reusely.com').replace(/\/+$/, '');
  // Upstream "product" endpoint (singular per Reusely's API shape)
  const upstream = `${base}/api/v2/public/catalog/product`;

  // Keep any query string the caller provides (e.g. ?category=smartphones&page=1)
  const qs = new URLSearchParams(req.query).toString();
  const url = qs ? `${upstream}?${qs}` : upstream;

  try {
    const r = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-tenant-id': process.env.REUSELY_TENANT_ID,
        'x-api-key': process.env.REUSELY_API_KEY,
      },
      // Small timeout safeguard (optional)
      // next: { revalidate: 0 }
    });

    const data = await r.json();

    if (!r.ok) {
      return res
        .status(r.status)
        .json({ error: 'Upstream error', status: r.status, detail: data?.message || data });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Proxy failed', detail: String(err) });
  }
}
