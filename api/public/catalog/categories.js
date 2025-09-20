// api/public/catalog/categories.js
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const base = process.env.REUSELY_BASE || 'https://api-us.reusely.com'; // ensure https + correct region
  // Reusely public API = v2
  const url = `${base}/api/v2/public/catalog/categories`;

  try {
    const r = await fetch(url, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'x-tenant-id': process.env.REUSELY_TENANT_ID,
        'x-api-key': process.env.REUSELY_API_KEY,
      },
    });

    const text = await r.text(); // pass through upstream payload so we can SEE exact errors

    if (!r.ok) {
      // Bubble up everything so debugging is easy
      return res
        .status(r.status)
        .json({ error: 'Upstream error', status: r.status, detail: text, url });
    }

    // If upstream is OK, return as JSON
    res.setHeader('content-type', 'application/json');
    return res.status(200).send(text);
  } catch (err) {
    return res
      .status(500)
      .json({ error: 'Proxy failed', detail: String(err), url });
  }
}
