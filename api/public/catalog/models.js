// api/public/catalog/models.js
import { withCors } from '../../_cors.js';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const base   = (process.env.REUSELY_BASE || 'https://api-us.reusely.com/api/v2').replace(/\/+$/,'');
  const brand  = (req.query.brand  || '').toString().trim().toLowerCase();
  const device = (req.query.device || '').toString().trim().toLowerCase();
  const page   = (req.query.page   || '1').toString();

  if (!brand || !device) {
    return res.status(400).json({ error: 'Missing brand or device', brand, device });
  }

  // Per docs: /public/catalog/model-device/{brand}/{device}?page=1
  const url = `${base}/public/catalog/model-device/${encodeURIComponent(brand)}/${encodeURIComponent(device)}?page=${encodeURIComponent(page)}`;

  try {
    const r = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'x-tenant-id': (process.env.REUSELY_TENANT_ID || '').trim(),
        'x-api-key'  : (process.env.REUSELY_API_KEY   || '').trim(),
      },
    });

    const data = await r.json().catch(() => null);

    if (!r.ok) {
      return res.status(r.status).json({
        error: 'Upstream error',
        status: r.status,
        detail: data?.message || data || 'Unknown',
        debug: { brand, device, url }
      });
    }

    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: 'Proxy failed', detail: String(e), debug: { brand, device, url } });
  }
}

export default withCors(handler);