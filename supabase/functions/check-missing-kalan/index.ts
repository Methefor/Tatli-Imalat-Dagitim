// Supabase Edge Function: check-missing-kalan
// Cron: Her gün 22:00'de çalışır (Türkiye saati: UTC+3 → UTC 19:00)
// Görev: Bugün kalan girilmemiş şubelere push bildirimi gönderir

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import webpush from 'npm:web-push@3';

// ── Ortam Değişkenleri ─────────────────────────────────────────────
// Supabase Dashboard → Edge Functions → Secrets'a ekle:
//   VAPID_PUBLIC_KEY  = npx web-push generate-vapid-keys çıktısından
//   VAPID_PRIVATE_KEY = npx web-push generate-vapid-keys çıktısından
//   VAPID_EMAIL       = mailto:admin@sirket.com
const VAPID_PUBLIC_KEY  = Deno.env.get('VAPID_PUBLIC_KEY')  ?? '';
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY') ?? '';
const VAPID_EMAIL       = Deno.env.get('VAPID_EMAIL')       ?? 'mailto:admin@tatli.com';

webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

Deno.serve(async () => {
    try {
        const today = new Date().toISOString().split('T')[0];

        // 1) Bugün kalan girilmemiş şubeler
        const { data: allBranches } = await supabase.from('branches').select('id, name');
        const { data: completedToday } = await supabase
            .from('daily_entries')
            .select('branch_id')
            .eq('entry_date', today)
            .not('remaining_amount', 'is', null);

        const completedIds = new Set((completedToday || []).map(r => String(r.branch_id)));
        const missingBranches = (allBranches || []).filter(b => !completedIds.has(String(b.id)));

        if (missingBranches.length === 0) {
            return new Response(JSON.stringify({ message: 'Tüm şubeler tamamladı.' }), { status: 200 });
        }

        const missingIds = missingBranches.map(b => b.id);

        // 2) Eksik şubelerin push abonelikleri
        const { data: subs } = await supabase
            .from('push_subscriptions')
            .select('subscription, branch_id')
            .in('branch_id', missingIds);

        if (!subs || subs.length === 0) {
            return new Response(JSON.stringify({ message: 'Kayıtlı abonelik yok.' }), { status: 200 });
        }

        // 3) Bildirimleri gönder
        const missingNames = missingBranches.map(b => b.name).join(', ');
        const payload = JSON.stringify({
            title: '⚠️ Kalan Tatlılar Girilmedi',
            body:  `Bugün (${today}) kalan tatlılar henüz girilmedi!`,
            url:   '/kalan-tatlilar.html',
            tag:   'kalan-uyari'
        });

        const results = await Promise.allSettled(
            subs.map(s => webpush.sendNotification(s.subscription, payload))
        );

        const sent   = results.filter(r => r.status === 'fulfilled').length;
        const failed = results.filter(r => r.status === 'rejected').length;

        return new Response(JSON.stringify({
            message: `${missingNames} — ${sent} bildirim gönderildi, ${failed} başarısız.`,
            missing: missingBranches.map(b => b.name)
        }), { status: 200 });
    } catch (err) {
        console.error('check-missing-kalan error:', err);
        return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
    }
});
