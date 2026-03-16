# Tatlı İmalat ve Dağıtım Takip Sistemi — Kullanım Kılavuzu

> **Sürüm:** 2.1 — Mart 2026
> **Hazırlayan:** Mutlukent Tatlı
> **Platform:** Web tabanlı PWA (Progressive Web App) — mobil ve masaüstü uyumlu

---

## İçindekiler

1. [Genel Bakış](#1-genel-bakış)
2. [Kullanıcı Rolleri ve Erişim Seviyeleri](#2-kullanıcı-rolleri-ve-erişim-seviyeleri)
3. [Giriş Ekranı](#3-giriş-ekranı)
4. [Müdür Paneli](#4-müdür-paneli)
5. [Şubem — Müdür İstatistik Sayfası](#5-şubem--müdür-i̇statistik-sayfası)
6. [Tatlıcılar Paneli](#6-tatlıcılar-paneli)
7. [Dağıtım Paneli](#7-dağıtım-paneli)
8. [Yönetici Paneli (Admin Dashboard)](#8-yönetici-paneli-admin-dashboard)
9. [Sistem Yönetimi (Süper Admin)](#9-sistem-yönetimi-süper-admin)
10. [Günlük İş Akışı](#10-günlük-iş-akışı)
11. [Şubeler](#11-şubeler)
12. [Sık Sorulan Sorular](#12-sık-sorulan-sorular)

---

## 1. Genel Bakış

**Tatlı Takip Sistemi**, Mutlukent Tatlı'nın üretim merkezi ile 6 satış şubesi arasındaki tatlı hareketlerini anlık olarak izleyen, bulut tabanlı bir takip platformudur.

### Temel Özellikler

| Özellik | Açıklama |
|---------|----------|
| **Anlık Senkronizasyon** | Tüm değişiklikler saniyeler içinde tüm cihazlara yansır |
| **Çoklu Rol** | 5 farklı kullanıcı tipi, her birinin kendine ait ekranı |
| **Şube Bazlı Takip** | Her şubenin gelen, kalan ve zayiat verileri ayrı tutulur |
| **Satış Formülü** | Satılan = Gelen − Kalan − Zayiat otomatik hesaplanır |
| **Dağıtım Planlama** | Hangi şubeye ne kadar gönderileceği renk kodlu tabloyla gösterilir |
| **Elde Edilen Gelir** | Satılan adet × fiyat üzerinden gerçek gelir hesabı |
| **Aylık Karşılaştırma** | Önceki ayın verileriyle anlık KPI karşılaştırması |
| **WhatsApp Raporu** | Günlük özet raporu tek tıkla WhatsApp'ta paylaşılabilir |
| **PWA Desteği** | Telefona uygulama gibi kurulabilir, önceki veriler çevrimdışı görünür |

### Temel Satış Formülü

```
SATILAN = GELEN − KALAN − ZAYİAT
```

- **Gelen:** Üretimden şubeye ulaşan tatlı adedi
- **Kalan:** Günün sonunda rafta kalan tatlı adedi
- **Zayiat:** Bozulan, düşen veya fire olan tatlı adedi
- **Satılan:** Sistem otomatik hesaplar — manuel giriş gerekmez

### Sistem Mimarisi

```
[Üretim Merkezi]
       ↓  Tatlı üretilir ve paketlenir
[Tatlıcılar Paneli] → Tüm şubelerin kalan stoğu izlenir
       ↓
[Dağıtım Paneli] → Renk kodlu tabloyla hangi şubeye ne kadar gidileceği planlanır
       ↓
[Müdür Paneli] → Şube müdürü gelen tatlıları teslim alır (Gelen Tatlılar)
       ↓
[Kalan Tatlılar + Zayiat] → Satış sonrası kalan ve fire miktarı girilir
       ↓
[Yönetici Paneli] → Tüm şubelerin verileri analiz edilir, raporlar paylaşılır
```

![Tatlı Takip Sistemi İş Akışı](Tatlı%20Takip%20Sistemi%20İş%20Akışı.png)

![Tatlı Takip Sistemi Ekosistem](Tatlı%20Takip%20Sistemi%20İş%20Akışı%202.png)

---

## 2. Kullanıcı Rolleri ve Erişim Seviyeleri

Sistemde **5 temel rol** bulunmaktadır. Her rol farklı bir PIN ile korunmaktadır.

| Rol | Kimler Kullanır | Varsayılan PIN | Erişebildiği Ekranlar |
|-----|----------------|---------------|----------------------|
| **Müdür** | Şube müdürleri | Şubeye özel | Gelen Tatlılar, Kalan Tatlılar, Transfer, Zayiat, Şubem |
| **Tatlıcılar** | Üretim personeli | `0000` | Tatlıcılar Paneli (üretim stok kartları) |
| **Dağıtım** | Dağıtım şoförü / sorumlusu | `1234` | Dağıtım Paneli (stok + plan tablosu) |
| **Yönetici** | İşletme sahibi / üst yönetim | Gizli | Admin Dashboard (tüm raporlar ve analizler) |
| **Süper Admin** | Sistem yöneticisi | `9999` | Sistem Yönetimi (tüm ayarlar, PIN değişikliği) |

> **Not:** Tüm PIN'ler Süper Admin tarafından Sistem Yönetimi → PIN Yönetimi ekranından değiştirilebilir. Değişiklikler tüm cihazlara anında yansır.

---

## 3. Giriş Ekranı

![Giriş Paneli](Giriş%20Paneli.png)

Uygulama açıldığında **Rol Seçim Ekranı** görüntülenir.

### Giriş Yöntemi

1. **Müdür Girişi** (en üstte, büyük buton): Şube müdürleri için. Butona tıklandığında şube seçimi, ardından PIN ekranı gelir.

2. **İkinci Sıra (yan yana iki buton):**
   - **Dağıtım**: Dağıtım sorumlusu girişi. PIN ekranı açılır.
   - **Tatlıcılar**: Üretim personeli girişi. PIN ekranı açılır.

3. **Yönetici** (en altta, soluk/gizli görünüm): İşletme sahibi girişi. Admin Dashboard'a erişim sağlar.

### Otomatik PIN Girişi

Tüm PIN ekranlarında **4. rakam girildiği anda** sistem PIN'i otomatik doğrular — ayrıca "Giriş" butonuna basmaya gerek yoktur. Yanlış PIN girilirse ekran sarsılarak kullanıcıya bildirilir.

> **Tasarım Notu:** Yönetici butonu kasıtlı olarak soluk ve küçük tutulmuştur. Hassas verilere erişimi vurgusuz hale getirmek için bu şekilde tasarlanmıştır.

---

## 4. Müdür Paneli

### 4.1 Şube Seçimi ve PIN Girişi

![Şube Seçimi](Şube%20Seçimi.png)

![Şube Seçim Pin girişi](Şube%20Seçim%20Pin%20girişi.png)

Müdür Girişi'ne tıklandığında:

1. **Şube Listesi** görüntülenir — müdür kendi şubesini seçer
2. **PIN Ekranı** açılır — 4 haneli PIN rakamlarla girilir
3. 4. rakam girildiği anda doğrulama otomatik yapılır
4. Doğrulama başarılıysa **Müdür Menüsü** açılır

> Her şubenin PIN'i birbirinden farklı olabilir. PIN'ler Süper Admin tarafından belirlenir.

### 4.2 Müdür Menüsü

![Müdür Paneli](Müdür%20Paneli.png)

Müdür Paneli 4 ana karttan oluşur:

| Kart | Renk | İşlev |
|------|------|--------|
| **Gelen Tatlılar** | Amber/Sarı | Üretimden gelen tatlıların teslim alınması |
| **Kalan Tatlılar** | Mavi | Günün sonunda kalan tatlı sayılarının girilmesi |
| **Şube Arası Transfer** | Mor | Başka şubeden tatlı talep etmek veya göndermek |
| **Zayiat Girişi** | Kırmızı | Bozulan / fire olan tatlıların kaydedilmesi |

**Şubem Linki:** Ekranın üst kısmındaki şube adı veya avatar ikonuna tıklandığında **Şubem** sayfası açılır — şubenin kendi istatistikleri ve aylık performansı burada görüntülenir.

### 4.3 Gelen Tatlılar

![Gelen Tatlılar](Gelen%20Tatlılar.png)

- Her tatlı türü için **adet giriş kutusu** bulunur
- Üretim merkezinden gelen miktarlar sabah buraya girilir
- **Tarih Gezgini:** Sağ/sol oklarla geçmiş günlere bakılabilir ve düzeltme yapılabilir
- **Kaydet** butonuna basıldığında veri Supabase'e kaydedilir ve tüm cihazlara yansır

> **Önemli:** Gelen tatlı miktarı kaydedildikten sonra düzenlemek için aynı tarihe gidip değeri değiştirip tekrar kaydetmek yeterlidir. Sistem mevcut kaydı günceller, yeni kayıt oluşturmaz.

### 4.4 Kalan Tatlılar

![Kalan Tatlılar](Kalan%20Tatlılar.png)

- Günün sonunda şubede rafta kalan tatlı sayıları girilir
- Sistem otomatik olarak **Satılan = Gelen − Kalan − Zayiat** formülüyle hesaplar
- Kalan miktarlar, Tatlıcılar Paneli ve Yönetici Dashboard'unda görüntülenir

### 4.5 Müdür Paneli Kullanım Rehberi (Adım Adım)

![Müdür Paneli Nasıl Kullanılır](Müdür%20Paneli%20Nasıl%20Kullanılır.png)

**Sabah Rutini:**
1. Gelen Tatlılar'a gir → Üretimden gelen adetleri gir → Kaydet
2. Şubem sayfasından günlük durumu kontrol et

**Akşam Rutini:**
1. Kalan Tatlılar'a gir → Rafta kalan adetleri gir → Kaydet
2. Varsa Zayiat Girişi'ne gir → Fire/bozuk ürünleri kaydet → Kaydet

### 4.6 Şube Arası Transfer

![Şube Arası Transfer](Şube%20Arası%20Transfer.png)

- **Kaynak Şube:** Tatlıyı gönderen şube
- **Hedef Şube:** Tatlıyı alan şube
- Transfer onaylandığında kaynak şubenin stoğu düşer, hedef şubenin stoğu artar
- İki şube müdürü de kendi panellerinden transferi görebilir

### 4.7 Zayiat Girişi

![Zayiat Girişi](Zayiat%20Girişi.png)

- Bozulan, düşen veya fire olan tatlılar buraya kaydedilir
- Tatlı türü bazında miktar girilir
- Zayiat miktarı kaydedildiğinde Yönetici Paneli raporlarına yansır
- Gerçek satış hesabı: **Satılan = Gelen − Kalan − Zayiat**

---

## 5. Şubem — Müdür İstatistik Sayfası

**Şubem** sayfası, müdürün kendi şubesinin günlük ve aylık performansını takip ettiği kişisel paneldir. Müdür Menüsü'ndeki şube avatarına veya adına tıklanarak açılır.

![Şubem İstatistikler](Şubem%20istatistikler.png)

### 5.1 Gösterilen Veriler

| Veri | Açıklama |
|------|----------|
| **Gelen** | Seçilen dönemde üretimden gelen toplam tatlı adedi |
| **Kalan** | Dönem sonu rafta kalan toplam tatlı adedi |
| **Zayiat** | Dönemde kaydedilen toplam fire/bozuk ürün adedi |
| **Satılan** | Gelen − Kalan − Zayiat formülüyle hesaplanan satış adedi |

### 5.2 Dönem Seçimi

- **Bugün / Bu Hafta / Bu Ay** sekmeleriyle hızlıca filtreleme yapılabilir
- Şubeye ait veriler sadece o şubenin müdürüne görünür

### 5.3 Veri Yoksa Ne Olur?

Gelen ve kalan veriler 0 olsa bile zayiat girişi yapılmışsa sayfa "Veri yok" hatası vermez; zayiat kaydı otomatik olarak gösterilir.

---

## 6. Tatlıcılar Paneli

![Tatlıcılar Paneli Güncel Stok durumu](Tatlıcılar%20Paneli%20Güncel%20Stok%20durumu.png)

Tatlıcılar Paneli, üretim merkezinde çalışan personelin tüm şubelerin stok durumunu izlediği ekrandır. PIN: `0000` (değiştirilebilir).

### 6.1 Güncel Stok Özeti

Sayfanın üst kısmında **tüm şubelerin toplam stoğu** özet olarak gösterilir:

- Her tatlı türü için toplam kalan adet (tüm şubeler toplamı)
- Genel toplam (tüm tatlılar, tüm şubeler)
- Renkli gösterge: **Yeşil** = yeterli stok, **Sarı** = az stok, **Kırmızı** = kritik seviye

### 6.2 Şube Bazlı Stok Kartları (Açılır/Kapanır)

![Tatlıcılar Paneli Şube bazlı Stok durumu](Tatlıcılar%20Paneli%20Şube%20bazlı%20Stok%20durumu.png)

Her şube için **ayrı bir kart** bulunur. Bu kartlar **açılır/kapanır** yapıdadır:

| Cihaz | Kartların Başlangıç Durumu |
|-------|--------------------------|
| Telefon (mobil) | Kapalı — tatlıcı istediği şubeye tıklar |
| Masaüstü / Tablet | Açık — tüm detaylar otomatik görünür |

**Kart içeriği:**
- Tatlı adı + o şubede kalan adet
- Eşik altındaki tatlılar kırmızı veya turuncu ile işaretlenir
- Şubenin toplam stok sayısı

> **Neden bu tasarım?** Mobil ekranlarda 6 şubenin tüm detaylarını aynı anda göstermek fazla yer kaplar. Açılır/kapanır yapı sayesinde tatlıcı sadece ilgilendiği şubenin bilgisine hızlıca ulaşır.

---

## 7. Dağıtım Paneli

![Dağıtım Paneli](Dağıtım%20Paneli.png)

Dağıtım Paneli, dağıtım sorumlusunun hangi şubeye ne kadar tatlı götüreceğini planlamasına yardımcı olur. PIN: `1234` (değiştirilebilir).

### 7.1 Güncel Stok Durumu

Sayfanın üst bölümünde **tüm şubelerin anlık stok özeti** bulunur. Tatlıcılar Paneli'ndeki özet bölümüyle aynıdır:
- Tatlı türü bazında toplam stoklar
- Genel toplam

### 7.2 Şube Bazlı Stok Detayı (Açılır/Kapanır)

![Dağıtım Planı Şube bazlı stok](Dağıtım%20Planı%20Şube%20bazlı%20stok.png)

Tatlıcılar Paneli ile aynı açılır/kapanır kart yapısı:
- Mobilde başta KAPALI, masaüstünde AÇIK
- Şube başlığına tıklayarak her şubenin detay stoğu görüntülenir

### 7.3 Dağıtım Planı Tablosu

![Dağıtım Planı](Dağıtım%20Planı.png)

Bu bölüm Dağıtım Paneli'nin en kritik özelliğidir.

**Tablo Yapısı:**
- **Satırlar:** Her şube (6 şube)
- **Sütunlar:** Her tatlı türü
- **Hücre Değeri:** O şubeye kaç adet teslim edilmeli?

**Renk Kodlaması:**

| Renk | Anlam | Stok Durumu |
|------|-------|-------------|
| 🔴 Kırmızı | Kritik — Acil götür | Stok = 0 |
| 🟠 Turuncu | Az — Tamamla | 0 < Stok < Eşik Değeri |
| ⬜ Gri (—) | Yeterli | Stok ≥ Eşik Değeri |

**Eşik Değerleri:** Her şube için minimum stok eşiği Sistem Yönetimi'nden ayarlanır. Eşiğin altındaki şubelere dağıtımda öncelik verilir.

**Yazdırma:** "Yazdır" butonu ile dağıtım planı kağıda çıktı alınabilir. Baskıda sadece plan tablosu görünür.

---

## 8. Yönetici Paneli (Admin Dashboard)

![Yönetici Girişi](Yönetici%20Girişi.png)

![Yönetici Paneli](Yönetici%20Paneli.png)

Yönetici Paneli, işletme sahibinin tüm şubelerin performansını tek ekrandan izleyebildiği analiz merkezidir. Giriş ekranındaki "Yönetici" butonuyla erişilir.

### 8.1 Zaman Filtresi ve Ay Navigasyonu

Panelin üstündeki filtre sekmeleriyle veriler dönemsel olarak incelenir:

| Filtre | Açıklama |
|--------|----------|
| **Bugün** | Sadece bugünkü veriler |
| **Bu Hafta** | Pazartesiden itibaren |
| **Bu Ay** | Seçilen ayın 1'inden son gününe kadar |

**Ay Navigasyonu:** "Bu Ay" sekmesinin yanındaki **‹** ve **›** okları ile geçmiş aylara gidilir. Örneğin Şubat 2026 verisini görmek için ‹ butonuna tıklanır. Başlık otomatik olarak "Şubat 2026" olarak güncellenir.

> Ay navigasyonu sayesinde geçmiş aylara ait zayiat, satış ve stok verileri kolayca incelenebilir.

### 8.2 KPI Özet Kartları

Ana ekranda 4 adet **Anahtar Performans Göstergesi (KPI)** kartı bulunur:

| KPI Kartı | Gösterdiği Veri |
|-----------|----------------|
| **Toplam Dağıtım** | Seçilen dönemde şubelere gönderilen toplam tatlı adedi |
| **Tahmini Satış** | Gelen − Kalan − Zayiat formülüyle hesaplanan satış adedi |
| **Toplam Zayiat** | Seçilen dönemde kaydedilen toplam fire/bozuk tatlı adedi |
| **Aktif Şube** | Veri girişi yapılmış aktif şube sayısı |

### 8.3 Önceki Ay Karşılaştırması (KPI Altı)

Her KPI kartının altında **önceki ayla karşılaştırma** göstergesi bulunur:

- **▲ %15 önceki aya göre** → Yeşil renk, artış var
- **▼ %8 önceki aya göre** → Kırmızı renk, düşüş var
- **→ Değişim yok** → Gri renk, eşit

> Karşılaştırma yalnızca "Bu Ay" filtresi aktifken gösterilir. Diğer filtrelerde gösterge gizlenir.

### 8.4 En İyi Şube Banner'ı

Şube Performansı panelinin üstünde, o dönem en yüksek satış yüzdesine sahip şube **🥇 altın banner** ile öne çıkarılır:

```
🥇 En İyi Şube: Rumeli İskelesi — %87 satış oranı
```

Banner, veriler her yenilendiğinde güncellenir.

### 8.5 Günlük Özet Raporu ve WhatsApp Paylaşımı

Panelin üst çubuğundaki **📤 Rapor** butonuyla günlük özet raporu oluşturulur.

**Rapor İçeriği:**
```
📊 MUTLUKENT TATLI — GÜNLÜK RAPOR
📅 16 Mart 2026 | Bu Ay

🍰 Dağıtım: 245 adet
💰 Satış: 198 adet
⚠️ Zayiat: 12 adet (%4,9)

🏪 Şube Performansları:
  🥇 Rumeli İskelesi — %87
  🥈 Vagon — %82
  🥉 Millet Bahçesi — %79
  4. Yahya Kemal — %74
  5. TunaBoyu — %68
  6. Sahil — %61
```

**Paylaşım Seçenekleri:**
- **WhatsApp ile Paylaş:** Rapor metin olarak WhatsApp'a aktarılır, kişi veya grup seçilerek gönderilebilir
- **📋 Kopyala:** Rapor panoya kopyalanır, istenen herhangi bir uygulamaya yapıştırılabilir

### 8.6 Şube Performansı — Mobil Kart Görünümü

![Şube Kartları Rozetleri](Şube%20kartları%20rozetleri.jpeg)

Telefon ekranlarında şube performans tablosu yerine **tam ekran renkli kartlar** gösterilir:

**Kart Yapısı:**
- 🥇 1. sıra → Altın kart
- 🥈 2. sıra → Gümüş kart
- 🥉 3. sıra → Bronz kart
- 4-6. sıra → Standart kart

**Her Kart İçeriği:**
- Şube adı ve sırası
- Gelen / Satılan / Zayiat adetleri
- Satış yüzdesi (görsel çubuk gösterge)

> Masaüstü bilgisayarlarda tablo görünümü, telefonda kart görünümü otomatik olarak aktif olur.

### 8.7 Güncel Stok ve Satış Trendi

![Yönetici Paneli Güncel Stok ve Satış trendi](Yönetici%20Paneli%20Güncel%20Stok%20ve%20Satış%20trendi.png)

- Tatlı türü bazında **son 7 günün satış grafiği**
- Hangi tatlının ne kadar sattığı trend olarak gösterilir
- Şube bazlı kırılım: hangi şube daha fazla satıyor?
- Grafik üzerindeki noktalar günlük verileri gösterir

### 8.8 Zayiat Raporu (Modern İki Sütun Tasarım)

![Yönetici Paneli Zayiat ve ciro tahmin](Yönetici%20Paneli%20Zayiat%20ve%20ciro%20tahmin.png)

Zayiat Raporu iki sütunlu modern bir düzende sunulur:

**Sol Sütun — Şube Bazlı Zayiat:**
- Her şube sıralı listede gösterilir (en fazla zayiattan en aza)
- Zayiat adedi ve yüzdesi (Zayiat / Gelen × 100) gösterilir
- Renk kodlu gösterge: yüksek oran kırmızı, orta turuncu, düşük yeşil
- Örnek: `🏪 Rumeli İskelesi — 8 adet (%3,2)`

**Sağ Sütun — Tatlı Bazlı Zayiat:**
- Her tatlı türü sıralı listede gösterilir (en fazla zayiattan en aza)
- Tatlı bazında toplam fire adedi ve oranı
- Örnek: `🍰 Baklava — 15 adet (%5,1)`

> Hangi şubede ve hangi tatlıda fire fazla olduğu tek bakışta anlaşılır.

### 8.9 Elde Edilen Gelir Paneli

**Elde Edilen Gelir** paneli, gerçek satışa dayalı gelir hesabını gösterir:

![Elde Edilen Gelir](Elde%20edilen%20Gelir.png)

**Formül:**
```
Elde Edilen Gelir = Satılan Adet × Tatlı Birim Fiyatı
```

**Görünüm:**
- **Hero bölümü (üst):** Dönemin toplam geliri büyük font ile gösterilir
  ```
  💰 Toplam Elde Edilen Gelir
     ₺ 18.450
     312 adet tatlı satıldı
  ```
- **Bar listesi (alt):** Her tatlı türü kendi geliriyle sıralı listelenir
  - Tatlı adı + satış adedi + gelir miktarı
  - Görsel bar: maksimum gelire göre oransal genişlik

> **Not:** Tatlı birim fiyatları Sistem Yönetimi → Tatlı Fiyatları sekmesinden güncellenir.

---

## 9. Sistem Yönetimi (Süper Admin)

![Sistem Yönetimi Paneli](Sistem%20Yönetimi%20Paneli.png)

Sistem Yönetimi, uygulamanın tüm ayarlarının yapıldığı merkezi yapılandırma ekranıdır. PIN: `9999`.

> **Uyarı:** Bu ekrandaki değişiklikler anında tüm kullanıcılara yansır. Dikkatli kullanın.

### 9.1 Sekme Yapısı

| Sekme | İşlev |
|-------|--------|
| **Müdürler** | Şube aktif / pasif durumu yönetimi |
| **Tatlılar** | Aktif tatlı listesi yönetimi |
| **Eşikler** | Şube bazlı minimum stok eşik değerleri |
| **Tatlı Fiyatları** | Gelir hesabında kullanılan birim fiyatlar |
| **PIN Yönetimi** | Tüm rol ve şube PIN'lerini değiştir |

### 9.2 Müdürler Sekmesi

![Sistem Yönetimi Müdürler](Sistem%20Yönetimi%20Müdürler.png)

- Her şube için **Aktif / Pasif** toggle düğmesi
- Pasif şubeler giriş listesinde görünmez, veri girişi yapılamaz
- Geçici olarak kapalı olan şubeler buradan pasife alınır

### 9.3 Tatlılar Sekmesi

![Sistem Yönetimi Tatlılar](Sistem%20Yönetimi%20Tatlılar.png)

- Sistemdeki tüm tatlı türleri listelenir
- Her tatlı Aktif / Pasif yapılabilir
- Pasif tatlılar giriş formlarında görünmez (mevsimlik ürünler için kullanışlı)

### 9.4 Eşikler Sekmesi

![Sistem Yönetimi Eşikler](Sistem%20Yönetimi%20Eşikler.png)

- Her şube için her tatlıda **minimum stok eşiği** belirlenir
- Örnek: Rumeli İskelesi şubesi için Baklava eşiği = 8
- Bu eşikler Dağıtım Paneli'nde renk kodlamasını belirler:
  - Stok < Eşik → 🟠 Turuncu (az stok)
  - Stok = 0 → 🔴 Kırmızı (kritik)
  - Stok ≥ Eşik → ⬜ Gri (yeterli)

### 9.5 Tatlı Fiyatları Sekmesi

![Sistem Yönetimi Tatlı fiyatları](Sistem%20Yönetimi%20Tatlı%20fiyatları.png)

- Her tatlı türü için **birim satış fiyatı (TL)** girilir
- Bu fiyatlar Yönetici Dashboard'undaki **Elde Edilen Gelir** hesabında kullanılır
- Fiyat değişikliği anında tüm gelir hesaplamalarına yansır

### 9.6 PIN Yönetimi Sekmesi

![Sistem Yönetimi Pin yönetimi](Sistem%20Yönetimi%20Pin%20yönetimi.png)

Tüm rol PIN'leri bu sekmeden yönetilir:

| Alan | Açıklama |
|------|----------|
| Süper Admin PIN | Sistem Yönetimi ekranı için |
| Yönetici PIN | Admin Dashboard için |
| Tatlıcılar PIN | Tatlıcılar Paneli için |
| Dağıtım PIN | Dağıtım Paneli için |
| Şube PIN'leri | Her şube için ayrı PIN (6 adet) |

- PIN değişikliği Supabase bulut veritabanına kaydedilir
- Tüm cihazlar otomatik olarak yeni PIN'i kullanmaya başlar
- PIN'ler 4 haneli sayıdan oluşmalıdır

---

## 10. Günlük İş Akışı

Tipik bir iş günündeki veri akışı ve roller:

### Sabah — Dağıtım Öncesi

1. **Tatlıcılar** → Tatlıcılar Paneli açılır
   - Tüm şubelerin kalan stoğu kontrol edilir
   - Hangi şubede hangi tatlı az? Açılır kartlarla şube şube incelenir
   - Üretim miktarı buna göre belirlenir

2. **Dağıtım Sorumlusu** → Dağıtım Paneli açılır
   - Dağıtım Planı tablosuna bakılır
   - 🔴 Kırmızı = Acil, 🟠 Turuncu = Tamamla
   - Gerekirse dağıtım planı yazdırılır

### Sabah — Dağıtım Sonrası

3. **Şube Müdürleri** → Gelen Tatlılar
   - Teslim alınan tatlı adetleri tatlı tatlı girilir → Kaydet

### Akşam — Satış Sonrası

4. **Şube Müdürleri** → Kalan Tatlılar
   - Rafta kalan tatlı adetleri girilir → Kaydet

5. **Şube Müdürleri** → Zayiat Girişi (varsa)
   - Bozulan / fire tatlılar girilir → Kaydet

### Gece — Analiz ve Raporlama

6. **Yönetici** → Admin Dashboard
   - Ay filtresi ile dönem seçilir
   - KPI kartlarından genel özet görülür
   - Önceki ayla karşılaştırma incelenir
   - En iyi şube banner'ından günün performansı değerlendirilir
   - Zayiat raporu ile hangi şube/tatlıda fire fazla olduğu tespit edilir
   - Elde Edilen Gelir panelinden dönem geliri hesaplanır
   - **📤 Rapor** butonuyla günlük özet WhatsApp üzerinden ekiple paylaşılır

---

## 11. Şubeler

Sistemde tanımlı **6 aktif şube** bulunmaktadır:

| Şube Adı | Varsayılan Eşik |
|----------|----------------|
| Rumeli İskelesi | 8 (en yüksek hacimli şube) |
| Yahya Kemal | 5 |
| TunaBoyu | 5 |
| Sahil | 5 |
| Vagon | 6 |
| Millet Bahçesi | 6 |

> Şube eşik değerleri Sistem Yönetimi → Eşikler sekmesinden her tatlı için ayrı ayrı güncellenebilir.

---

## 12. Sık Sorulan Sorular

**S: Yaptığım değişiklik diğer cihazlarda görünmüyor?**
C: Sayfayı yenileyin (pull-to-refresh veya F5). Tüm veriler Supabase bulut veritabanında tutulduğu için yenileme sonrası tüm cihazlar güncellenir.

**S: PIN'imi unuttum?**
C: Sistem Yönetimi ekranına (9999 ile) girin → PIN Yönetimi sekmesinden sıfırlayın. Süper Admin PIN'i de unutulursa sistem yöneticisine başvurun.

**S: Eski bir günün verisini düzeltmek istiyorum?**
C: Tarih Gezgini ile o tarihe gidip değeri değiştirip tekrar kaydedin. Sistem mevcut kaydı günceller, yeni kayıt oluşturmaz.

**S: Zayiat girişi yaptım ama Şubem'de görünmüyor?**
C: Sayfayı yenileyin. Şubem sayfası, gelen ve kalan 0 olsa bile zayiat kaydı varsa bunu gösterecek şekilde güncellenmiştir.

**S: Geçen ayki verilere nasıl bakabilirim?**
C: Yönetici Paneli'nde "Bu Ay" sekmesini seçin, ardından **‹** okuna tıklayarak önceki aya geçin. Başlık "Şubat 2026" gibi güncellenir.

**S: Yeni tatlı türü eklemek istiyorum?**
C: Sistem Yönetimi → Tatlılar sekmesinden mevcut tatlılar yönetilebilir. Yeni tatlı ekleme için sistem yöneticisine başvurun (veritabanı değişikliği gerektirebilir).

**S: Şube PIN'ini kim belirleyebilir?**
C: Yalnızca Süper Admin (PIN: 9999) belirleyebilir. PIN Yönetimi sekmesinden her şubenin PIN'i ayrı ayrı ayarlanır.

**S: Uygulama telefona nasıl kurulur?**
C: Tarayıcıda siteyi açın → Tarayıcı menüsü → "Ana ekrana ekle" seçeneğini kullanın. Uygulama artık telefonda baklava ikonuyla görünür.

**S: İnternet olmadan çalışır mı?**
C: PWA (Service Worker) sayesinde son görüntülenen veriler önbellekte tutulur. Ancak yeni veri kaydetmek veya güncel veri görmek için internet bağlantısı gereklidir.

**S: Dağıtım planı tablosunu kağıda nasıl çıktı alırım?**
C: Dağıtım Paneli'nde "Yazdır" butonuna basın. Sadece plan tablosu çıktıya alınır.

**S: WhatsApp raporu nasıl gönderilir?**
C: Yönetici Paneli'nde üst çubuktaki **📤 Rapor** butonuna basın → açılan pencerede "WhatsApp ile Paylaş" butonuna tıklayın → WhatsApp açılır, kişi veya grup seçerek raporu gönderin.

---

## Sistem Teknik Bilgileri

| Özellik | Detay |
|---------|-------|
| **Platform** | Progressive Web App (PWA) |
| **Veritabanı** | Supabase (PostgreSQL tabanlı, bulut) |
| **Çevrimdışı Destek** | Service Worker ile önbellek (Cache-first strateji) |
| **Cihaz Uyumluluğu** | Telefon, tablet, masaüstü — tüm modern tarayıcılar |
| **Otomatik Güncelleme** | Yeni sürüm çıktığında kullanıcı yenilediğinde otomatik yüklenir |
| **Veri Güvenliği** | PIN tabanlı rol erişimi, tüm veriler şifreli bulut bağlantısıyla aktarılır |

---

*Tatlı Takip Sistemi v2.1 — © 2026 Mutlukent Tatlı*
