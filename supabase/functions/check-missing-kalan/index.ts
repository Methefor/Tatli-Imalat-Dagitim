// Supabase Edge Function: check-missing-kalan
// Cron: Her gün 22:00'de çalışır (Türkiye saati: UTC+3 → UTC 19:00)
// Görev: Bugün kalan girilmemiş şubelere push bildirimi gönderir

// @deno-types="npm:@types/web-push@3"
import webpush from 'npm:web-push@3';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Push subscription tipi (Supabase jsonb olarak saklar)
interface PushSub {
    endpoint: string;
    expirationTime?: number | null;
    keys: { auth: string; p256dh: string };
}

interface Branch {
    id: string | number;
    name: string;
}

interface SubRow {
    subscription: PushSub;
    branch_id: string | number;
}

const JSON_HEADER = { 'Content-Type': 'application/json' };

function jsonResponse(body: unknown, status = 200): Response {
    return new Response(JSON.stringify(body), { status, headers: JSON_HEADER });
}

const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

Deno.serve(async () => {
    try {
        // ── VAPID ayarları (her istekte okunur — boş key sorunu önlenir) ──
        const VAPID_PUBLIC_KEY  = Deno.env.get('VAPID_PUBLIC_KEY')  ?? '';
        const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY') ?? '';
        const rawEmail          = Deno.env.get('VAPID_EMAIL')       ?? 'admin@tatli.com';
        const VAPID_EMAIL       = rawEmail.startsWith('mailto:') ? rawEmail : `mailto:${rawEmail}`;

        if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
            return jsonResponse(
                { error: 'VAPID_PUBLIC_KEY veya VAPID_PRIVATE_KEY henüz ayarlanmamış.' },
                500
            );
        }

        webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

        const today = new Date().toISOString().split('T')[0];

        // ── 1) Tüm aktif şubeler ──────────────────────────────────────────
        const { data: allBranches, error: branchErr } = await supabase
            .from('branches')
            .select('id, name')
            .eq('is_active', true);

        if (branchErr) throw new Error(`Şube sorgusu başarısız: ${branchErr.message}`);
        if (!allBranches || allBranches.length === 0) {
            return jsonResponse({ message: 'Aktif şube bulunamadı.', missing: [] });
        }

        // ── 2) Bugün kalan girişi yapılmış şubeler ────────────────────────
        const { data: completedToday, error: completedErr } = await supabase
            .from('daily_entries')
            .select('branch_id')
            .eq('entry_date', today)
            .not('remaining_amount', 'is', null);

        if (completedErr) throw new Error(`Giriş sorgusu başarısız: ${completedErr.message}`);

        const completedIds = new Set((completedToday ?? []).map((r: { branch_id: string }) => String(r.branch_id)));
        const missingBranches = (allBranches as Branch[]).filter((b: Branch) => !completedIds.has(String(b.id)));

        if (missingBranches.length === 0) {
            return jsonResponse({ message: 'Tüm şubeler kalan girişini tamamladı.', missing: [] });
        }

        const missingIds = missingBranches.map((b: Branch) => b.id);

        // ── 3) Eksik şubelerin push abonelikleri ──────────────────────────
        const { data: subs, error: subsErr } = await supabase
            .from('push_subscriptions')
            .select('subscription, branch_id')
            .in('branch_id', missingIds);

        if (subsErr) throw new Error(`Abonelik sorgusu başarısız: ${subsErr.message}`);

        if (!subs || subs.length === 0) {
            return jsonResponse({
                message: 'Kayıtlı push aboneliği bulunamadı.',
                missing: missingBranches.map((b: Branch) => b.name)
            });
        }

        // ── 4) Bildirimleri gönder ────────────────────────────────────────
        const payload = JSON.stringify({
            title: '⚠️ Kalan Tatlılar Girilmedi',
            body:  `Bugün (${today}) kalan tatlılar henüz girilmedi!`,
            url:   '/kalan-tatlilar.html',
            tag:   'kalan-uyari'
        });

        const results = await Promise.allSettled(
            (subs as SubRow[]).map((s: SubRow) =>
                webpush.sendNotification(
                    s.subscription as unknown as webpush.PushSubscription,
                    payload
                )
            )
        );

        const sent   = results.filter((r: PromiseSettledResult<unknown>) => r.status === 'fulfilled').length;
        const failed = results.filter((r: PromiseSettledResult<unknown>) => r.status === 'rejected').length;
        const errors = results
            .filter((r: PromiseSettledResult<unknown>): r is PromiseRejectedResult => r.status === 'rejected')
            .map((r: PromiseRejectedResult) => (r.reason as Error)?.message ?? String(r.reason));

        console.log(`check-missing-kalan: ${sent} gönderildi, ${failed} başarısız. Eksik: ${missingBranches.map((b: Branch) => b.name).join(', ')}`);

        return jsonResponse({
            sent,
            failed,
            missing: missingBranches.map(b => b.name),
            ...(errors.length > 0 && { errors })
        });

    } catch (err) {
        console.error('check-missing-kalan hata:', err);
        return jsonResponse({ error: String(err) }, 500);
    }
});
