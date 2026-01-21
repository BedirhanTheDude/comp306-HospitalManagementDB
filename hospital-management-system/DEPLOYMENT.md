# Hospital Management System - Deployment Guide

Bu döküman, projenin çalıştırılması için gerekli adımları içerir.

---

## Gereksinimler

- **Java 17+** (Spring Boot için)
- **Maven 3.6+** (Backend build için)
- **Node.js 18+** (Frontend için)
- **MySQL 8.0+** (Veritabanı)

---

## 1. Veritabanı Kurulumu

### 1.1 MySQL'i Başlatın
```bash
# Windows
net start mysql

# macOS/Linux
sudo systemctl start mysql
# veya
brew services start mysql
```

### 1.2 Veritabanını Oluşturun
```sql
CREATE DATABASE hospital_db;
```

### 1.3 Veritabanı Bağlantı Ayarları
`backend/src/main/java/com/hospital/repositories/DB.java` dosyasındaki credentials'ı kontrol edin:

```java
private static final String URL = "jdbc:mysql://localhost:3306/hospital_db";
private static final String USER = "root";
private static final String PASS = "your_password";  // Kendi şifrenizi girin
```

---

## 2. Backend Başlatma

### 2.1 Backend Dizinine Gidin
```bash
cd hospital-management-system/backend
```

### 2.2 Bağımlılıkları Yükleyin ve Çalıştırın
```bash
# Tek komutla
mvn spring-boot:run

# Veya ayrı ayrı
mvn clean install
mvn spring-boot:run
```

### 2.3 Backend Çalıştığını Doğrulayın
```bash
curl http://localhost:8080/api/health
# veya tarayıcıda: http://localhost:8080
```

**Beklenen çıktı:** Backend 8080 portunda çalışıyor olmalı.

---

## 3. Frontend Başlatma

### 3.1 Frontend Dizinine Gidin
```bash
cd hospital-management-system/frontend
```

### 3.2 Bağımlılıkları Yükleyin
```bash
npm install
```

### 3.3 Frontend'i Başlatın
```bash
npm start
```

**Beklenen çıktı:** Frontend http://localhost:3000 adresinde açılacak.

---

## 4. Sık Karşılaşılan Hatalar ve Çözümleri

### Hata: `net::ERR_CONNECTION_REFUSED`
**Sebep:** Backend çalışmıyor.

**Çözüm:**
1. Backend'in çalıştığından emin olun: `mvn spring-boot:run`
2. 8080 portunun kullanılabilir olduğunu kontrol edin
3. MySQL'in çalıştığından emin olun

### Hata: `Access denied for user 'root'@'localhost'`
**Sebep:** MySQL şifresi yanlış.

**Çözüm:**
`DB.java` dosyasındaki `PASS` değerini doğru MySQL şifrenizle güncelleyin.

### Hata: `Unknown database 'hospital_db'`
**Sebep:** Veritabanı oluşturulmamış.

**Çözüm:**
```sql
CREATE DATABASE hospital_db;
```

### Hata: CORS Hatası
**Sebep:** Frontend ve backend arası cross-origin sorunu.

**Çözüm:**
Backend'de CORS ayarlarını kontrol edin veya `frontend/src/services/api.js` dosyasındaki `baseURL`'i doğrulayın.

---

## 5. Hızlı Başlangıç (Quick Start)

Tüm servisleri sırayla başlatmak için:

```bash
# Terminal 1 - MySQL
net start mysql  # Windows
# veya
sudo systemctl start mysql  # Linux

# Terminal 2 - Backend
cd hospital-management-system/backend
mvn spring-boot:run

# Terminal 3 - Frontend
cd hospital-management-system/frontend
npm install && npm start
```

---

## 6. Port Bilgileri

| Servis    | Port | URL                      |
|-----------|------|--------------------------|
| Frontend  | 3000 | http://localhost:3000    |
| Backend   | 8080 | http://localhost:8080    |
| MySQL     | 3306 | localhost:3306           |

---

## 7. Ortam Değişkenleri

### Backend (.env)
```properties
JWT_SECRET=your_secure_jwt_secret_key
```

### Frontend
`frontend/src/services/api.js` dosyasında API URL ayarı:
```javascript
baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api'
```

Özel bir URL kullanmak için `.env` dosyası oluşturun:
```
REACT_APP_API_URL=http://your-backend-url:8080/api
```
