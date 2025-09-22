import { withCors } from '../../_cors.js';

// GET /api/public/catalog/devices?category_slug=smartphones&page=1
async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const base = (process.env.REUSELY_BASE || 'https://api-us.reusely.com/api/v2').replace(/\/+$/,'');
  const categorySlug = (req.query.category_slug || '').toString().trim().toLowerCase();
  const page = (req.query.page || '1').toString().trim();
  if (!categorySlug) return res.status(400).json({ error: 'Missing ?category_slug' });

  const url = `${base}/public/catalog/category-brand/${encodeURIComponent(categorySlug)}?page=${encodeURIComponent(page)}`;

  try {
    const r = await fetch(url, {
      headers: {
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

