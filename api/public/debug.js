export default async function handler(req, res) {
  try {
    const base = (process.env.REUSELY_BASE || '').trim();
    const tenant = (process.env.REUSELY_TENANT_ID || '').trim();
    const key = (process.env.REUSELY_API_KEY || '').trim();

    // Try a simple network reachability check (no auth, we expect 404 but not "fetch failed")
    let reach = null;
    try {
      const r = await fetch(`${base}/`, { method: 'GET' });
      reach = { ok: true, status: r.status };
    } catch (e) {
      reach = { ok: false, error: String(e) };
    }

    res.status(200).json({
      ok: true,
      env: {
        REUSELY_BASE: base,
        REUSELY_TENANT_ID: tenant ? 'present' : 'missing',
        REUSELY_API_KEY: key ? 'present' : 'missing',
      },
      reach,
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
}
