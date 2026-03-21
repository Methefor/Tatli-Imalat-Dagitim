// Tatlı Takip — Service Worker
const CACHE = 'tatli-takip-v9';

const STATIC = [
    '/',
    '/index.html',
    '/branch-menu.html',
    '/gelen-tatlilar.html',
    '/kalan-tatlilar.html',
    '/uretim.html',
    '/subem.html',
    '/admin-dashboard.html',
    '/superadmin.html',
    '/tatlilar-panel.html',
    '/transfer.html',
    '/zayiat.html',
    '/dagitim.html',
    '/supabase-client.js',
    '/manifest.json',
    '/icon-192.png',
    '/icon-512.png',
    '/maskable-192.png',
    '/maskable-512.png',
    '/favicon.svg',
    '/apple-touch-icon.png',
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE).then(c => c.addAll(STATIC)).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

// ── Push Bildirimleri ────────────────────────────────────
self.addEventListener('push', event => {
    const data = event.data ? event.data.json() : {};
    const title   = data.title || '⚠️ Tatlı Takip';
    const options = {
        body:  data.body  || 'Kalan tatlılar girilmedi!',
        icon:  '/icon-192.png',
        badge: '/maskable-192.png',
        tag:   data.tag   || 'tatli-bildirim',
        data:  { url: data.url || '/branch-menu.html' }
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    const url = event.notification.data?.url || '/branch-menu.html';
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
            for (const client of list) {
                if (client.url.endsWith(url) && 'focus' in client) return client.focus();
            }
            return clients.openWindow ? clients.openWindow(url) : null;
        })
    );
});

self.addEventListener('fetch', e => {
    // Supabase API isteklerini her zaman ağdan çek
    if (e.request.url.includes('supabase.co')) {
        e.respondWith(fetch(e.request));
        return;
    }
    // Diğerleri: cache-first, arka planda güncelle
    e.respondWith(
        caches.match(e.request).then(cached => {
            const fresh = fetch(e.request).then(res => {
                if (res && res.status === 200 && res.type === 'basic') {
                    caches.open(CACHE).then(c => c.put(e.request, res.clone()));
                }
                return res;
            }).catch(() => cached);
            return cached || fresh;
        })
    );
});
