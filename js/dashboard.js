const dashboardEndpoint = "/api/dashboard";

const formatNumber = (value) => {
    if (typeof value !== "number") {
        return value ?? "--";
    }
    return value.toLocaleString();
};

const formatPercentage = (value) => {
    if (typeof value !== "number") {
        return value ?? "--";
    }
    return `${value}%`;
};

const formatDuration = (seconds) => {
    if (typeof seconds !== "number") {
        return seconds ?? "--";
    }
    const totalMinutes = Math.max(1, Math.round(seconds / 60));
    if (totalMinutes < 60) {
        return `${totalMinutes}m`;
    }
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`;
};

const setText = (selector, value) => {
    const node = document.querySelector(selector);
    if (node) {
        node.textContent = value;
    }
};

const updateDashboard = (payload) => {
    if (!payload) {
        return;
    }

    const { stats = {}, insights = {}, status = {}, updatedAt } = payload;

    setText('[data-stat="activeSessions"]', formatNumber(stats.activeSessions));
    setText('[data-stat="licenseHealth"]', formatPercentage(stats.licenseHealthPct));
    setText('[data-stat="flaggedDevices"]', formatNumber(stats.flaggedDevices));
    setText('[data-stat="avgVerification"]', formatDuration(stats.avgVerificationSeconds));

    setText('[data-insight="licensePolicy"]', insights.licensePolicy);
    setText('[data-insight="globalEdge"]', insights.globalEdge);
    setText('[data-insight="recentEvents"]', insights.recentEvents);

    if (status.label) {
        setText('[data-status="label"]', status.label);
    }

    if (updatedAt) {
        const updatedDate = new Date(updatedAt);
        if (!Number.isNaN(updatedDate.getTime())) {
            setText('[data-updated="timestamp"]', `Last updated ${updatedDate.toLocaleString()}`);
        }
    }
};

const loadDashboard = async () => {
    try {
        const response = await fetch(dashboardEndpoint, { headers: { "accept": "application/json" } });
        if (!response.ok) {
            throw new Error(`Dashboard fetch failed: ${response.status}`);
        }
        const data = await response.json();
        updateDashboard(data);
    } catch (error) {
        console.warn("Dashboard data unavailable.", error);
    }
};

loadDashboard();
