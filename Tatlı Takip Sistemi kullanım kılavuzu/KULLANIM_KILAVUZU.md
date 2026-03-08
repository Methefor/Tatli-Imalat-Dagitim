# Tatlı İmalat ve Dağıtım Takip Sistemi — Kullanım Kılavuzu

> **Sistem Adresi:** https://tli-takip.vercel.app
> **Son Güncelleme:** Mart 2026

---

## İçindekiler

1. [Sisteme Genel Bakış](#1-sisteme-genel-bakış)
2. [Kullanıcı Rolleri](#2-kullanıcı-rolleri)
3. [Giriş Ekranı](#3-giriş-ekranı)
4. [Yönetici (Admin) Paneli](#4-yönetici-admin-paneli)
5. [Müdür Paneli](#5-müdür-paneli)
6. [Tatlıcı Paneli](#6-tatlıcı-paneli)
7. [Üretim Paneli](#7-üretim-paneli)
8. [Günlük İş Akışı](#8-günlük-iş-akışı)
9. [Şubeler ve Sorumluları](#9-şubeler-ve-sorumluları)
10. [Sık Sorulan Sorular](#10-sık-sorulan-sorular)

---

## 1. Sisteme Genel Bakış

Bu sistem, şube bazlı tatlı üretimi ve dağıtımını takip etmek için tasarlanmıştır. Merkezi bir veritabanı üzerinden çalışır; her şubede nerede ne kadar tatlı bulunduğunu, ne kadar satıldığını ve ne kadar fire verildiğini anlık olarak izlemenizi sağlar.

**Sistemin yaptıkları:**
- Her şubeye gün içinde gelen tatlı miktarlarını kayıt altına alır
- Gün sonu kalan stoku takip eder
- Satılan miktar otomatik hesaplanır (Gelen − Kalan = Satılan)
- Şubeler arası tatlı transferlerini kaydeder
- Aylık/haftalık/günlük raporlar üretir
- Tatlıcı ekibine anlık stok görünürlüğü sağlar

**Sistemde tutulan veriler:**
| Kayıt | Açıklama |
|-------|----------|
| Gelen | O gün şubeye teslim edilen tatlı adedi |
| Kalan | Günün sonunda şubede artan tatlı adedi |
| Satılan | Gelen − Kalan farkı (otomatik) |
| Transfer | Başka şubeye gönderilen miktar |

---

## 2. Kullanıcı Rolleri

Sistemde **4 farklı kullanıcı rolü** bulunur:

| Rol | Kim? | Erişim |
|-----|------|--------|
| **Yönetici (Admin)** | Merkez yönetim | Tüm şubelerin raporları, analitikler |
| **Müdür** | Şube sorumluları | Kendi şubelerinin giriş ekranları |
| **Tatlıcı** | Üretim/imalat ekibi | Stok özet paneli (okuma) |
| **Üretim Ekibi** | Sevkiyat/dağıtım | Anlık stok matrisi (şifrесиз) |

---

## 3. Giriş Ekranı

**Adres:** Ana sayfa (`/`)

Giriş ekranında üç farklı yol mevcuttur:

---

### 3.1 Müdür Girişi

1. Sayfada görünen **şube kartlarından** kendi şubenize tıklayın.
   *(🌊 Rumeli İskelesi, 📚 Yahya Kemal, 🚂 Vagon, vb.)*
2. Açılan kutucuğa **4 haneli şube şifrenizi** girin.
3. **"Giriş Yap"** butonuna basın.
4. Doğrulanırsa Müdür Menüsüne yönlendirilirsiniz.

> ⚠️ **Dikkat:** Her şubenin ayrı şifresi vardır. Yanlış şube seçilirse giriş yapılamaz.

---

### 3.2 Yönetici (Admin) Girişi

1. Giriş ekranının alt kısmındaki **"Yönetici Girişi"** bağlantısına tıklayın.
2. **Kullanıcı adı** ve **şifrenizi** girin.
3. **"Giriş Yap"** butonuna basın.
4. Admin Kontrol Paneline yönlendirilirsiniz.

---

### 3.3 Tatlıcı Paneli Girişi

1. Giriş ekranındaki **"Tatlıcılar Paneli"** butonuna tıklayın.
2. **4 haneli PIN** kodunu girin.
3. Stok özet sayfasına erişirsiniz.

> Tatlıcı PIN'i varsayılan olarak **`0000`**'dır.

---

## 4. Yönetici (Admin) Paneli

**Kimler Kullanır:** Merkez yönetim, işletme sahibi
**Sayfа:** `/admin-dashboard.html`

Admin paneli şirketin tüm verilerini tek ekranda gösterir.

---

### 4.1 Ekranın Bölümleri

#### Üst Bar
- Sağ üstte **canlı saat** ve tarih
- **Çıkış Yap** butonu (sol üst)
- Yeşil "Canlı" göstergesi (sistem aktif anlamına gelir)

#### Zaman Filtresi Sekmeleri
Verileri şu dönemler için filtreleyebilirsiniz:

| Sekme | Gösterilen Veriler |
|-------|--------------------|
| **Bugün** | Sadece bugünkü hareketler |
| **Bu Hafta** | Pazartesiden bugüne |
| **Bu Ay** | Ayın başından bugüne |
| **Tümü** | Tüm kayıtlı veriler |

#### Özet Kartlar (KPI)
- **Toplam Dağıtım:** Seçilen dönemde tüm şubelere gönderilen toplam tatlı adedi. Hedef: 2.500 adet (ilerleme çubuğu ile görüntülenir).
- **Toplam Satış:** Hesaplanan satış adedi (Gelen − Kalan) ve satış oranı (%).
- **Mevcut Stok:** Tüm şubelerdeki güncel toplam stok.

#### Şube Performans Tablosu
Tüm şubeler yan yana karşılaştırılır:

| Sütun | Açıklama |
|-------|----------|
| Şube | Şube adı |
| Gelen | Dönemde teslim alınan toplam |
| Satılan | Hesaplanan satış |
| Kalan | Güncel stok |
| Satış Oranı | % olarak — yeşil iyi, sarı orta, kırmızı düşük |

#### Tatlı Satış Dağılımı (Bar Grafik)
Her tatlı türü için toplam satış rakamını görsel olarak gösterir.

#### Güncel Stok Durumu
Tüm tatlı türlerinin anlık stok adetleri kart olarak listelenir.

---

### 4.2 Yöneticinin Günlük Görevleri

- [ ] Her sabah **"Bugün"** sekmesini açarak dünkü kapanış stoklarını kontrol edin
- [ ] Satış oranı **kırmızı** görünen şubelerle iletişime geçin
- [ ] Haftalık periyotta **"Bu Hafta"** sekmesiyle şube performanslarını karşılaştırın
- [ ] Aylık hedef takibini **"Bu Ay"** sekmesinden yapın
- [ ] Stok çok fazla birikiyor ya da tükeniyor ise üretim planlamasını buna göre ayarlayın

---

## 5. Müdür Paneli

**Kimler Kullanır:** Her şubenin sorumlu müdürü
**Erişim:** Kendi şube şifresiyle giriş

Müdür panelinde **4 ana işlem** bulunur:

---

### 5.1 Müdür Ana Menüsü

Giriş yaptıktan sonra karşınıza çıkan 4 kart:

| Kart | Ne İşe Yarar |
|------|-------------|
| 📦 **Gelen Tatlılar** | Gün içinde teslim alınan tatlıları kaydet |
| ✅ **Kalan Tatlılar** | Gün sonu stoğunu gir |
| 📊 **Şubem** | Aylık rapor ve istatistikleri gör |
| 🔄 **Şube Arası Transfer** | Fazla tatlıyı başka şubeye gönder |

---

### 5.2 Gelen Tatlılar

**Ne Zaman Kullanılır:** Tatlılar teslim alındığında (genellikle sabah veya öğlen)

**Nasıl Kullanılır:**
1. Ana menüden **"Gelen Tatlılar"**'a tıklayın.
2. Üstte tarih görüntülenir. Farklı bir tarih için **`<`** veya **`>`** oklarını** kullanın.
3. Her tatlı türünün yanındaki **kutuya gelen adedi** yazın.
4. Hiç gelmemiş tatlıları **0 bırakın** (dokunmayın).
5. **"Kaydet"** butonuna basın.

> 💡 **İpucu:** Aynı gün için birden fazla teslimat aldıysanız, son miktarı kutuya yazıp tekrar kaydedin. Önceki kayıt güncellenir, toplanmaz.

---

### 5.3 Kalan Tatlılar

**Ne Zaman Kullanılır:** Günün sonunda, kapanış öncesi

**Nasıl Kullanılır:**
1. Ana menüden **"Kalan Tatlılar"**'a tıklayın.
2. Her tatlı için kutuda şu bilgilerden biri hazır gelir:
   - **📦 Gelen: X** — O gün teslim alındı, kalan girilmemiş
   - **📋 Önceki Kalan: X** — Dün kapanışta kalan miktar
3. Gerçekte kalan miktarı **kutuya yazın**.
4. Tamamen biten tatlılar için **0 yazın**.
5. **"Kaydet"** butonuna basın.

> ⚠️ **Önemli:** Hiç dokunmadan kalan **0 olan kutular** kaydedilmez. Eğer bir tatlı gerçekten 0 kaldıysa, 0 yazıp kaydedin.

**Satış Otomatik Hesaplanır:**
`Satılan = Gelen − Kalan`

---

### 5.4 Şubem (Aylık Rapor)

**Ne Gösterir:**

- **Bu Ay Gelen:** Ayın başından bugüne teslim alınan toplam
- **Bu Ay Satılan:** Hesaplanan satış toplamı
- **Şu An Kalan:** Güncel toplam stok (tüm tatlılar)

Alt kısımda tatlı bazında tablo:

| Tatlı | Gelen | Satılan | Kalan |
|-------|-------|---------|-------|
| Magnolya 🍮 | 120 | 114 | 6 |
| Cheesecake 🍰 | 80 | 76 | 4 |

**Ay Değiştirme:** `<` ve `>` butonlarıyla önceki aylara geçebilirsiniz.

---

### 5.5 Şube Arası Transfer

**Ne Zaman Kullanılır:** Bir şubede fazla tatlı var, başka şubede ihtiyaç varsa

**Nasıl Kullanılır:**
1. **"Şube Arası Transfer"**'e tıklayın.
2. **Tarih** seçin (bugün veya geçmiş).
3. **Alan Şube**'yi seçin (kendi şubenizden başkasına gönderebilirsiniz).
4. **Tatlı türünü** seçin.
5. **Miktarı** girin.
6. **"Transferi Kaydet"** butonuna basın.

**Sistem Ne Yapar:**
- Gönderen şubenin stoğu **azalır** (remaining_amount eksilir)
- Alan şubenin o güne ait **gelen miktarı artar**
- Transfer geçmişinde not olarak kayıt tutulur

**Transfer Geçmişi:** Sayfanın altında son transferler listelenir.

---

### 5.6 Müdürün Günlük Görevleri

**Sabah:**
- [ ] Tatlı teslimatı alındığında **"Gelen Tatlılar"**'ı doldurun
- [ ] Birden fazla teslimat varsa her seferinde güncelleyin

**Akşam (Kapanış):**
- [ ] **"Kalan Tatlılar"**'ı doldurun — her tatlı türü için gerçek kalan adedi girin
- [ ] Biten tatlılar için **0** yazın
- [ ] Kaydedin

**İhtiyaç Halinde:**
- [ ] Fazla stok varsa **Şube Arası Transfer** ile komşu şubeye gönderin
- [ ] Aylık performansı **"Şubem"** ekranından kontrol edin

---

## 6. Tatlıcı Paneli

**Kimler Kullanır:** Üretim/imalat ekibi (tatlıcılar)
**Sayfa:** `/tatlilar-panel.html`
**Erişim:** 4 haneli PIN (`0000`)

---

### 6.1 Panel Bölümleri

#### Güncel Stok Durumu (Üst Bölüm)
Tüm tatlı türleri için **toplam stok** (tüm şubeler birleşik):

```
Magnolya 🍮          Cheesecake 🍰
     42                    18
```

- Büyük ve okuması kolay rakamlar
- Sıfır stok kırmızımsı gösterilir

**Grand Total Bar:** Tüm tatlıların genel toplamı altın rengi çubukta.

#### Şube Bazlı Stok (Alt Bölüm)
Her şube için ayrı kart:

```
┌─────────────────────────────┐
│  🌊 Rumeli İskelesi   ──  12 │
│  Magnolya             6     │
│  Cheesecake           3     │
│  Kadayıf              3     │
└─────────────────────────────┘
```

---

### 6.2 Tatlıcının Görevleri

- Her sabah üretim planlamadan önce paneli kontrol edin
- **Düşük stoklu şubeleri** öncelikli üretin
- Sıfır stok görünen şubelere **acil sevkiyat** ayarlayın
- **Yenile** butonuna basarak verileri güncelleyin
- Panel her **60 saniyede** otomatik yenilenir

---

## 7. Üretim Paneli

**Kimler Kullanır:** Sevkiyat, dağıtım, üretim ekibi — **şifresiz erişim**
**Sayfa:** `/uretim.html`

---

### 7.1 Panel İçeriği

#### Özet Chips (Üst)
Stok durumlarını hızlıca gösteren renkli etiketler:
- 🟢 **Yeterli** (4+)
- 🟡 **Az** (1–3)
- 🔴 **Tükendi** (0)

#### Şube Stok Kartları
Her şube için ayrı kart — o şubedeki tüm tatlıların güncel stoğu.

#### Matris Tablosu
Tüm şubeleri ve tatlıları **çapraz tabloda** gösterir:

|  | Rumeli | Yahya Kemal | Vagon | Sahil | TunaBoyu | Millet | TOPLAM |
|--|--------|-------------|-------|-------|----------|--------|--------|
| Magnolya | 6 | 3 | 8 | 2 | 4 | 6 | **29** |
| Cheesecake | 3 | 1 | 5 | 0 | 2 | 4 | **15** |
| **TOPLAM** | **9** | **4** | **13** | **2** | **6** | **10** | **44** |

- Renk kodlaması: yeşil (4+), sarı (1–3), gri (0)
- Panel her **5 dakikada** otomatik yenilenir

---

## 8. Günlük İş Akışı

### Sabah (Teslimat Sonrası)

```
Tatlıcı üretir → Teslimat yapılır → Müdür "Gelen Tatlılar"'ı doldurur
```

1. Tatlıcı sabah stoğu kontrol eder (**Tatlıcı Paneli**)
2. Üretim tamamlanır ve şubelere dağıtım yapılır
3. Her şube müdürü teslim aldığı miktarı **"Gelen Tatlılar"** ekranına girer
4. Tatlıcı/dağıtım ekibi **Üretim Paneli**'nden teslimatın yansıdığını doğrular

---

### Gün İçi (İhtiyaç Halinde)

```
Şube A fazla → Transfer → Şube B'ye gönderilir
```

- Müdür **"Şube Arası Transfer"** ile stok düzenler
- Yönetici **Admin Paneli**'nden anlık durumu izler

---

### Akşam (Kapanış)

```
Müdür sayar → "Kalan Tatlılar"'ı girer → Yönetici raporu kontrol eder
```

1. Şube müdürü gün sonu stoğu sayar
2. **"Kalan Tatlılar"** ekranına gerçek kalan adedi girer
3. Sistem satışı otomatik hesaplar (Gelen − Kalan)
4. Yönetici Admin Paneli'nden günlük satış raporunu inceler

---

## 9. Şubeler ve Sorumluları

| Şube | Emoji | Müdür |
|------|-------|-------|
| Rumeli İskelesi | 🌊 | Metehan Arslan |
| Yahya Kemal | 📚 | Berkay Nazlıgül |
| Vagon | 🚂 | Baturay Cimpiri |
| Sahil | 🏖️ | Bahtiyar Kurt |
| TunaBoyu | 🌿 | Semra Polat |
| Millet Bahçesi | 🌸 | Melis Boyalık |

---

## 10. Sık Sorulan Sorular

**S: Yanlış miktarı girdim, düzeltebilir miyim?**
C: Evet. Aynı ekrana geri gidin, doğru miktarı yazın ve tekrar kaydedin. Sistem günceller, ikinci bir kayıt oluşturmaz.

**S: Dünkü veriyi unutup girmedim, geç girebilir miyim?**
C: Evet. Tarih gezginindeki `<` okunu kullanarak önceki tarihe geçin ve veriyi girin.

**S: Kalan tatlılar ekranında tatlı görünmüyor.**
C: Daha önce "Gelen Tatlılar" girilmemiş olabilir. Ya da o tatlıya ait geçmiş kayıt yoktur. Gelen sıfır da olsa miktarı girin, sistem önceki stoğu gösterecektir.

**S: Transfer yaptım ama alan şubede görünmüyor.**
C: Alan şubenin müdürü o gün "Gelen Tatlılar"'ı açtığında transfer miktarı dahil edilmiş olacak. Üretim Paneli'nden de doğrulayabilirsiniz.

**S: Şifremi unuttum.**
C: Yöneticiye başvurun. Şifre değişikliği yönetici tarafından yapılabilir.

**S: "Şu An Kalan 0" gözüküyor ama şubede tatlı var.**
C: "Kalan Tatlılar" ekranından o günün kapanış stoğu girilmemiş demektir. Müdürden girmesini isteyin.

**S: Tatlı türü listede yok ama satıyoruz.**
C: Sisteme yeni tatlı eklenmesi gerekiyor. Yöneticiye bildirin; admin panelinden eklenebilir.

---

*Bu kılavuz Tatli-Imalat-Dagitim sistemi için hazırlanmıştır.*
