const json = (data, init = {}) =>
    new Response(JSON.stringify(data), {
        headers: {
            'content-type': 'application/json',
            'cache-control': 'no-store'
        },
        ...init
    });

const unauthorized = () => json({ error: 'Unauthorized' }, { status: 401 });

export async function onRequestPost({ request, env }) {
    const auth = request.headers.get('authorization') || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    if (!token || token !== env.ANNOUNCEMENT_ADMIN_PASSPHRASE) {
        return unauthorized();
    }

    const body = await request.json().catch(() => ({}));

    if (body.clear) {
        await env.ANNOUNCEMENTS?.delete('current');
        return json({ ok: true });
    }

    const message = String(body.message || '').trim();
    const durationMinutes = Number(body.durationMinutes || 0);

    if (!message || !Number.isFinite(durationMinutes) || durationMinutes < 1) {
        return json({ error: 'Invalid payload' }, { status: 400 });
    }

    const startsAt = Date.now();
    const endsAt = startsAt + Math.min(durationMinutes, 10080) * 60 * 1000;

    await env.ANNOUNCEMENTS?.put(
        'current',
        JSON.stringify({ message, startsAt, endsAt })
    );

    return json({ ok: true, startsAt, endsAt });
}
