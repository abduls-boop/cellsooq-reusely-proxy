// /api/public/catalog/categories.js
// Proxies Reusely Public API → categories list

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Ensure we have a proper https base and no trailing slash
  const base = (process.env.REUSELY_BASE || 'https://api-us.reusely.com').replace(/\/+$/, '');
  // Reusely Public API uses v2; endpoint is singular: /catalog/category
  const url = `${base}/api/v2/public/catalog/category`;

  try {
    const r = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'x-tenant-id': process.env.REUSELY_TENANT_ID,
        'x-api-key': process.env.REUSELY_API_KEY,
      },
    });

    const text = await r.text();
    let data;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    if (!r.ok) {
      return res.status(r.status).json({
        error: 'Upstream error',
        status: r.status,
        detail: typeof data === 'object' ? data : text,
      });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(502).json({ error: 'Proxy failed', detail: String(err) });
  }
}

