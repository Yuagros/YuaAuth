// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Repeatable reveal animation on scroll
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        } else {
            entry.target.classList.remove('is-visible');
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.reveal').forEach((el, index) => {
    el.style.transitionDelay = `${Math.min(index * 80, 320)}ms`;
    revealObserver.observe(el);
});

// Announcement banner
const banner = document.getElementById('announcement-banner');
if (banner) {
    fetch('/api/announcement')
        .then(response => response.ok ? response.json() : null)
        .then(data => {
            if (!data || !data.active || !data.message) return;
            const messageEl = banner.querySelector('.announcement-message');
            const endsEl = banner.querySelector('.announcement-ends');
            if (messageEl) messageEl.textContent = data.message;
            if (endsEl && data.endsAt) {
                const endDate = new Date(data.endsAt);
                endsEl.textContent = `Ends ${endDate.toLocaleString()}`;
            }
            banner.hidden = false;
        })
        .catch(() => {});
}

// Admin panel logic
const adminForm = document.getElementById('admin-form');
if (adminForm) {
    const statusEl = document.getElementById('admin-status');
    const clearBtn = document.getElementById('admin-clear');

    adminForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const passphrase = document.getElementById('admin-passphrase').value.trim();
        const message = document.getElementById('admin-message').value.trim();
        const duration = Number(document.getElementById('admin-duration').value);

        if (!passphrase || !message || !duration) {
            statusEl.textContent = 'Enter passphrase, message, and duration.';
            return;
        }

        statusEl.textContent = 'Publishing...';
        const response = await fetch('/api/announcement/admin', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${passphrase}`
            },
            body: JSON.stringify({ message, durationMinutes: duration })
        });

        const data = await response.json().catch(() => ({}));
        statusEl.textContent = response.ok ? 'Announcement published.' : (data.error || 'Failed to publish.');
    });

    clearBtn?.addEventListener('click', async () => {
        const passphrase = document.getElementById('admin-passphrase').value.trim();
        if (!passphrase) {
            statusEl.textContent = 'Enter passphrase to clear.';
            return;
        }
        statusEl.textContent = 'Clearing...';
        const response = await fetch('/api/announcement/admin', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${passphrase}`
            },
            body: JSON.stringify({ clear: true })
        });
        const data = await response.json().catch(() => ({}));
        statusEl.textContent = response.ok ? 'Announcement cleared.' : (data.error || 'Failed to clear.');
    });
}
