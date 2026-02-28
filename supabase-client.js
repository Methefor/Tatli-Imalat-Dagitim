// Supabase Bağlantı Bilgileri
const supabaseUrl = 'https://upokyqmllarooeglyrfg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwb2t5cW1sbGFyb29lZ2x5cmZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMDQ0NzMsImV4cCI6MjA4Nzc4MDQ3M30.fVvOXGQyqSzG_3BAigdIO4kOhS71P4xheHde1sziamM'

// Supabase Client Oluştur (tek seferlik — çift yüklemeye karşı korumalı)
if (typeof window.supabaseClient === 'undefined') {
    window.supabaseClient = window.supabase.createClient(supabaseUrl, supabaseAnonKey)
}
const supabase = window.supabaseClient

/**
 * Şube şifre kontrolü
 * @param {string} branchName - Şube adı
 * @param {string} password - Şifre
 * @returns {Promise<{success: boolean, branchId?: string, error?: string}>}
 */
async function checkBranchPassword(branchName, password) {
    try {
        const { data, error } = await supabase
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
 * Admin şifre kontrolü
 * @param {string} username - Kullanıcı adı
 * @param {string} password - Şifre
 * @returns {Promise<{success: boolean, error?: string}>}
 */
async function checkAdminPassword(username, password) {
    try {
        const { data, error } = await supabase
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

/**
 * Tüm şubeleri çek
 * @returns {Promise<Array>}
 */
async function getBranches() {
    try {
        const { data, error } = await supabase
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
 * Aktif tatlıları çek (is_active=true, display_order sıralı)
 * @returns {Promise<Array>}
 */
async function getActiveDesserts() {
    try {
        const { data, error } = await supabase
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
 * Günlük veri kaydet (INSERT veya UPDATE)
 * @param {string} branchId - Şube ID
 * @param {string} dessertId - Tatlı ID
 * @param {string} date - Tarih (YYYY-MM-DD)
 * @param {number} received - Gelen miktar
 * @param {number} remaining - Kalan miktar
 * @param {number} waste - Zayiat
 * @param {string} notes - Notlar
 * @returns {Promise<{success: boolean, error?: string}>}
 */
async function saveDailyEntry(branchId, dessertId, date, received, remaining, waste, notes = '') {
    try {
        // Önce bugün için kayıt var mı kontrol et
        const { data: existing, error: checkError } = await supabase
            .from('daily_entries')
            .select('id')
            .eq('branch_id', branchId)
            .eq('dessert_id', dessertId)
            .eq('entry_date', date)
            .single()

        if (checkError && checkError.code !== 'PGRST116') {
            // PGRST116 = not found, bu normal
            throw checkError
        }

        const entryData = {
            branch_id: branchId,
            dessert_id: dessertId,
            entry_date: date,
            received_amount: received,
            remaining_amount: remaining,
            waste_amount: waste,
            notes: notes,
            entry_time: new Date().toISOString()
        }

        if (existing) {
            // UPDATE
            const { error: updateError } = await supabase
                .from('daily_entries')
                .update(entryData)
                .eq('id', existing.id)

            if (updateError) throw updateError
        } else {
            // INSERT
            const { error: insertError } = await supabase
                .from('daily_entries')
                .insert([entryData])

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
 * @param {string} branchId - Şube ID
 * @param {string} date - Tarih (YYYY-MM-DD)
 * @returns {Promise<Array>}
 */
async function getDailyEntriesByBranch(branchId, date) {
    try {
        const { data, error } = await supabase
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
 * Tarih bazlı tüm günlük verileri çek (tüm şubeler)
 * @param {string} date - Tarih (YYYY-MM-DD)
 * @returns {Promise<Array>}
 */
async function getAllDailyEntriesByDate(date) {
    try {
        const { data, error } = await supabase
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
 * @param {string} startDate - Başlangıç tarihi (YYYY-MM-DD)
 * @param {string} endDate - Bitiş tarihi (YYYY-MM-DD)
 * @returns {Promise<Array>}
 */
async function getDailyEntriesDateRange(startDate, endDate) {
    try {
        const { data, error } = await supabase
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
 * Şube bazlı son 7 günlük verileri çek
 * @param {string} branchId - Şube ID
 * @returns {Promise<Array>}
 */
async function getLastSevenDays(branchId) {
    try {
        const today = new Date()
        const sevenDaysAgo = new Date(today)
        sevenDaysAgo.setDate(today.getDate() - 7)

        const { data, error } = await supabase
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
 * Mevcut stok - Tüm şubelerin güncel stoğu (her tatlı için)
 * @returns {Promise<Array>}
 */
async function getCurrentStock() {
    try {
        const today = new Date().toISOString().split('T')[0]
        
        const { data, error } = await supabase
            .from('daily_entries')
            .select(`
                remaining_amount,
                desserts (
                    id,
                    name,
                    emoji,
                    display_order
                ),
                branches (
                    id,
                    name
                )
            `)
            .eq('entry_date', today)

        if (error) throw error

        // Tatlı bazlı grupla
        const stockByDessert = {}
        
        if (data) {
            data.forEach(entry => {
                const dessertId = entry.desserts.id
                if (!stockByDessert[dessertId]) {
                    stockByDessert[dessertId] = {
                        dessertId: dessertId,
                        dessertName: entry.desserts.name,
                        emoji: entry.desserts.emoji,
                        displayOrder: entry.desserts.display_order,
                        totalRemaining: 0
                    }
                }
                stockByDessert[dessertId].totalRemaining += entry.remaining_amount || 0
            })
        }

        // Array'e çevir ve sırala
        return Object.values(stockByDessert).sort((a, b) => a.displayOrder - b.displayOrder)
    } catch (err) {
        console.error('Stok çekme hatası:', err)
        return []
    }
}

/**
 * Toast bildirimi göster
 * @param {string} message - Mesaj
 * @param {string} type - success, error, info
 */
function showToast(message, type = 'success') {
    // Toast elementi oluştur
    const toast = document.createElement('div')
    toast.className = `toast toast-${type}`
    toast.textContent = message
    
    // Style
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

    // 3 saniye sonra kaldır
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out'
        setTimeout(() => toast.remove(), 300)
    }, 3000)
}

/**
 * Loading spinner göster/gizle
 * @param {boolean} show - Göster/gizle
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
 * @param {string} dateString - YYYY-MM-DD
 * @returns {string} - 27 Şubat 2026, Perşembe
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
 * Bugünün tarihini al (YYYY-MM-DD)
 * @returns {string}
 */
function getTodayDate() {
    return new Date().toISOString().split('T')[0]
}

// CSS Animasyonları
const style = document.createElement('style')
style.textContent = `
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
document.head.appendChild(style)
