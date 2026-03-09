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

/**
 * Admin şifre kontrolü
 */
async function checkAdminPassword(username, password) {
    try {
        const { data, error } = await supabaseClient
            .from('admins')
            .select('id, username, name')
            .eq('username', username)
            .eq('password', password)
            .single()

        if (error) {
            return { success: false, error: 'Kullanıcı adı veya şifre hatalı!' }
        }

        if (data) {
            return { 
                success: true,
                adminName: data.name
            }
        }

        return { success: false, error: 'Kullanıcı adı veya şifre hatalı!' }
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

        // remaining === null → gelen kaydı, mevcut kalan_amount korunur
        const baseData = {
            branch_id: branchId,
            dessert_id: dessertId,
            entry_date: date,
            received_amount: received,
            waste_amount: waste,
            notes: notes,
            entry_time: new Date().toISOString()
        }

        if (existing) {
            // Güncelleme: remaining null ise remaining_amount'a dokunma
            const updateData = (remaining !== null && remaining !== undefined)
                ? { ...baseData, remaining_amount: remaining }
                : baseData
            const { error: updateError } = await supabaseClient
                .from('daily_entries')
                .update(updateData)
                .eq('id', existing.id)

            if (updateError) throw updateError
        } else {
            // Yeni kayıt: remaining_amount null başlar (kalan girilene kadar)
            const { error: insertError } = await supabaseClient
                .from('daily_entries')
                .insert([{ ...baseData, remaining_amount: remaining ?? null }])

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
 * Şube bazlı son 7 günlük verileri çek
 */
async function getLastSevenDays(branchId) {
    try {
        const today = new Date()
        const sevenDaysAgo = new Date(today)
        sevenDaysAgo.setDate(today.getDate() - 7)

        const { data, error } = await supabaseClient
            .from('daily_entries')
            .select(`
                *,
                desserts (
                    id,
                    name,
                    emoji
                )
            `)
            .eq('branch_id', branchId)
            .gte('entry_date', sevenDaysAgo.toISOString().split('T')[0])
            .order('entry_date', { ascending: false })

        if (error) throw error
        return data || []
    } catch (err) {
        console.error('Geçmiş veri çekme hatası:', err)
        return []
    }
}

/**
 * Şube bazlı en son kalan stok (ay filtresinden bağımsız, son 60 gün)
 * Dönüş: { dessert_id: remaining_amount }
 */
async function getBranchLatestStock(branchId) {
    try {
        const past = new Date()
        past.setDate(past.getDate() - 60)
        const pastDate = past.toISOString().split('T')[0]

        const { data, error } = await supabaseClient
            .from('daily_entries')
            .select('dessert_id, remaining_amount, entry_date')
            .eq('branch_id', branchId)
            .gte('entry_date', pastDate)
            .not('remaining_amount', 'is', null)
            .order('entry_date', { ascending: false })

        if (error) throw error

        // Her tatlı için en son tarihteki remaining_amount
        const latestByDessert = {}
        ;(data || []).forEach(e => {
            if (!(e.dessert_id in latestByDessert)) {
                latestByDessert[e.dessert_id] = e.remaining_amount || 0
            }
        })

        return latestByDessert
    } catch (err) {
        console.error('Stok çekme hatası:', err)
        return {}
    }
}

/**
 * Tüm şubelerin en son kalan stoku (üretim paneli için)
 * Dönüş: { branch_id: { dessert_id: remaining_amount } }
 */
async function getAllLatestStock() {
    try {
        const past = new Date()
        past.setDate(past.getDate() - 60)
        const pastDate = past.toISOString().split('T')[0]

        const { data, error } = await supabaseClient
            .from('daily_entries')
            .select('branch_id, dessert_id, remaining_amount, entry_date')
            .gte('entry_date', pastDate)
            .not('remaining_amount', 'is', null)
            .order('entry_date', { ascending: false })

        if (error) throw error

        // Her (şube, tatlı) için en son remaining_amount
        const seen = new Set()
        const result = {}
        ;(data || []).forEach(e => {
            const key = `${e.branch_id}-${e.dessert_id}`
            if (!seen.has(key)) {
                seen.add(key)
                if (!result[e.branch_id]) result[e.branch_id] = {}
                result[e.branch_id][e.dessert_id] = e.remaining_amount || 0
            }
        })

        return result
    } catch (err) {
        console.error('Tüm stok çekme hatası:', err)
        return {}
    }
}

/**
 * Mevcut stok (her şube+tatlı için en son null-olmayan kalan)
 * getAllLatestStock() ile aynı veriyi kullanır, tatlı bazında toplar.
 */
async function getCurrentStock() {
    try {
        const past = new Date()
        past.setDate(past.getDate() - 60)
        const pastDate = past.toISOString().split('T')[0]

        const { data, error } = await supabaseClient
            .from('daily_entries')
            .select(`
                branch_id, dessert_id, remaining_amount, entry_date,
                desserts (id, name, emoji, display_order)
            `)
            .gte('entry_date', pastDate)
            .not('remaining_amount', 'is', null)
            .order('entry_date', { ascending: false })

        if (error) throw error

        // Her (şube, tatlı) için en son remaining_amount, sonra tatlı bazında topla
        const seen = new Set()
        const stockByDessert = {}

        ;(data || []).forEach(entry => {
            const key = `${entry.branch_id}-${entry.dessert_id}`
            if (seen.has(key)) return
            seen.add(key)

            const dId = entry.dessert_id
            if (!stockByDessert[dId]) {
                stockByDessert[dId] = {
                    dessertId:     dId,
                    dessertName:   entry.desserts.name,
                    emoji:         entry.desserts.emoji,
                    displayOrder:  entry.desserts.display_order,
                    totalRemaining: 0
                }
            }
            stockByDessert[dId].totalRemaining += entry.remaining_amount || 0
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
    return new Date().toISOString().split('T')[0]
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

console.log('✅ Supabase Client yüklendi')
