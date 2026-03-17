export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const slug = url.searchParams.get('slug');
    const type = url.searchParams.get('type') || 'like';
    const pct  = url.searchParams.get('pct');

    const ALLOWED = ['https://pradeepg.me', 'https://www.pradeepg.me'];
    const origin = request.headers.get('Origin') || '';
    const corsOrigin = ALLOWED.includes(origin) ? origin : ALLOWED[0];

    const headers = {
      'Access-Control-Allow-Origin': corsOrigin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Content-Type': 'application/json',
    };

    if (request.method === 'OPTIONS') return new Response(null, { headers });
    if (!slug) return new Response(JSON.stringify({ error: 'missing slug' }), { status: 400, headers });

    // --- Likes (existing, unchanged) ---
    if (type === 'like') {
      if (request.method === 'GET') {
        const count = parseInt(await env.LIKES.get(slug) || '0');
        return new Response(JSON.stringify({ count }), { headers });
      }
      if (request.method === 'POST') {
        const current = parseInt(await env.LIKES.get(slug) || '0');
        const next = current + 1;
        await env.LIKES.put(slug, String(next));
        return new Response(JSON.stringify({ count: next }), { headers });
      }
    }

    // --- View counter ---
    if (type === 'view') {
      const key = 'view:' + slug;
      if (request.method === 'GET') {
        const count = parseInt(await env.VIEWS.get(key) || '0');
        return new Response(JSON.stringify({ count }), { headers });
      }
      if (request.method === 'POST') {
        const current = parseInt(await env.VIEWS.get(key) || '0');
        const next = current + 1;
        await env.VIEWS.put(key, String(next));
        return new Response(JSON.stringify({ count: next }), { headers });
      }
    }

    // --- Reading depth ---
    if (type === 'depth') {
      if (!['25', '50', '75', '100'].includes(pct)) {
        return new Response(JSON.stringify({ error: 'invalid pct' }), { status: 400, headers });
      }
      const key = `depth:${pct}:${slug}`;
      if (request.method === 'POST') {
        const current = parseInt(await env.VIEWS.get(key) || '0');
        await env.VIEWS.put(key, String(current + 1));
        return new Response(JSON.stringify({ ok: true }), { headers });
      }
      if (request.method === 'GET') {
        const counts = await Promise.all(
          ['25','50','75','100'].map(async p => [p, parseInt(await env.VIEWS.get(`depth:${p}:${slug}`) || '0')])
        );
        return new Response(JSON.stringify(Object.fromEntries(counts)), { headers });
      }
    }

    return new Response('Method not allowed', { status: 405, headers });
  },
};
