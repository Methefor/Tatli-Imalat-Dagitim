// Tatlı Takip — Service Worker
const CACHE = 'tatli-takip-v40';

// Sadece resimler/ikonlar cache-first; HTML ve JS her zaman ağdan gelir
const CACHE_ONLY_ASSETS = [
    '/icon-192.png',
    '/icon-512.png',
    '/maskable-192.png',
    '/maskable-512.png',
    '/favicon.svg',
    '/apple-touch-icon.png',
    '/manifest.json',
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE)
            .then(c => c.addAll(CACHE_ONLY_ASSETS).catch(() => {}))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys.filter(k => k !== CACHE).map(k => caches.delete(k))
            ))
            .then(() => self.clients.claim())
            .then(() => self.clients.matchAll({ type: 'window' }))
            .then(clients => {
                // Yeni SW aktif olunca tüm açık sekmelere güncelleme bildirimi gönder
                clients.forEach(c => c.postMessage({ type: 'SW_UPDATED' }));
            })
    );
});

self.addEventListener('fetch', e => {
    const url = e.request.url;

    // Supabase API → her zaman ağdan
    if (url.includes('supabase.co')) {
        e.respondWith(fetch(e.request));
        return;
    }

    // Resimler ve ikonlar → cache-first (nadiren değişir)
    if (CACHE_ONLY_ASSETS.some(a => url.endsWith(a))) {
        e.respondWith(
            caches.match(e.request).then(cached => cached || fetch(e.request))
        );
        return;
    }

    // HTML, JS, her şey → network-first
    // Ağ varsa her zaman taze versiyon gelir; ağ yoksa cache'den sun
    e.respondWith(
        fetch(e.request)
            .then(res => {
                if (res && res.status === 200 && res.type === 'basic') {
                    const clone = res.clone();
                    caches.open(CACHE).then(c => c.put(e.request, clone));
                }
                return res;
            })
            .catch(() => caches.match(e.request))
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

self.addEventListener('message', e => {
    if (e.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
