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

6 farklı şubede günlük tatlı dağıtımını, stok girişini ve satış takibini merkezi bir platform üzerinden yöneten web uygulaması. Şube müdürleri sabah teslim alınan tatlıları, akşam kalan stoku sisteme girer; satış otomatik hesaplanır ve yönetici anlık raporlara erişir.

```
Tatlıcı üretir → Şubeye teslim → Müdür girer → Satış otomatik → Yönetici raporlar
```

---

## ✨ Özellikler

| Özellik | Açıklama |
|---------|----------|
| 📦 **Gelen Tatlılar** | Her şubeye günlük teslim alınan ürünlerin miktarını kayıt altına al |
| ✅ **Kalan Tatlılar** | Gün sonu stok sayımı — satış `Gelen − Kalan` ile otomatik hesaplanır |
| 🔄 **Şube Arası Transfer** | Fazla stoku başka şubeye gönder, iki şubeye birden anlık yansır |
| 📊 **Aylık Rapor** | Şube bazlı aylık gelen / satılan / kalan istatistikleri |
| 🏢 **Admin Dashboard** | Tüm şubelerin KPI kartları, bar grafiği ve performans tablosu |
| 👨‍🍳 **Tatlıcı Paneli** | Üretim planlaması için PIN korumalı anlık stok görünümü |
| 🏭 **Üretim Paneli** | Şifresiz erişimli şube × tatlı matris tablosu |
| 📱 **PWA Desteği** | Ana ekrana eklenebilir, amber ikonlu — maskable PWA uyumlu |
| 🔒 **Rol Bazlı Erişim** | Yönetici / Müdür / Tatlıcı / Üretim — her rol ayrı korumalı |
| ⚡ **Anlık Güncelleme** | Otomatik yenileme: Tatlıcı 60sn · Üretim 5dak · Admin 30sn |

---

## 👥 Kullanıcı Rolleri

```
┌─────────────────────────────────────────────────────────────────────┐
│                    KULLANICI ROL MATRİSİ                           │
├──────────────┬─────────────┬───────────────┬──────────────────────┤
│     Rol      │   Erişim    │  Kim Kullanır │       Yetkiler        │
├──────────────┼─────────────┼───────────────┼──────────────────────┤
│ 🏢 Yönetici  │ Kullanıcı + │  Merkez Mgmt  │ Tüm raporlar, KPI   │
│              │   Şifre     │               │ analitik, grafikler  │
├──────────────┼─────────────┼───────────────┼──────────────────────┤
│ 👤 Müdür     │  Şube PIN   │  Şube Sorumlu │ Kendi şubesi stok   │
│              │  (4 hane)   │               │ girişi, transfer     │
├──────────────┼─────────────┼───────────────┼──────────────────────┤
│ 👨‍🍳 Tatlıcı  │  PIN: 0000  │ İmalat Ekibi  │ Stok görüntüleme    │
│              │  (session)  │               │ üretim planlama      │
├──────────────┼─────────────┼───────────────┼──────────────────────┤
│ 🏭 Üretim    │  Şifresiz   │ Sevkiyat Ekip │ Matris tablosu      │
│              │   Erişim    │               │ anlık stok durumu    │
└──────────────┴─────────────┴───────────────┴──────────────────────┘
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

## 📸 Ekran Görüntüleri

<div align="center">

### Giriş Ekranı & Şube Seçimi

| Ana Giriş | Şube Seçimi | PIN Girişi |
|:---------:|:-----------:|:----------:|
| <img src="docs/screenshots/01-login.png" width="280" alt="Ana Giriş"/> | <img src="docs/screenshots/02-branch-select.png" width="280" alt="Şube Seçimi"/> | <img src="docs/screenshots/03-pin-entry.png" width="280" alt="PIN Girişi"/> |

### Müdür Paneli

| Ana Menü | Gelen Tatlılar | Kalan Tatlılar |
|:--------:|:--------------:|:--------------:|
| <img src="docs/screenshots/04-manager-menu.png" width="280" alt="Müdür Menü"/> | <img src="docs/screenshots/05-incoming.png" width="280" alt="Gelen Tatlılar"/> | <img src="docs/screenshots/06-remaining.png" width="280" alt="Kalan Tatlılar"/> |

### Raporlar & Özel Ekranlar

| Şubem (Aylık Rapor) | Şube Arası Transfer | Yönetici Paneli |
|:-------------------:|:-------------------:|:---------------:|
| <img src="docs/screenshots/07-branch-stats.png" width="280" alt="Şubem"/> | <img src="docs/screenshots/08-transfer.png" width="280" alt="Transfer"/> | <img src="docs/screenshots/10-admin.png" width="280" alt="Admin"/> |

### Üretim & Tatlıcılar

<img src="docs/screenshots/09-confectioner.png" width="860" alt="Tatlıcılar Paneli"/>

</div>

---

## 🛠️ Teknoloji Yığını

```
Frontend        → HTML5 · CSS3 · Vanilla JavaScript
Backend         → Supabase (PostgreSQL + Auth)
Animasyon       → Anime.js
Grafikler       → Chart.js
Deploy          → Vercel (GitHub → otomatik CI/CD)
PWA             → Web App Manifest · Service Worker
```

---

## 📁 Proje Yapısı

```
Tatli-Imalat-Dagitim/
│
├── index.html                    # 🔐 Ana giriş (3 rol butonu)
├── branch-menu.html              # 👤 Müdür ana menüsü
├── gelen-tatlilar.html           # 📦 Gelen tatlı girişi
├── kalan-tatlilar.html           # ✅ Kalan stok girişi
├── subem.html                    # 📊 Aylık şube raporu
├── transfer.html                 # 🔄 Şube arası transfer
├── admin-dashboard.html          # 🏢 Yönetici KPI paneli
├── tatlilar-panel.html           # 👨‍🍳 Tatlıcı stok paneli
├── uretim.html                   # 🏭 Üretim matris tablosu
│
├── supabase-client.js            # 🗄️ Tüm DB fonksiyonları
├── manifest.json                 # 📱 PWA manifest
├── sw.js                         # ⚡ Service Worker
├── icon-512.png                  # 🍮 Amber arka planlı maskable ikon
│
├── docs/
│   ├── screenshots/              # 📸 Ekran görüntüleri
│   └── demo.svg                  # 🎬 Animasyonlu demo
│
└── Tatlı Takip Sistemi kullanım kılavuzu/
    ├── KULLANIM_KILAVUZU.md      # 📖 Detaylı kullanım kılavuzu
    ├── kilavuz-slayt.html        # 📊 14 slaytlı interaktif sunum
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

-- İlişkiler
daily_entries.branch_id  → branches(id)
daily_entries.dessert_id → desserts(id)

-- Otomatik hesaplama
satilan = received_amount - remaining_amount
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

## 📅 Günlük İş Akışı

```
☀️  SABAH    → Tatlıcı stok kontrol → Üretim → Teslimat
               Müdür "Gelen Tatlılar"'ı girer

🌤️  GÜN İÇİ → Satış devam eder
               Gerekirse şubeler arası Transfer

🌙  AKŞAM   → Müdür "Kalan Tatlılar"'ı girer
               Satış otomatik hesaplanır
               Yönetici raporları inceler
```

---

## 📝 Commit Mesajı Konvansiyonu

```
feat:     Yeni özellik ekle
fix:      Hata düzelt
style:    UI/CSS değişikliği
refactor: Kod düzenlemesi
docs:     Dokümantasyon güncelle
deploy:   Deployment işlemleri
```

---

## 🎬 Canlı Demo

<div align="center">

<img src="docs/demo.svg" width="900" alt="Tatlı Takip Sistemi Demo — Giriş · Yönetici Paneli · Tatlıcılar Paneli"/>

> *Demo 30 saniyede 3 ekranı otomatik döngü ile gösterir: Giriş Ekranı → Yönetici Paneli → Tatlıcı Paneli*

</div>

---

<div align="center">

**© 2026 Mutlukent Esenlik Hizmetleri A.Ş. · Tüm hakları saklıdır.**

[![GitHub](https://img.shields.io/badge/GitHub-Methefor-181717?style=flat-square&logo=github)](https://github.com/Methefor/Tatli-Imalat-Dagitim)
[![Live](https://img.shields.io/badge/Live-tli--takip.vercel.app-f59e0b?style=flat-square)](https://tli-takip.vercel.app)

</div>