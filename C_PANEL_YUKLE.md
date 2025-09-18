# C Panel'e Yükleme Talimatları - Full Client-Side

## ✅ Build Tamamlandı!

Projeniz tamamen **client-side** olarak C panel için başarıyla build edildi. `out` klasöründe tüm static dosyalarınız hazır durumda.

## 🎯 Özellikler

### ✅ Tamamen Client-Side
- **Server-side kod yok** - Sadece HTML, CSS, JavaScript
- **API çağrıları client-side** - Browser'da fetch ile yapılıyor
- **Fallback mock data** - API erişilemezse mock data kullanılıyor
- **Static hosting uyumlu** - Herhangi bir static hosting'de çalışır

## 📋 Yükleme Adımları

### 1. Build Dosyalarını Hazırlayın
```bash
# Build işlemi tamamlandı, out klasörü hazır
ls out/  # Dosyaları kontrol edin
```

### 2. C Panel'e Yükleme

#### Yöntem A: File Manager ile
1. C Panel'e giriş yapın
2. **File Manager**'ı açın
3. `public_html` klasörüne gidin
4. `out` klasöründeki **TÜM** dosyaları `public_html` klasörüne yükleyin
   - `_next` klasörü
   - `courses` klasörü
   - `img` klasörü
   - `index.html`
   - `404.html`
   - Diğer tüm dosyalar

#### Yöntem B: FTP ile
1. FTP istemcinizi açın (FileZilla, WinSCP vb.)
2. C Panel FTP bilgilerinizle bağlanın
3. `public_html` klasörüne gidin
4. `out` klasöründeki tüm içeriği yükleyin

### 3. Dosya Yapısı Kontrolü
Yükleme sonrası `public_html` klasörünüzde şu yapı olmalı:
```
public_html/
├── _next/
├── courses/
├── img/
├── index.html
├── 404.html
├── favicon.ico
└── diğer dosyalar...
```

## 🌐 Domain Ayarları

### Ana Domain
- Dosyalar doğrudan `public_html` klasörüne yüklendiği için siteniz `https://yourdomain.com` adresinden erişilebilir olacak

### Alt Domain
- Alt domain kullanıyorsanız, dosyaları ilgili alt domain klasörüne yükleyin
- Örnek: `subdomain.yourdomain.com` için `public_html/subdomain/` klasörüne yükleyin

## ✨ Mevcut Sayfalar

### 🏠 Ana Sayfalar
- **Ana Sayfa** (`/`) - Hero section, öne çıkan kurslar
- **Kurslar** (`/courses`) - Tüm kurslar, filtreleme, arama
- **Giriş** (`/login`) - Kullanıcı girişi
- **Kayıt** (`/register`) - Kullanıcı kaydı
- **Profil** (`/profile`) - Kullanıcı profili
- **Kütüphane** (`/library`) - Satın alınan kurslar

### 🎯 API Entegrasyonu
- **Gerçek API** - https://api.vetmedipedia.com
- **Fallback Data** - API erişilemezse mock data
- **Client-side Fetch** - Browser'da veri çekme
- **Loading States** - Yükleme animasyonları

## 📱 Test Etme

Yükleme sonrası test edin:
1. Ana sayfa: `https://yourdomain.com`
2. Kurslar sayfası: `https://yourdomain.com/courses/`
3. Giriş sayfası: `https://yourdomain.com/login/`
4. Kayıt sayfası: `https://yourdomain.com/register/`
5. Profil sayfası: `https://yourdomain.com/profile/`
6. Kütüphane sayfası: `https://yourdomain.com/library/`

## 🔧 Sorun Giderme

### 404 Hatası
- Tüm dosyaların doğru yüklendiğinden emin olun
- `index.html` dosyasının `public_html` kök dizininde olduğunu kontrol edin

### CSS/JS Yüklenmeme
- `_next` klasörünün tamamen yüklendiğinden emin olun
- Dosya izinlerini kontrol edin (755 klasörler, 644 dosyalar)

### Görsel Yüklenmeme
- `img` klasörünün yüklendiğini kontrol edin
- Görseller Unsplash'dan yükleniyor, internet bağlantısını kontrol edin

## 📞 Destek

Herhangi bir sorun yaşarsanız:
1. C Panel File Manager'dan dosya yapısını kontrol edin
2. Tarayıcı konsolunu kontrol edin (F12)
3. C Panel error loglarını inceleyin

---

**Not:** Bu proje tamamen static dosyalardan oluşur ve herhangi bir veritabanı veya sunucu tarafı işlem gerektirmez. Sadece dosyaları yükleyin ve siteniz çalışmaya hazır!
