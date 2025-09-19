export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // path can be string or array; join safely
  const raw = req.query.path;
  const path = Array.isArray(raw) ? raw.join('/') : (raw || '');

  // Build v2 public URL
  const base = process.env.REUSELY_BASE?.replace(/\/+$/,''); // trim trailing slash
  const search = new URLSearchParams(req.query);
  search.delete('path'); // remove our catch-all param
  const qs = search.toString();
  const url = `${base}/api/v2/public/${path}${qs ? `?${qs}` : ''}`;

  try {
    const r = await fetch(url, {
      method: 'GET',
      headers: {
        'x-tenant-id': process.env.REUSELY_TENANT_ID,
        'x-api-key': process.env.REUSELY_API_KEY,
        'content-type': 'application/json',
        'accept': 'application/json'
      }
    });

    const text = await r.text(); // keep error bodies intact
    res.status(r.status).send(text);
  } catch (err) {
    res.status(502).json({ error: 'Proxy failed', detail: String(err) });
  }
}

