import { withCors } from '../../_cors.js';

// /api/public/catalog/models?brand=<slug_brand>&device=<slug_device>
async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const base = (process.env.REUSELY_BASE || 'https://api-us.reusely.com/api/v2').replace(/\/+$/,'');
  const brand  = (req.query.brand  || '').toString().trim().toLowerCase();
  const device = (req.query.device || '').toString().trim().toLowerCase();
  if (!brand || !device) return res.status(400).json({ error: 'Missing brand and/or device. Example: ?brand=apple&device=iphone' });

  // Reusely doc: list models for a brand + device (series)
  const url = `${base}/public/catalog/model-device/${encodeURIComponent(brand)}/${encodeURIComponent(device)}`;

  try {
    const r = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
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

