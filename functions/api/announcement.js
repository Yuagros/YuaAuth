const json = (data, init = {}) =>
    new Response(JSON.stringify(data), {
        headers: {
            'content-type': 'application/json',
            'cache-control': 'no-store'
        },
        ...init
    });

export async function onRequestGet({ env }) {
    const raw = await env.ANNOUNCEMENTS?.get('current');
    if (!raw) {
        return json({ active: false });
    }

    let data;
    try {
        data = JSON.parse(raw);
    } catch {
        return json({ active: false });
    }

    const now = Date.now();
    if (!data?.message || !data?.endsAt || now > data.endsAt) {
        await env.ANNOUNCEMENTS?.delete('current');
        return json({ active: false });
    }

    return json({
        active: true,
        message: data.message,
        startsAt: data.startsAt,
        endsAt: data.endsAt
    });
}
