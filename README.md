# 🍰 Tatlı İmalat ve Dağıtım Takip Sistemi

**Mutlukent Esenlik Hizmetleri A.Ş** için geliştirilen tatlı üretim ve dağıtım takip uygulaması.

---

## 🌐 Canlı Uygulama

**Production:** https://mutlukent-tatli-takip.vercel.app

---

## 📋 Proje Hakkında

6 şubeye günlük tatlı dağıtımını takip eden, stok yönetimi sağlayan web uygulaması.

### Kullanıcılar

#### 👔 Yönetici
- **Yetki:** Tüm şubeler + Raporlama

#### 🏪 Şube Müdürleri (6 Şube)
- **Yetki:** Sadece kendi şubesi

#### 👨‍🍳 Tatlıcılar
- **Yetki:** Tüm şubeler stok görüntüleme (PIN korumalı)

### Şubeler
- 🌊 Rumeli İskelesi
- 📚 Yahya Kemal
- 🏞️ TunaBoyu
- 🏖️ Sahil
- 🚂 Vagon
- 🌳 Millet Bahçesi

### Özellikler
- ✅ 3 buton giriş sistemi
- ✅ 2 aşamalı veri girişi (Gelen → Kalan)
- ✅ Tatlıcılar stok paneli (PIN korumalı)
- ✅ Yönetici dashboard
- ✅ Şube özet ekranı
- ✅ Real-time otomatik hesaplama
- ✅ Responsive tasarım
- ✅ Dark mode

---

## 🛠️ Teknolojiler

- **Frontend:** HTML, CSS, JavaScript (Vanilla)
- **Backend:** Supabase (PostgreSQL)
- **Animasyon:** Anime.js
- **Deploy:** Vercel
- **CI/CD:** GitHub → Vercel (otomatik)

---

## 🚀 Deployment

### Vercel (Production)
```bash
# Otomatik deploy (main branch push)
git push origin main
```

### Local Development
```bash
# Python HTTP Server
python -m http.server 8000
# http://localhost:8000
```

---

## 📁 Dosya Yapısı

```
Tatli-Imalat-Dagitim/
├── index.html              # Ana giriş (3 buton)
├── branch-menu.html        # Müdür menü
├── gelen-tatlilar.html     # Gelen tatlılar girişi
├── kalan-tatlilar.html     # Kalan tatlılar girişi
├── subem.html              # Şube dashboard
├── tatlilar-panel.html     # Tatlıcılar stok paneli
├── admin-dashboard.html    # Yönetici paneli
├── supabase-client.js      # Backend logic
├── favicon.svg             # Site ikonu
├── vercel.json             # Vercel config
└── README.md
```

---

## 🔧 Geliştirme

### Commit Mesajları
```
feat:     Yeni özellik
fix:      Hata düzeltmesi
style:    UI/CSS değişikliği
refactor: Kod düzenlemesi
docs:     Dokümantasyon
deploy:   Deployment işlemleri
```

---

## 📊 Database Schema

### Tablolar
- `branches` — Şubeler
- `desserts` — Tatlılar
- `daily_entries` — Günlük girişler
- `admins` — Yöneticiler

### İlişkiler
```
daily_entries
  ├─ branch_id  → branches(id)
  └─ dessert_id → desserts(id)
```

---

## 🎯 Roadmap

- [x] 3 buton giriş sistemi
- [x] 2 aşamalı veri girişi
- [x] Tatlıcılar paneli
- [x] Vercel deployment
- [ ] PDF rapor export
- [ ] Grafik analizler

---

## 📞 İletişim

- **Şirket:** Mutlukent Esenlik Hizmetleri A.Ş
- **GitHub:** https://github.com/Methefor/Tatli-Imalat-Dagitim
- **Live App:** https://mutlukent-tatli-takip.vercel.app

---

## 📝 Lisans

Bu proje Mutlukent Esenlik Hizmetleri A.Ş için geliştirilmiştir.
© 2026 Tüm hakları saklıdır.
