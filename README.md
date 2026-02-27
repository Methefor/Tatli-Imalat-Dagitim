# 🍰 Tatlı İmalat ve Dağıtım Takip Sistemi

Mutlukent Esenlik Hizmetleri A.Ş için geliştirilen tatlı üretim ve dağıtım takip sistemi.

---

## 📋 Proje Hakkında

6 şubeye günlük tatlı dağıtımını takip eden, stok ve zayiat yönetimi sağlayan web uygulaması.

### Özellikler
- ✅ 6 şube müdürü veri girişi
- ✅ 1 genel müdür dashboard'u
- ✅ 9 aktif tatlı çeşidi
- ✅ Günlük/Haftalık/Aylık raporlama
- ✅ Grafik ve istatistikler (Chart.js)
- ✅ Responsive tasarım
- ✅ Dark mode
- ✅ Real-time validation
- ✅ Supabase backend

---

## 🛠️ Teknolojiler

- **Frontend:** HTML, CSS, JavaScript (Vanilla)
- **Backend:** Supabase (PostgreSQL)
- **Grafikler:** Chart.js
- **Deploy:** GitHub Pages
- **CDN:** Supabase.js CDN

---

## 🚀 Kurulum

### 1. Repository'yi Clone Et
```bash
git clone https://github.com/Methefor/Tatli-Imalat-Dagitim.git
cd Tatli-Imalat-Dagitim
```

### 2. Local'de Çalıştır
```bash
# Python HTTP Server
python -m http.server 8000

# Tarayıcıda aç
http://localhost:8000
```

### 3. GitHub Pages Deploy
```bash
# Repository Settings → Pages → Source: main branch → Save
# Otomatik deploy edilecek
```

---

## 👥 Kullanıcılar

### Şube Müdürleri
- **Şubeler:** Rumeli İskelesi / Yahya Kemal / TunaBoyu / Sahil / Vagon / Millet Bahçesi
- **Şifre:** `1234` (tüm şubeler için)

### Genel Müdür
- **Kullanıcı Adı:** `admin`
- **Şifre:** `0000`

---

## 🎯 Kullanım

### Şube Müdürü Olarak
1. Ana sayfada şubenizi seçin
2. Şifre girin (1234)
3. Her tatlı için verileri girin:
   - **Gelen:** Bugün kaç adet geldi
   - **Kalan:** Gün sonunda kaç adet kaldı
   - **Zayiat:** Bozulan/atılan adet
4. **Satılan** otomatik hesaplanır
5. Kaydet butonuna basın

### Genel Müdür Olarak
1. "Genel Müdür Girişi" butonuna tıklayın
2. Kullanıcı adı: `admin`, Şifre: `0000`
3. Dashboard'da tüm verileri görün:
   - Toplam dağıtım, satış, stok, zayiat
   - Tarih filtresi (Bugün/Bu Hafta/Bu Ay/Tümü)
   - Şube bazlı tablo
   - Tatlı bazlı satış grafiği
   - Zayiat analizi
   - Mevcut stok durumu

---

## 📊 Veri Modeli

```
Şube → Günlük Giriş → Tatlı
  ↓         ↓           ↓
Gelen    Kalan      Zayiat
  ↓         ↓           ↓
      Satılan (Otomatik)
```

**Formül:** `Satılan = Gelen - Kalan - Zayiat`

---

## 📁 Dosya Yapısı

```
Tatli-Imalat-Dagitim/
├── index.html              # Giriş ekranı (Şube/Admin seçimi)
├── branch-entry.html       # Şube veri girişi
├── admin-dashboard.html    # Genel müdür paneli
├── js/
│   └── supabase-client.js  # Backend logic
├── README.md               # Bu dosya
└── .gitignore              # Git ignore kuralları
```

---

## 🎨 Tasarım

### Renk Paleti
- **Primary:** #f59e0b (Turuncu)
- **Background:** #0f172a (Dark)
- **Card:** #1e293b
- **Success:** #22c55e
- **Danger:** #ef4444

### Responsive Breakpoints
- Desktop: 1024px+
- Tablet: 768px - 1024px
- Mobile: < 768px

---

## 🗄️ Supabase Tabloları

### 1. branches (Şubeler)
- 6 şube
- Şifre: 1234

### 2. desserts (Tatlılar)
- 9 aktif tatlı
- 2 pasif tatlı

### 3. daily_entries (Günlük Girişler)
- Şube + Tatlı + Tarih bazlı
- Gelen, Kalan, Zayiat, Satılan (otomatik)

### 4. admins (Yöneticiler)
- username: admin
- password: 0000

---

## 🔒 Güvenlik

- ⚠️ **Development Mode:** Şifreler plain text
- ⚠️ **RLS:** Public read/write
- 🔜 **Production'da yapılacaklar:**
  - Şifre hash'leme (bcrypt)
  - JWT authentication
  - Sıkı RLS politikaları

---

## 🚀 Özellikler (Roadmap)

### ✅ Faz 1 (Tamamlandı)
- [x] Şube veri girişi
- [x] Admin dashboard
- [x] Grafik ve istatistikler
- [x] Responsive tasarım
- [x] Supabase entegrasyonu

### 🔜 Faz 2 (Gelecek)
- [ ] Şifre hash'leme
- [ ] JWT authentication
- [ ] Email bildirimleri
- [ ] PDF rapor export
- [ ] Excel export
- [ ] Tatlı/Şube ekleme (Admin)
- [ ] Hedef belirleme
- [ ] Tahminleme algoritması

---

## 📞 İletişim

**Geliştirici:** Metehan Arslan  
**Şirket:** Mutlukent Esenlik Hizmetleri A.Ş  
**GitHub:** https://github.com/Methefor/Tatli-Imalat-Dagitim

---

## 📝 Lisans

Bu proje Mutlukent Esenlik Hizmetleri A.Ş için geliştirilmiştir.  
© 2026 Tüm hakları saklıdır.