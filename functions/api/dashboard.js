export async function onRequestGet() {
    const data = {
        updatedAt: new Date().toISOString(),
        stats: {
            activeSessions: 1284,
            licenseHealthPct: 98,
            flaggedDevices: 24,
            avgVerificationSeconds: 720
        },
        insights: {
            licensePolicy: "Hardware lock enabled. 2-factor device fingerprinting.",
            globalEdge: "Verification routed through 12 edge regions.",
            recentEvents: "3 keys revoked, 12 sessions validated, 0 incidents."
        },
        status: {
            label: "All Systems Operational"
        }
    };

    return new Response(JSON.stringify(data, null, 2), {
        headers: {
            "content-type": "application/json; charset=utf-8",
            "cache-control": "no-store"
        }
    });
}
