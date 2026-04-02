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
 * Aktif tatlıları çek (sessionStorage'da 5 dk önbellek)
 */
async function getActiveDesserts() {
    const CACHE_KEY = 'cache_active_desserts'
    const CACHE_TTL = 5 * 60 * 1000
    try {
        const cached = sessionStorage.getItem(CACHE_KEY)
        if (cached) {
            const { data, ts } = JSON.parse(cached)
            if (Date.now() - ts < CACHE_TTL) return data
        }
    } catch (_) {}

    try {
        const { data, error } = await supabaseClient
            .from('desserts')
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true })

        if (error) throw error
        const result = data || []
        try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data: result, ts: Date.now() })) } catch (_) {}
        return result
    } catch (err) {
        console.error('Tatlı çekme hatası:', err)
        return []
    }
}

/**
 * Aktif tatlı önbelleğini temizle (superadmin değişiklik yaptıktan sonra çağır)
 */
function clearDessertsCache() {
    try { sessionStorage.removeItem('cache_active_desserts') } catch (_) {}
}

/**
 * Günlük veri kaydet
 */
async function saveDailyEntry(branchId, dessertId, date, received, remaining, waste, notes = '') {
    try {
        const { data: existing, error: checkError } = await supabaseClient
            .from('daily_entries')
            .select('id, received_amount, remaining_amount, waste_amount, notes')
            .eq('branch_id', branchId)
            .eq('dessert_id', dessertId)
            .eq('entry_date', date)
            .single()

        if (checkError && checkError.code !== 'PGRST116') {
            throw checkError
        }

        if (existing) {
            // Hangi değerler değişti?
            const changes = []
            if (received  !== null && received  !== undefined && received  !== existing.received_amount)
                changes.push(`gelen:${existing.received_amount ?? '—'}→${received}`)
            if (remaining !== null && remaining !== undefined && remaining !== existing.remaining_amount)
                changes.push(`kalan:${existing.remaining_amount ?? '—'}→${remaining}`)
            if (waste     !== null && waste     !== undefined && waste     !== existing.waste_amount)
                changes.push(`zayiat:${existing.waste_amount ?? '—'}→${waste}`)

            const now = new Date()
            // Mevcut notes'tan başla; [ZAY: ...] tag'ini yenisiyle değiştir
            let baseNotes = existing.notes || ''
            if (notes && notes.includes('[ZAY:')) {
                baseNotes = baseNotes.replace(/\[ZAY:[^\]]*\]/g, '').trim()
                baseNotes = (baseNotes ? baseNotes + ' ' : '') + notes.trim()
            }

            // Sadece değer değiştiyse [DÜZ] etiketi ekle
            if (changes.length > 0) {
                const corrTag = `[DÜZ ${now.toLocaleDateString('tr-TR')} ${now.toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'})} ${changes.join(',')}]`
                baseNotes = (baseNotes ? baseNotes + ' ' : '') + corrTag
            }

            const updateData = { notes: baseNotes.trim(), entry_time: now.toISOString() }
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
        const pastDate = _localDate(past)

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
        const pastDate = _localDate(past)

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
        const pastDate = _localDate(past)

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
        const { data, error } = await supabaseClient
            .from('branches')
            .update({ password: newPassword })
            .eq('id', branchId)
            .select('id')
        if (error) throw error
        if (!data || data.length === 0) throw new Error('Güncelleme izni yok — Supabase RLS politikasını kontrol edin')
        return { success: true }
    } catch (err) {
        console.error('Şifre güncelleme hatası:', err)
        return { success: false, error: err.message }
    }
}

/** Müdür adı güncelle */
async function updateBranchManager(branchId, managerName) {
    try {
        const { data, error } = await supabaseClient
            .from('branches')
            .update({ manager_name: managerName })
            .eq('id', branchId)
            .select('id')
        if (error) throw error
        if (!data || data.length === 0) throw new Error('Güncelleme izni yok — Supabase RLS politikasını kontrol edin')
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
        const { data, error } = await supabaseClient
            .from('admins')
            .update({ password: newPassword })
            .eq('id', adminId)
            .select('id')
        if (error) throw error
        if (!data || data.length === 0) throw new Error('Güncelleme izni yok — Supabase RLS politikasını kontrol edin')
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
    // CSS'i bir kez enjekte et
    if (!document.getElementById('_ts')) {
        const s = document.createElement('style')
        s.id = '_ts'
        s.textContent = [
            '@keyframes _tsu{from{opacity:0;transform:translateX(-50%) translateY(16px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}',
            '@keyframes _tpb{from{transform:scaleX(1)}to{transform:scaleX(0)}}',
            '._toast{position:fixed;bottom:90px;left:50%;transform:translateX(-50%);max-width:calc(100vw - 32px);min-width:260px;padding:14px 18px 0;border-radius:16px;color:#fff;font-size:14px;font-weight:600;z-index:10001;box-shadow:0 8px 32px rgba(0,0,0,0.4);overflow:hidden;cursor:pointer;animation:_tsu .3s cubic-bezier(.34,1.56,.64,1) both}',
            '._toast-body{display:flex;align-items:center;gap:10px;padding-bottom:12px}',
            '._toast-prog{height:3px;margin:0 -18px;background:rgba(255,255,255,0.35);transform-origin:left;animation:_tpb 3s linear both}'
        ].join('')
        document.head.appendChild(s)
    }
    const icons = { success:'✅', error:'❌', info:'ℹ️', warn:'⚠️' }
    const bgs   = {
        success:'linear-gradient(135deg,#22c55e,#16a34a)',
        error:  'linear-gradient(135deg,#ef4444,#dc2626)',
        info:   'linear-gradient(135deg,#3b82f6,#2563eb)',
        warn:   'linear-gradient(135deg,#f59e0b,#d97706)'
    }
    const toast = document.createElement('div')
    toast.className = '_toast'
    toast.style.background = bgs[type] || bgs.info
    toast.innerHTML = `<div class="_toast-body"><span style="font-size:18px;line-height:1;flex-shrink:0">${icons[type]||'💬'}</span><span style="flex:1;line-height:1.4">${message}</span></div><div class="_toast-prog"></div>`
    document.body.appendChild(toast)

    // Swipe to dismiss (yukarı kaydır)
    let sy = 0
    toast.addEventListener('touchstart', e => { sy = e.touches[0].clientY }, { passive: true })
    toast.addEventListener('touchmove', e => {
        const dy = e.touches[0].clientY - sy
        if (dy < -5) { toast.style.transform = `translateX(-50%) translateY(${dy}px)`; toast.style.opacity = String(Math.max(0, 1 + dy / 60)) }
    }, { passive: true })
    toast.addEventListener('touchend', e => {
        if ((e.changedTouches[0].clientY - sy) < -30) dismiss()
        else { toast.style.transform = ''; toast.style.opacity = '' }
    })
    toast.addEventListener('click', dismiss)

    const t = setTimeout(dismiss, 3000)
    function dismiss() {
        clearTimeout(t)
        toast.style.transition = 'opacity .25s,transform .25s'
        toast.style.opacity = '0'
        toast.style.transform = 'translateX(-50%) translateY(-12px)'
        setTimeout(() => toast.remove(), 280)
    }
}

/**
 * İllüstrasyonlu boş durum HTML'i
 */
function emptyStateHTML(emoji, title, subtitle) {
    return '<div style="padding:44px 20px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:10px;">' +
        '<div style="font-size:54px;line-height:1;filter:drop-shadow(0 4px 10px rgba(0,0,0,0.2))">' + emoji + '</div>' +
        '<div style="font-size:15px;font-weight:700;color:var(--text);margin-top:2px">' + title + '</div>' +
        (subtitle ? '<div style="font-size:13px;color:var(--muted);max-width:220px;line-height:1.5;margin-top:2px">' + subtitle + '</div>' : '') +
        '</div>'
}

/**
 * Pull-to-refresh jesti (mobil)
 */
function initPullToRefresh(onRefresh) {
    if (document.getElementById('_ptr')) return // zaten init edilmişse atla
    let startY = 0, pulling = false, refreshing = false
    const threshold = 65

    const ind = document.createElement('div')
    ind.id = '_ptr'
    ind.innerHTML = '↓'
    ind.style.cssText = 'position:fixed;top:0;left:50%;transform:translateX(-50%) translateY(-60px);width:40px;height:40px;border-radius:50%;background:var(--accent);color:#fff;display:flex;align-items:center;justify-content:center;font-size:18px;z-index:9998;box-shadow:0 4px 20px rgba(0,0,0,0.3);transition:transform 0.25s cubic-bezier(0.34,1.56,0.64,1),opacity 0.25s;opacity:0;pointer-events:none'
    document.body.appendChild(ind)

    if (!document.getElementById('_ptr_css')) {
        const s = document.createElement('style')
        s.id = '_ptr_css'
        s.textContent = '@keyframes _ptrspin{to{transform:rotate(360deg)}}'
        document.head.appendChild(s)
    }

    document.addEventListener('touchstart', function(e) {
        if (window.scrollY <= 0 && !refreshing) {
            startY = e.touches[0].clientY
            pulling = true
        }
    }, { passive: true })

    document.addEventListener('touchmove', function(e) {
        if (!pulling) return
        const dy = e.touches[0].clientY - startY
        if (dy > 0) {
            ind.style.transform = 'translateX(-50%) translateY(' + (Math.min(dy * 0.5, 72) - 60) + 'px) rotate(' + (dy * 1.8) + 'deg)'
            ind.style.opacity = String(Math.min(dy / threshold, 1))
            ind.innerHTML = dy > threshold ? '↑' : '↓'
        }
    }, { passive: true })

    document.addEventListener('touchend', function(e) {
        if (!pulling) return
        pulling = false
        const dy = e.changedTouches[0].clientY - startY
        if (dy > threshold && !refreshing) {
            refreshing = true
            ind.innerHTML = '<div style="width:18px;height:18px;border:2.5px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:_ptrspin 0.6s linear infinite"></div>'
            ind.style.transform = 'translateX(-50%) translateY(18px)'
            ind.style.opacity = '1'
            Promise.resolve(onRefresh()).finally(function() {
                setTimeout(function() {
                    ind.style.transform = 'translateX(-50%) translateY(-60px)'
                    ind.style.opacity = '0'
                    setTimeout(function() { ind.innerHTML = '↓'; refreshing = false }, 300)
                }, 600)
            })
        } else {
            ind.style.transform = 'translateX(-50%) translateY(-60px)'
            ind.style.opacity = '0'
            setTimeout(function() { ind.innerHTML = '↓' }, 300)
        }
    }, { passive: true })
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

// Sayfa yüklenince otomatik uygula (tema + buton ikonu + geçiş animasyonu)
;(function() {
    const theme = localStorage.getItem('appTheme') || 'dark'
    document.documentElement.setAttribute('data-theme', theme)
    // Sayfa geçiş animasyonu (opacity 0→1 + hafif aşağıdan yukarı)
    const ps = document.createElement('style')
    ps.textContent = '@keyframes _pfi{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}body{animation:_pfi .25s ease both}@keyframes _sli{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}'
    document.head.appendChild(ps)
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

// ====================================================================
// HAFTALIK ÜRETİM TAKVİMİ
// ====================================================================

const _DEFAULT_SCHEDULE = {
    'Pazartesi': { dessert: 'Magnolya',      qty: 600 },
    'Salı':      { dessert: 'Tiramisu',      qty: 400 },
    'Çarşamba':  { dessert: 'Truff',         qty: 200 },
    'Perşembe':  { dessert: 'Mozaik',        qty: 200 },
    'Cuma':      { dessert: 'Cheesecake',    qty: 200 },
    'Cumartesi': { dessert: 'San Sebastian', qty: 200 },
    'Pazar':     { dessert: 'Trileçe',       qty: 200 }
}

async function getWeeklySchedule() {
    try {
        const val = await getSetting('weeklySchedule')
        if (!val) return { ..._DEFAULT_SCHEDULE }
        return JSON.parse(val)
    } catch (e) {
        return { ..._DEFAULT_SCHEDULE }
    }
}

async function saveWeeklySchedule(schedule) {
    return setSetting('weeklySchedule', JSON.stringify(schedule))
}

// ====================================================================
// PERSONEL YÖNETİMİ
// ====================================================================

/**
 * Her şubenin son veri giriş tarihini döner
 * Dönüş: [ { id, name, manager_name, password, lastDate } ]
 */
function _localDate(d = new Date()) {
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

async function getBranchLastActivity() {
    try {
        const branches = await getBranches()
        if (!branches || branches.length === 0) return []

        const today = _localDate()
        const past  = new Date()
        past.setDate(past.getDate() - 60)
        const pastDate = _localDate(past)

        // İki sorgu: bugün aktif mi? + son 30 günde son tarih
        const [todayRes, recentRes] = await Promise.all([
            supabaseClient
                .from('daily_entries')
                .select('branch_id')
                .eq('entry_date', today)
                .limit(500),
            supabaseClient
                .from('daily_entries')
                .select('branch_id, entry_date')
                .gte('entry_date', pastDate)
                .lte('entry_date', today)
                .order('entry_date', { ascending: false })
                .limit(3000)
        ])

        if (todayRes.error) throw todayRes.error
        if (recentRes.error) throw recentRes.error

        // Bugün aktif olan şubeler
        const todayActive = new Set((todayRes.data || []).map(e => String(e.branch_id)))

        // Son tarihi şube bazında hesapla (son 30 gün)
        const lastByBranch = {}
        ;(recentRes.data || []).forEach(e => {
            const bid = String(e.branch_id)
            if (!lastByBranch[bid] || e.entry_date > lastByBranch[bid]) {
                lastByBranch[bid] = e.entry_date
            }
        })

        // Bugün aktif olanların son tarihini bugün yap (sorgu kesintisi olursa diye güvence)
        todayActive.forEach(bid => { lastByBranch[bid] = today })

        return branches.map(b => ({
            ...b,
            lastDate: lastByBranch[String(b.id)] || null
        }))
    } catch (err) {
        console.error('Aktivite sorgu hatası:', err)
        return []
    }
}

/**
 * Son N günde yapılan düzeltme girişlerini döner ([DÜZ içeren notes)
 * Dönüş: [ { entry_date, notes, branches:{name,manager_name}, desserts:{name,emoji} } ]
 */
async function getCorrectionEntries(days = 30) {
    try {
        const past = new Date()
        past.setDate(past.getDate() - days)
        const pastDate = _localDate(past)

        const { data, error } = await supabaseClient
            .from('daily_entries')
            .select(`
                id, entry_date, notes, entry_time,
                received_amount, remaining_amount, waste_amount,
                branches ( name, manager_name ),
                desserts ( name, emoji )
            `)
            .gte('entry_date', pastDate)
            .like('notes', '%[DÜZ%')
            .order('entry_time', { ascending: false })

        if (error) throw error
        return data || []
    } catch (err) {
        console.error('Düzeltme sorgu hatası:', err)
        return []
    }
}

/** Zayiat girişlerini çek (açıklama varsa göster, yoksa da listele) */
async function getWasteWithReasons(days = 30) {
    try {
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - days)
        const startStr = _localDate(startDate)

        const { data, error } = await supabaseClient
            .from('daily_entries')
            .select('entry_date, waste_amount, notes, entry_time, branches(name, manager_name), desserts(name, emoji)')
            .gt('waste_amount', 0)
            .gte('entry_date', startStr)
            .order('entry_date', { ascending: false })
            .order('entry_time', { ascending: false })
            .limit(200)

        if (error) throw error
        return data || []
    } catch (err) {
        console.error('Zayiat sorgu hatası:', err)
        return []
    }
}

console.log('✅ Supabase Client yüklendi')

// ====================================================================
// TEMA YÖNETİMİ — tüm sayfalar bu fonksiyonları kullanır
// ====================================================================

/**
 * Sayfa yüklenirken temayı uygular (FOUC önlemek için <head>'de çağrılır).
 * Önce localStorage'a bakar, yoksa sistem temasını kullanır.
 */
function initTheme() {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
    _applyThemeIcon(theme);
}

/**
 * Temayı karanlık ↔ aydınlık arasında değiştirir ve kaydeder.
 */
function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    _applyThemeIcon(next);
}

function _applyThemeIcon(theme) {
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
        btn.textContent = theme === 'dark' ? '☀️' : '🌙';
        btn.title = theme === 'dark' ? 'Aydınlık mod' : 'Karanlık mod';
    });
}

// Sistem teması değişirse (kullanıcı OS ayarını değiştirirse) otomatik güncelle
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
        const theme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        _applyThemeIcon(theme);
    }
});

// Sayfa yüklenince ikon güncelle (butonlar DOM'da hazır olduğunda)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const t = document.documentElement.getAttribute('data-theme') || 'dark';
        _applyThemeIcon(t);
    });
} else {
    const t = document.documentElement.getAttribute('data-theme') || 'dark';
    _applyThemeIcon(t);
}
