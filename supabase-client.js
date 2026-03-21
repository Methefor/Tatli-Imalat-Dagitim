// ====================================================================
// SUPABASE CLIENT - TATLI İMALAT VE DAĞITIM TAKİP SİSTEMİ
// ====================================================================

// Supabase bağlantı bilgileri
const SUPABASE_URL = 'https://upokyqmllarooeglyrfg.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwb2t5cW1sbGFyb29lZ2x5cmZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMDQ0NzMsImV4cCI6MjA4Nzc4MDQ3M30.fVvOXGQyqSzG_3BAigdIO4kOhS71P4xheHde1sziamM'

// Supabase client oluştur (global scope'ta bir kez)
let supabaseClient;
if (!window.supabaseInstance) {
    window.supabaseInstance = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}
supabaseClient = window.supabaseInstance

// ====================================================================
// AUTHENTICATION FUNCTIONS
// ====================================================================

/**
 * Şube şifre kontrolü
 */
async function checkBranchPassword(branchName, password) {
    try {
        const { data, error } = await supabaseClient
            .from('branches')
            .select('id, name, password, manager_name')
            .eq('name', branchName)
            .eq('password', password)
            .single()

        if (error) {
            return { success: false, error: 'Şifre hatalı!' }
        }

        if (data) {
            return { 
                success: true, 
                branchId: data.id,
                branchName: data.name,
                managerName: data.manager_name
            }
        }

        return { success: false, error: 'Şifre hatalı!' }
    } catch (err) {
        console.error('Şifre kontrolü hatası:', err)
        return { success: false, error: 'Bağlantı hatası!' }
    }
}

/**
 * Admin şifre kontrolü (sadece şifre ile)
 */
async function checkAdminPasswordOnly(password) {
    try {
        const { data, error } = await supabaseClient
            .from('admins')
            .select('id, username, name')
            .eq('password', password)
            .single()

        if (error) {
            return { success: false, error: 'Şifre hatalı!' }
        }

        if (data) {
            return {
                success: true,
                adminName: data.name
            }
        }

        return { success: false, error: 'Şifre hatalı!' }
    } catch (err) {
        console.error('Admin giriş hatası:', err)
        return { success: false, error: 'Bağlantı hatası!' }
    }
}

// ====================================================================
// DATA FETCH FUNCTIONS
// ====================================================================

/**
 * Tüm şubeleri çek
 */
async function getBranches() {
    try {
        const { data, error } = await supabaseClient
            .from('branches')
            .select('*')
            .order('name', { ascending: true })

        if (error) throw error
        return data || []
    } catch (err) {
        console.error('Şube çekme hatası:', err)
        return []
    }
}

/**
 * Aktif tatlıları çek
 */
async function getActiveDesserts() {
    try {
        const { data, error } = await supabaseClient
            .from('desserts')
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true })

        if (error) throw error
        return data || []
    } catch (err) {
        console.error('Tatlı çekme hatası:', err)
        return []
    }
}

/**
 * Günlük veri kaydet
 */
async function saveDailyEntry(branchId, dessertId, date, received, remaining, waste, notes = '') {
    try {
        const { data: existing, error: checkError } = await supabaseClient
            .from('daily_entries')
            .select('id')
            .eq('branch_id', branchId)
            .eq('dessert_id', dessertId)
            .eq('entry_date', date)
            .single()

        if (checkError && checkError.code !== 'PGRST116') {
            throw checkError
        }

        if (existing) {
            // Güncelleme: null gelen alanları mevcut DB değerinin üzerine YAZMAsın
            const updateData = { notes: notes, entry_time: new Date().toISOString() }
            if (received  !== null && received  !== undefined) updateData.received_amount  = received
            if (remaining !== null && remaining !== undefined) updateData.remaining_amount = remaining
            if (waste     !== null && waste     !== undefined) updateData.waste_amount     = waste

            const { error: updateError } = await supabaseClient
                .from('daily_entries')
                .update(updateData)
                .eq('id', existing.id)

            if (updateError) throw updateError
        } else {
            // Yeni kayıt: tüm alanlar dahil (null olabilir)
            const insertData = {
                branch_id:        branchId,
                dessert_id:       dessertId,
                entry_date:       date,
                received_amount:  received  ?? null,
                remaining_amount: remaining ?? null,
                waste_amount:     waste,
                notes:            notes,
                entry_time:       new Date().toISOString()
            }
            const { error: insertError } = await supabaseClient
                .from('daily_entries')
                .insert([insertData])

            if (insertError) throw insertError
        }

        return { success: true }
    } catch (err) {
        console.error('Veri kaydetme hatası:', err)
        return { success: false, error: 'Kayıt başarısız!' }
    }
}

/**
 * Şube ve tarih bazlı günlük verileri çek
 */
async function getDailyEntriesByBranch(branchId, date) {
    try {
        const { data, error } = await supabaseClient
            .from('daily_entries')
            .select(`
                *,
                desserts (
                    id,
                    name,
                    emoji,
                    display_order
                )
            `)
            .eq('branch_id', branchId)
            .eq('entry_date', date)
            .order('desserts(display_order)', { ascending: true })

        if (error) throw error
        return data || []
    } catch (err) {
        console.error('Veri çekme hatası:', err)
        return []
    }
}

/**
 * Tarih bazlı tüm günlük verileri çek
 */
async function getAllDailyEntriesByDate(date) {
    try {
        const { data, error } = await supabaseClient
            .from('daily_entries')
            .select(`
                *,
                branches (
                    id,
                    name,
                    manager_name
                ),
                desserts (
                    id,
                    name,
                    emoji,
                    display_order
                )
            `)
            .eq('entry_date', date)

        if (error) throw error
        return data || []
    } catch (err) {
        console.error('Veri çekme hatası:', err)
        return []
    }
}

/**
 * Tarih aralığında günlük verileri çek
 */
async function getDailyEntriesDateRange(startDate, endDate) {
    try {
        const { data, error } = await supabaseClient
            .from('daily_entries')
            .select(`
                *,
                branches (
                    id,
                    name,
                    manager_name
                ),
                desserts (
                    id,
                    name,
                    emoji,
                    display_order
                )
            `)
            .gte('entry_date', startDate)
            .lte('entry_date', endDate)
            .order('entry_date', { ascending: false })

        if (error) throw error
        return data || []
    } catch (err) {
        console.error('Veri çekme hatası:', err)
        return []
    }
}

/**
 * Şube bazlı tarih aralığında günlük verileri çek
 */
async function getBranchEntriesDateRange(branchId, startDate, endDate) {
    try {
        const { data, error } = await supabaseClient
            .from('daily_entries')
            .select(`
                *,
                desserts (
                    id,
                    name,
                    emoji,
                    display_order
                )
            `)
            .eq('branch_id', branchId)
            .gte('entry_date', startDate)
            .lte('entry_date', endDate)
            .order('entry_date', { ascending: false })

        if (error) throw error
        return data || []
    } catch (err) {
        console.error('Veri çekme hatası:', err)
        return []
    }
}

/**
 * Şube bazlı güncel stok (son 60 gün)
 * Mantık: son onaylı kalan + o tarihten sonra gelen tatlılar (kalan girilmemiş günler)
 * Dönüş: { dessert_id: currentStock }
 */
async function getBranchLatestStock(branchId) {
    try {
        const past = new Date()
        past.setDate(past.getDate() - 60)
        const pastDate = past.toISOString().split('T')[0]

        const { data, error } = await supabaseClient
            .from('daily_entries')
            .select('dessert_id, received_amount, remaining_amount, entry_date')
            .eq('branch_id', branchId)
            .gte('entry_date', pastDate)
            .order('entry_date', { ascending: false })

        if (error) throw error

        // 1) Her tatlı için en son onaylı kalan (remaining_amount set)
        const lastConfirmed = {}  // dessert_id → { date, remaining }
        ;(data || []).forEach(e => {
            if (!(e.dessert_id in lastConfirmed) && e.remaining_amount !== null) {
                lastConfirmed[e.dessert_id] = { date: e.entry_date, remaining: e.remaining_amount }
            }
        })

        // 2) Son onaylı tarihten SONRA gelen tatlılar (kalan henüz girilmemiş)
        const addReceived = {}  // dessert_id → toplam gelen
        ;(data || []).forEach(e => {
            const lc = lastConfirmed[e.dessert_id]
            if ((!lc || e.entry_date > lc.date) && e.received_amount) {
                addReceived[e.dessert_id] = (addReceived[e.dessert_id] || 0) + e.received_amount
            }
        })

        // 3) Güncel stok = son onaylı kalan + sonraki gelenler
        const result = {}
        const allIds = new Set([...Object.keys(lastConfirmed), ...Object.keys(addReceived)])
        allIds.forEach(id => {
            result[id] = (lastConfirmed[id]?.remaining || 0) + (addReceived[id] || 0)
        })

        return result
    } catch (err) {
        console.error('Stok çekme hatası:', err)
        return {}
    }
}

/**
 * Tüm şubelerin güncel stoku (üretim/tatlıcı paneli için)
 * Mantık: son onaylı kalan + o tarihten sonra gelen tatlılar
 * Dönüş: { branch_id: { dessert_id: currentStock } }
 */
async function getAllLatestStock() {
    try {
        const past = new Date()
        past.setDate(past.getDate() - 60)
        const pastDate = past.toISOString().split('T')[0]

        const { data, error } = await supabaseClient
            .from('daily_entries')
            .select('branch_id, dessert_id, received_amount, remaining_amount, entry_date')
            .gte('entry_date', pastDate)
            .order('entry_date', { ascending: false })

        if (error) throw error

        // 1) Her (şube, tatlı) için en son onaylı kalan
        const lastConfirmed = {}  // "branchId||dessertId" → { date, remaining }
        ;(data || []).forEach(e => {
            const key = `${e.branch_id}||${e.dessert_id}`
            if (!(key in lastConfirmed) && e.remaining_amount !== null) {
                lastConfirmed[key] = { date: e.entry_date, remaining: e.remaining_amount }
            }
        })

        // 2) Son onaylı tarihten SONRA gelen tatlılar
        const addReceived = {}  // "branchId||dessertId" → toplam gelen
        ;(data || []).forEach(e => {
            const key = `${e.branch_id}||${e.dessert_id}`
            const lc = lastConfirmed[key]
            if ((!lc || e.entry_date > lc.date) && e.received_amount) {
                addReceived[key] = (addReceived[key] || 0) + e.received_amount
            }
        })

        // 3) Şube → { tatlı: stok } yapısına dönüştür
        const result = {}
        const allKeys = new Set([...Object.keys(lastConfirmed), ...Object.keys(addReceived)])
        allKeys.forEach(key => {
            const [branchId, dessertId] = key.split('||')
            const stock = (lastConfirmed[key]?.remaining || 0) + (addReceived[key] || 0)
            if (!result[branchId]) result[branchId] = {}
            result[branchId][dessertId] = stock
        })

        return result
    } catch (err) {
        console.error('Tüm stok çekme hatası:', err)
        return {}
    }
}

/**
 * Tüm şubelerin güncel stoku — tatlı bazında toplam (yönetici paneli için)
 * Mantık: son onaylı kalan + o tarihten sonra gelen tatlılar
 */
async function getCurrentStock() {
    try {
        const past = new Date()
        past.setDate(past.getDate() - 60)
        const pastDate = past.toISOString().split('T')[0]

        const { data, error } = await supabaseClient
            .from('daily_entries')
            .select(`
                branch_id, dessert_id, received_amount, remaining_amount, entry_date,
                desserts (id, name, emoji, display_order)
            `)
            .gte('entry_date', pastDate)
            .order('entry_date', { ascending: false })

        if (error) throw error

        // 1) Her (şube, tatlı) için en son onaylı kalan
        const lastConfirmed = {}  // "branchId||dessertId" → { date, remaining }
        const dessertInfo   = {}  // dessert_id → { name, emoji, display_order }

        ;(data || []).forEach(e => {
            const key = `${e.branch_id}||${e.dessert_id}`
            if (!(key in lastConfirmed) && e.remaining_amount !== null) {
                lastConfirmed[key] = { date: e.entry_date, remaining: e.remaining_amount }
            }
            if (!dessertInfo[e.dessert_id] && e.desserts) {
                dessertInfo[e.dessert_id] = e.desserts
            }
        })

        // 2) Son onaylı tarihten SONRA gelen tatlılar
        const addReceived = {}  // "branchId||dessertId" → toplam gelen
        ;(data || []).forEach(e => {
            const key = `${e.branch_id}||${e.dessert_id}`
            const lc = lastConfirmed[key]
            if ((!lc || e.entry_date > lc.date) && e.received_amount) {
                addReceived[key] = (addReceived[key] || 0) + e.received_amount
            }
        })

        // 3) Tatlı bazında topla
        const stockByDessert = {}
        const allKeys = new Set([...Object.keys(lastConfirmed), ...Object.keys(addReceived)])
        allKeys.forEach(key => {
            const dessertId = key.split('||')[1]
            const stock = (lastConfirmed[key]?.remaining || 0) + (addReceived[key] || 0)
            if (!stockByDessert[dessertId]) {
                const info = dessertInfo[dessertId]
                stockByDessert[dessertId] = {
                    dessertId,
                    dessertName:   info?.name         || '—',
                    emoji:         info?.emoji        || '🍬',
                    displayOrder:  info?.display_order || 999,
                    totalRemaining: 0
                }
            }
            stockByDessert[dessertId].totalRemaining += stock
        })

        return Object.values(stockByDessert).sort((a, b) => a.displayOrder - b.displayOrder)
    } catch (err) {
        console.error('Stok çekme hatası:', err)
        return []
    }
}

// ====================================================================
// SUPER ADMIN — READ FUNCTIONS
// ====================================================================

/** Tüm tatlıları çek (aktif + pasif) */
async function getAllDesserts() {
    try {
        const { data, error } = await supabaseClient
            .from('desserts')
            .select('*')
            .order('display_order', { ascending: true })
        if (error) throw error
        return data || []
    } catch (err) {
        console.error('Tatlı çekme hatası:', err)
        return []
    }
}

/** Tüm adminleri çek */
async function getAllAdmins() {
    try {
        const { data, error } = await supabaseClient
            .from('admins')
            .select('id, username, name, password')
        if (error) throw error
        return data || []
    } catch (err) {
        console.error('Admin çekme hatası:', err)
        return []
    }
}

// ====================================================================
// SUPER ADMIN — UPDATE / INSERT FUNCTIONS
// ====================================================================

/** Şube şifresi güncelle */
async function updateBranchPassword(branchId, newPassword) {
    try {
        const { error } = await supabaseClient
            .from('branches')
            .update({ password: newPassword })
            .eq('id', branchId)
        if (error) throw error
        return { success: true }
    } catch (err) {
        console.error('Şifre güncelleme hatası:', err)
        return { success: false, error: err.message }
    }
}

/** Müdür adı güncelle */
async function updateBranchManager(branchId, managerName) {
    try {
        const { error } = await supabaseClient
            .from('branches')
            .update({ manager_name: managerName })
            .eq('id', branchId)
        if (error) throw error
        return { success: true }
    } catch (err) {
        console.error('Müdür güncelleme hatası:', err)
        return { success: false, error: err.message }
    }
}

/** Tatlı aktif/pasif toggle */
async function updateDessertActive(dessertId, isActive) {
    try {
        const { error } = await supabaseClient
            .from('desserts')
            .update({ is_active: isActive })
            .eq('id', dessertId)
        if (error) throw error
        return { success: true }
    } catch (err) {
        console.error('Tatlı aktif güncelleme hatası:', err)
        return { success: false, error: err.message }
    }
}

/** Tatlı bilgilerini güncelle (isim, emoji, sıra) */
async function updateDessert(dessertId, updates) {
    try {
        const { error } = await supabaseClient
            .from('desserts')
            .update(updates)
            .eq('id', dessertId)
        if (error) throw error
        return { success: true }
    } catch (err) {
        console.error('Tatlı güncelleme hatası:', err)
        return { success: false, error: err.message }
    }
}

/** Yeni tatlı ekle */
async function addDessert(name, emoji, displayOrder) {
    try {
        const { error } = await supabaseClient
            .from('desserts')
            .insert([{ name, emoji, display_order: displayOrder, is_active: true }])
        if (error) throw error
        return { success: true }
    } catch (err) {
        console.error('Tatlı ekleme hatası:', err)
        return { success: false, error: err.message }
    }
}

/** Admin şifresi güncelle */
async function updateAdminPassword(adminId, newPassword) {
    try {
        const { error } = await supabaseClient
            .from('admins')
            .update({ password: newPassword })
            .eq('id', adminId)
        if (error) throw error
        return { success: true }
    } catch (err) {
        console.error('Admin şifre güncelleme hatası:', err)
        return { success: false, error: err.message }
    }
}

// ====================================================================
// UI HELPER FUNCTIONS
// ====================================================================

/**
 * Toast bildirimi göster
 */
function showToast(message, type = 'success') {
    const toast = document.createElement('div')
    toast.className = `toast toast-${type}`
    toast.textContent = message
    
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 12px;
        color: white;
        font-weight: 600;
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 8px 24px rgba(0,0,0,0.3);
    `

    if (type === 'success') {
        toast.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)'
    } else if (type === 'error') {
        toast.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)'
    } else {
        toast.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)'
    }

    document.body.appendChild(toast)

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out'
        setTimeout(() => toast.remove(), 300)
    }, 3000)
}

/**
 * Loading spinner göster/gizle
 */
function toggleLoading(show) {
    let spinner = document.getElementById('loading-spinner')
    
    if (show) {
        if (!spinner) {
            spinner = document.createElement('div')
            spinner.id = 'loading-spinner'
            spinner.innerHTML = `
                <div style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(15, 23, 42, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9998;
                ">
                    <div style="
                        width: 48px;
                        height: 48px;
                        border: 4px solid rgba(245, 158, 11, 0.3);
                        border-top-color: #f59e0b;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                    "></div>
                </div>
            `
            document.body.appendChild(spinner)
        }
    } else {
        if (spinner) {
            spinner.remove()
        }
    }
}

/**
 * Tarih formatla (Türkçe)
 */
function formatDateTurkish(dateString) {
    const date = new Date(dateString)
    const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi']
    const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
                    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
    
    const day = date.getDate()
    const month = months[date.getMonth()]
    const year = date.getFullYear()
    const dayName = days[date.getDay()]
    
    return `${day} ${month} ${year}, ${dayName}`
}

/**
 * Bugünün tarihini al
 */
function getTodayDate() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

// ====================================================================
// CSS ANIMATIONS
// ====================================================================

const styleElement = document.createElement('style')
styleElement.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes slideUp {
        from {
            transform: translateY(20px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
`
document.head.appendChild(styleElement)

// ====================================================================
// SETTINGS FUNCTIONS — Paylaşılan ayarlar (tüm cihazlarda geçerli)
// ====================================================================

/**
 * Tek bir ayarı Supabase'den okur.
 * @param {string} key
 * @returns {*} parsed JSON value or null
 */
async function getSetting(key) {
    try {
        const { data, error } = await supabaseClient
            .from('settings')
            .select('value')
            .eq('key', key)
            .maybeSingle()
        if (error || !data) return null
        return data.value
    } catch (e) {
        console.error('getSetting error:', e)
        return null
    }
}

/**
 * Tüm ayarları tek sorguda çeker.
 * @returns {Object} { key: value, ... }
 */
async function getAllSettings() {
    try {
        const { data, error } = await supabaseClient
            .from('settings')
            .select('key, value')
        if (error || !data) return {}
        return Object.fromEntries(data.map(r => [r.key, r.value]))
    } catch (e) {
        console.error('getAllSettings error:', e)
        return {}
    }
}

/**
 * Bir ayarı Supabase'e kaydeder (upsert).
 * @param {string} key
 * @param {*} value  (JSON serileştirilebilir)
 */
async function setSetting(key, value) {
    const { error } = await supabaseClient
        .from('settings')
        .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
    if (error) throw error
}

// ====================================================================
// WEB PUSH — Bildirim Abonelik Fonksiyonları
// ====================================================================

/**
 * VAPID public key (base64url). Üretim öncesi aşağıdaki komutla oluştur:
 *   npx web-push generate-vapid-keys
 * Oluşan PUBLIC KEY'i aşağıya yapıştır, PRIVATE KEY'i Edge Function secrets'a ekle.
 */
const VAPID_PUBLIC_KEY = 'BURAYA_VAPID_PUBLIC_KEY_EKLE';

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64  = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const raw     = atob(base64);
    return Uint8Array.from([...raw].map(c => c.charCodeAt(0)));
}

/**
 * Push subscription kaydeder (yeni şube müdürü cihazı)
 */
async function registerPushSubscription(branchId) {
    try {
        if (!('Notification' in window) || !('serviceWorker' in navigator)) return false;

        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return false;

        const registration = await navigator.serviceWorker.ready;
        let sub = await registration.pushManager.getSubscription();

        if (!sub) {
            sub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
            });
        }

        const { error } = await supabaseClient
            .from('push_subscriptions')
            .upsert({
                branch_id:    branchId,
                subscription: sub.toJSON(),
                device_info:  navigator.userAgent.slice(0, 200)
            }, { onConflict: 'branch_id' });

        if (error) console.warn('Push kayıt hatası:', error.message);
        return true;
    } catch (err) {
        console.warn('Push abonelik hatası:', err);
        return false;
    }
}

// ====================================================================
// ANALİTİK FONKSİYONLAR — Tahminleme, Zayiat Trendi, Yıllık Satış
// ====================================================================

/**
 * Son N ayın zayiat trendi (tatlı bazında, ay bazında)
 * Dönüş: [ { month: 'Oca 25', byDessert: { id: { name, total } } }, ... ]
 */
async function getWasteTrendData(months = 6) {
    try {
        const now = new Date()
        const queries = []
        const labels = []

        for (let i = months - 1; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
            const startDate = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-01`
            const endD = new Date(d.getFullYear(), d.getMonth() + 1, 0)
            const endDate = `${endD.getFullYear()}-${String(endD.getMonth()+1).padStart(2,'0')}-${String(endD.getDate()).padStart(2,'0')}`
            labels.push({ startDate, endDate, label: d.toLocaleDateString('tr-TR', { month: 'short', year: '2-digit' }) })
        }

        const results = await Promise.all(labels.map(({ startDate, endDate }) =>
            supabaseClient
                .from('daily_entries')
                .select('dessert_id, waste_amount, desserts(id, name, emoji)')
                .gte('entry_date', startDate)
                .lte('entry_date', endDate)
        ))

        return labels.map(({ label }, idx) => {
            const { data } = results[idx]
            const byDessert = {}
            ;(data || []).forEach(e => {
                if (!e.waste_amount || e.waste_amount <= 0) return
                const id = String(e.dessert_id)
                const name = `${e.desserts?.emoji || ''} ${e.desserts?.name || id}`
                if (!byDessert[id]) byDessert[id] = { name, total: 0 }
                byDessert[id].total += e.waste_amount
            })
            return { month: label, byDessert }
        })
    } catch (err) {
        console.error('Zayiat trend hatası:', err)
        return []
    }
}

/**
 * Yıllık satış verisi (ay bazında)
 * Dönüş: [ { monthIdx, label, received, remaining, sold }, ... ] — 12 eleman
 */
async function getYearlySalesData(year) {
    try {
        const startDate = `${year}-01-01`
        const endDate   = `${year}-12-31`

        const { data, error } = await supabaseClient
            .from('daily_entries')
            .select('entry_date, received_amount, remaining_amount, branch_id, dessert_id')
            .gte('entry_date', startDate)
            .lte('entry_date', endDate)
            .order('entry_date', { ascending: true })

        if (error) throw error

        // Ay bazında received topla
        const monthReceived = Array(12).fill(0)
        ;(data || []).forEach(e => {
            const m = new Date(e.entry_date).getMonth()
            monthReceived[m] += e.received_amount || 0
        })

        return Array.from({ length: 12 }, (_, i) => ({
            monthIdx: i,
            label: new Date(year, i, 1).toLocaleDateString('tr-TR', { month: 'short' }),
            received: monthReceived[i]
        }))
    } catch (err) {
        console.error('Yıllık veri hatası:', err)
        return Array.from({ length: 12 }, (_, i) => ({
            monthIdx: i,
            label: new Date(2025, i, 1).toLocaleDateString('tr-TR', { month: 'short' }),
            received: 0
        }))
    }
}

/**
 * Üretim hedeflerini çek
 * Dönüş: { dessertId: dailyTarget }
 */
async function getProductionTargets() {
    try {
        const { data, error } = await supabaseClient
            .from('production_targets')
            .select('dessert_id, daily_target')
        if (error) throw error
        const result = {}
        ;(data || []).forEach(r => { result[String(r.dessert_id)] = r.daily_target })
        return result
    } catch (err) {
        console.error('Üretim hedefi çekme hatası:', err)
        return {}
    }
}

/**
 * Üretim hedefi kaydet/güncelle
 */
async function setProductionTarget(dessertId, target) {
    const { error } = await supabaseClient
        .from('production_targets')
        .upsert({ dessert_id: dessertId, daily_target: target, updated_at: new Date().toISOString() },
                 { onConflict: 'dessert_id' })
    if (error) throw error
}

// ====================================================================
// TEMA FONKSİYONLARI — Dark / Light Mode
// ====================================================================

/**
 * Sayfa yüklenince kaydedilen temayı uygula
 */
function initTheme() {
    const theme = localStorage.getItem('appTheme') || 'dark'
    document.documentElement.setAttribute('data-theme', theme)
    // Toggle butonunu varsa güncelle
    const updateBtn = () => {
        const btn = document.getElementById('themeToggleBtn')
        if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙'
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateBtn)
    } else {
        updateBtn()
    }
}

// Sayfa yüklenince otomatik uygula (tema + buton ikonu)
;(function() {
    const theme = localStorage.getItem('appTheme') || 'dark'
    document.documentElement.setAttribute('data-theme', theme)
    const updateBtn = () => {
        const btn = document.getElementById('themeToggleBtn')
        if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙'
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateBtn)
    } else {
        updateBtn()
    }
})()

/**
 * Dark ↔ Light arasında geçiş yap
 */
function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark'
    const next = current === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('appTheme', next)
    const btn = document.getElementById('themeToggleBtn')
    if (btn) btn.textContent = next === 'dark' ? '☀️' : '🌙'
}

console.log('✅ Supabase Client yüklendi')
