<div align="center">

# 🍮 Tatlı İmalat ve Dağıtım Takip Sistemi

**Mutlukent Esenlik Hizmetleri A.Ş.** için geliştirilmiş, 6 şubeli tatlı üretim ve dağıtım takip platformu.

[![Live App](https://img.shields.io/badge/🌐_Canlı_Uygulama-tli--takip.vercel.app-f59e0b?style=for-the-badge&logo=vercel&logoColor=white)](https://tli-takip.vercel.app)
[![Deploy Status](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://tli-takip.vercel.app)
[![Supabase](https://img.shields.io/badge/Backend-Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://tli-takip.vercel.app)
[![JavaScript](https://img.shields.io/badge/Frontend-Vanilla_JS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](/)

</div>

---

## 📖 Hakkında

6 farklı şubede günlük tatlı dağıtımını, stok girişini ve satış takibini merkezi bir platform üzerinden yöneten web uygulaması. Şube müdürleri sabah teslim alınan tatlıları, akşam kalan stoku sisteme girer; satış otomatik hesaplanır ve yönetici anlık raporlara erişir. Dağıtım personeli hangi şubeye kaç tatlı bıraktığını gerçek zamanlı takip eder.

```
Tatlıcı üretir → Şubeye teslim → Müdür girer → Satış otomatik → Yönetici raporlar
```

---

## ✨ Özellikler

| Özellik | Açıklama |
|---------|----------|
| 📦 **Gelen Tatlılar** | Biriktirme + Düzeltme modu — mevcut girişin üstüne ekle veya sıfırdan yaz |
| ✅ **Kalan Tatlılar** | Gün sonu stok sayımı — satış `Gelen − Kalan` ile otomatik hesaplanır |
| 🚚 **Dağıtım Paneli** | PIN korumalı panel: şube giriş takibi, eşik bazlı dağıtım planı |
| 🔄 **Şube Arası Transfer** | Fazla stoku başka şubeye gönder, iki şubeye birden anlık yansır |
| 📊 **Aylık Rapor** | Şube bazlı aylık gelen / satılan / kalan / zayiat istatistikleri |
| 🏢 **Admin Dashboard** | KPI kartları, satış trendi grafiği, zayiat raporu ve ciro tahmini |
| 👨‍🍳 **Tatlıcı Paneli** | PIN korumalı anlık stok görünümü — şube bazlı açılır/kapanır kartlar |
| 🏭 **Üretim Paneli** | Şifresiz erişimli şube × tatlı matris tablosu |
| 🔑 **Süper Admin** | Tatlı yönetimi, şube müdür ataması, PIN yönetimi, eşik özelleştirme |
| 🗑️ **Zayiat Takibi** | Şubeye özel zayiat girişi ve raporlama |
| 📱 **PWA Desteği** | Ana ekrana eklenebilir, maskable ikon, Service Worker cache |
| 🔒 **Rol Bazlı Erişim** | Yönetici / Müdür / Tatlıcı / Üretim / Dağıtım — her rol ayrı korumalı |

---

## 📸 Ekran Görüntüleri

<div align="center">

### Giriş & Navigasyon

| Giriş Ekranı | Şube Seçimi | Müdür PIN |
|:-----------:|:-----------:|:---------:|
| <img src="docs/screenshots/01-login.png" width="260" alt="Giriş Ekranı"/> | <img src="docs/screenshots/02-branch-select.png" width="260" alt="Şube Seçimi"/> | <img src="docs/screenshots/03-pin-entry.png" width="260" alt="PIN Girişi"/> |

### Müdür Paneli

| Ana Menü | Gelen Tatlılar | Kalan Tatlılar |
|:--------:|:--------------:|:--------------:|
| <img src="docs/screenshots/04-manager-menu.png" width="260" alt="Müdür Menü"/> | <img src="docs/screenshots/05-incoming.png" width="260" alt="Gelen Tatlılar"/> | <img src="docs/screenshots/06-remaining.png" width="260" alt="Kalan Tatlılar"/> |

| Şube İstatistikleri | Şube Arası Transfer | İşlem Kayıtları |
|:------------------:|:-------------------:|:--------------:|
| <img src="docs/screenshots/07-branch-stats.png" width="260" alt="İstatistikler"/> | <img src="docs/screenshots/08-transfer.png" width="260" alt="Transfer"/> | <img src="docs/screenshots/25-manager-logs.png" width="260" alt="İşlem Kayıtları"/> |

### Dağıtım Paneli

| Şube Girişleri | Dağıtım Planı | Güncel Stok |
|:--------------:|:-------------:|:-----------:|
| <img src="docs/screenshots/13-delivery-entries.png" width="260" alt="Gelen Girişler"/> | <img src="docs/screenshots/12-delivery-plan.png" width="260" alt="Dağıtım Planı"/> | <img src="docs/screenshots/11-delivery.png" width="260" alt="Dağıtım Paneli"/> |

### Yönetici Paneli

| Ana Görünüm | KPI & Performans | Stok & Satış Trendi |
|:-----------:|:----------------:|:-------------------:|
| <img src="docs/screenshots/10-admin.png" width="260" alt="Admin Panel"/> | <img src="docs/screenshots/15-admin-kpi.png" width="260" alt="KPI"/> | <img src="docs/screenshots/14-admin-stock.png" width="260" alt="Stok Trendi"/> |

| Zayiat Raporu | Zayiat Girişi | Şube Stokları |
|:-------------:|:-------------:|:-------------:|
| <img src="docs/screenshots/16-admin-waste.png" width="260" alt="Zayiat Raporu"/> | <img src="docs/screenshots/17-waste-entry.png" width="260" alt="Zayiat Girişi"/> | <img src="docs/screenshots/18-branch-stocks.png" width="260" alt="Şube Stokları"/> |

### Tatlıcı & Üretim Paneli

| Tatlıcılar Paneli | Şube Bazlı Stoklar |
|:-----------------:|:------------------:|
| <img src="docs/screenshots/09-confectioner.png" width="430" alt="Tatlıcılar Paneli"/> | <img src="docs/screenshots/19-confectioner-stocks.png" width="430" alt="Şube Stokları"/> |

### Süper Admin Yönetimi

| Şube & Müdür Yönetimi | Tatlı Listesi | PIN Yönetimi |
|:---------------------:|:-------------:|:------------:|
| <img src="docs/screenshots/21-branch-mgmt.png" width="260" alt="Şube Yönetimi"/> | <img src="docs/screenshots/22-dessert-mgmt.png" width="260" alt="Tatlı Yönetimi"/> | <img src="docs/screenshots/23-pin-mgmt.png" width="260" alt="PIN Yönetimi"/> |

### Sistem İş Akışı

<img src="docs/screenshots/20-workflow.png" width="860" alt="Tatlı Takip Sistemi İş Akışı"/>

</div>

---

## 👥 Kullanıcı Rolleri

```
┌──────────────────────────────────────────────────────────────────────────┐
│                        KULLANICI ROL MATRİSİ                            │
├───────────────┬──────────────┬────────────────┬─────────────────────────┤
│     Rol       │    Erişim    │  Kim Kullanır  │        Yetkiler          │
├───────────────┼──────────────┼────────────────┼─────────────────────────┤
│ 🔑 Süper Admin│ Özel şifre   │ Sistem Yönet.  │ Tam yönetim, eşik ayarı │
├───────────────┼──────────────┼────────────────┼─────────────────────────┤
│ 🏢 Yönetici   │ Kullanıcı +  │ Merkez Mgmt    │ Tüm raporlar, KPI,      │
│               │ Şifre        │                │ analitik, grafikler      │
├───────────────┼──────────────┼────────────────┼─────────────────────────┤
│ 👤 Müdür      │ Şube PIN     │ Şube Sorumlusu │ Kendi şubesi stok girişi │
│               │ (4 hane)     │                │ transfer, zayiat         │
├───────────────┼──────────────┼────────────────┼─────────────────────────┤
│ 🚚 Dağıtım    │ Dağıtım PIN  │ Sevkiyat Ekibi │ Şube girişleri, dağıtım  │
│               │              │                │ planı, stok durumu       │
├───────────────┼──────────────┼────────────────┼─────────────────────────┤
│ 👨‍🍳 Tatlıcı  │ PIN: 0000    │ İmalat Ekibi   │ Stok görüntüleme,       │
│               │ (session)    │                │ üretim planlama          │
├───────────────┼──────────────┼────────────────┼─────────────────────────┤
│ 🏭 Üretim     │ Şifresiz     │ Sevkiyat Ekip  │ Matris tablosu,         │
│               │ Erişim       │                │ anlık stok durumu        │
└───────────────┴──────────────┴────────────────┴─────────────────────────┘
```

---

## 🏪 Şubeler

| Şube | Emoji | Müdür |
|------|-------|-------|
| Rumeli İskelesi | 🌊 | Metehan Arslan |
| Yahya Kemal | 📚 | Berkay Nazlıgül |
| TunaBoyu | 🏞️ | Semra Polat |
| Sahil | 🏖️ | Bahtiyar Kurt |
| Vagon | 🚂 | Baturay Cimpiri |
| Millet Bahçesi | 🌳 | Melis Boyalık |

---

## 🚚 Dağıtım Paneli Özellikleri

Dağıtım personeli için özel PIN korumalı panel:

- **Bugün Gelen Girişleri** — Her şubenin gün içinde kaydettiği gelen tatlılar, tatlı bazlı kart düzeninde
- **Açılır/Kapanır Kartlar** — Girdi yapılan şubeler otomatik açık gelir; girdi yapılmayanlar kırmızı uyarıyla kapalı
- **Dağıtım Planı** — Şube × tatlı matris tablosu; eşiğin altındaki stoklarda `ACİL` veya `+N` uyarısı
- **Akıllı Eşikler** — Yüksek hacimli şubeler (Rumeli, Millet B., Yahya K.) için farklı, diğerleri için farklı minimum stok eşiği

| Tatlı | Yüksek Hacim | Diğer Şubeler |
|-------|:---:|:---:|
| Magnolya | 40 | 20 |
| San Sebastian | 30 | 10 |
| Tiramisu | 25 | 10 |
| Truff / Cheesecake / Mozaik / Trileçe | 20 | 10 |
| İbiza | 10 | 5 |
| Gökkuşağı | 10 | 0 |

---

## 🛠️ Teknoloji Yığını

```
Frontend        → HTML5 · CSS3 · Vanilla JavaScript (no framework)
Backend         → Supabase (PostgreSQL + Row Level Security)
Grafikler       → Chart.js
Deploy          → Vercel (GitHub → otomatik CI/CD)
PWA             → Web App Manifest · Service Worker (cache-first)
```

---

## 📁 Proje Yapısı

```
Tatli-Imalat-Dagitim/
│
├── index.html                    # 🔐 Ana giriş (3 rol butonu)
├── branch-menu.html              # 👤 Müdür ana menüsü
├── gelen-tatlilar.html           # 📦 Gelen tatlı girişi (2 mod)
├── kalan-tatlilar.html           # ✅ Kalan stok girişi
├── subem.html                    # 📊 Aylık şube raporu
├── transfer.html                 # 🔄 Şube arası transfer
├── admin-dashboard.html          # 🏢 Yönetici KPI paneli
├── dagitim.html                  # 🚚 Dağıtım personel paneli
├── tatlilar-panel.html           # 👨‍🍳 Tatlıcı stok paneli
├── uretim.html                   # 🏭 Üretim matris tablosu
├── superadmin.html               # 🔑 Süper admin yönetimi
├── zayiat.html                   # 🗑️ Zayiat girişi
│
├── supabase-client.js            # 🗄️ Tüm DB fonksiyonları
├── manifest.json                 # 📱 PWA manifest
├── sw.js                         # ⚡ Service Worker
│
├── docs/
│   └── screenshots/              # 📸 Ekran görüntüleri (25 adet)
│
└── Tatlı Takip Sistemi kullanım kılavuzu/
    ├── KULLANIM_KILAVUZU.md      # 📖 Detaylı kullanım kılavuzu
    ├── kilavuz-slayt.html        # 📊 İnteraktif sunum
    └── [screenshots + PDF]       # 📸 Tüm ekran görüntüleri
```

---

## 🗄️ Veritabanı Şeması

```sql
branches        → id · name · password · manager_name
desserts        → id · name · emoji · display_order · is_active
daily_entries   → id · branch_id · dessert_id · entry_date
                     received_amount · remaining_amount · waste_amount
                     notes · entry_time
admins          → id · username · password · name
settings        → key · value  -- Pin kodları, eşikler, genel ayarlar

-- Otomatik hesaplama
satilan = received_amount - remaining_amount
```

---

## 📅 Günlük İş Akışı

```
☀️  SABAH    → Dağıtım personeli tatlıları şubelere teslim eder
               Müdür "Gelen Tatlılar"ı girer (biriktirme modu)
               Dağıtım Paneli'nde girişler canlı takip edilir

🌤️  GÜN İÇİ → Satış devam eder
               Gerekirse şubeler arası Transfer yapılır
               Tatlıcı panelinde stok durumu izlenir

🌙  AKŞAM   → Müdür "Kalan Tatlılar"ı girer
               Satış otomatik hesaplanır
               Yönetici KPI ve grafik raporları inceler
```

---

## 🚀 Kurulum & Geliştirme

```bash
# Repo'yu klonla
git clone https://github.com/Methefor/Tatli-Imalat-Dagitim.git
cd Tatli-Imalat-Dagitim

# Local sunucu başlat
python -m http.server 8000
# → http://localhost:8000

# Deploy (GitHub main'e push → Vercel otomatik deploy)
git push origin main
```

---

<div align="center">

**© 2026 Mutlukent Esenlik Hizmetleri A.Ş. · Tüm hakları saklıdır.**

[![GitHub](https://img.shields.io/badge/GitHub-Methefor-181717?style=flat-square&logo=github)](https://github.com/Methefor/Tatli-Imalat-Dagitim)
[![Live](https://img.shields.io/badge/Live-tli--takip.vercel.app-f59e0b?style=flat-square)](https://tli-takip.vercel.app)

</div>
