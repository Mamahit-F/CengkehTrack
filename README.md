# CengkihTrack — Sistem Informasi Manajemen Kebun & Panen Cengkih

Aplikasi full-stack terintegrasi untuk pengelolaan lahan kebun cengkih, pencatatan hasil panen (dalam satuan **LITER**), riwayat transaksi penjualan dengan kalkulasi otomatis dan revalidasi server, serta laporan komprehensif.

Dibangun dengan pendekatan desain **Dark Nature Glassmorphism** yang elegan, modern, dan responsif.

---

## 1. Struktur Proyek

```
cicd/
├── backend/                              # Backend Spring Boot (Java 17)
│   ├── pom.xml                           # Konfigurasi dependensi Maven
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/cengkihtrack/
│   │   │   │   ├── CengkihTrackApplication.java
│   │   │   │   ├── config/               # SecurityConfig, JpaConfig
│   │   │   │   ├── controller/           # Auth, Garden, HarvestRecord, Sale, Report
│   │   │   │   ├── dto/
│   │   │   │   │   ├── request/          # DTO validasi request (Jakarta Validation)
│   │   │   │   │   └── response/         # DTO response & ApiResponse envelope
│   │   │   │   ├── entity/               # User, Garden, HarvestRecord, Sale
│   │   │   │   ├── exception/            # GlobalExceptionHandler, Custom Exceptions
│   │   │   │   ├── repository/           # Spring Data JPA Repository (User Scoped)
│   │   │   │   ├── security/             # JWT Provider, JWT Filter, CustomUserDetailsService
│   │   │   │   └── service/              # Business logic (Auth, Garden, Harvest, Sale, Report)
│   │   │   └── resources/
│   │   │       ├── application.yml       # Konfigurasi target PostgreSQL & Flyway
│   │   │       └── db/migration/         # Skrip Migrasi SQL Flyway (V1 - V4)
│   │   │           ├── V1__create_users_table.sql
│   │   │           ├── V2__create_gardens_table.sql
│   │   │           ├── V3__create_harvest_records_table.sql
│   │   │           └── V4__create_sales_table.sql
│   │   └── test/
│   │       ├── java/com/cengkihtrack/
│   │       │   ├── security/JwtTokenProviderTest.java
│   │       │   └── service/SaleServiceTest.java
│   │       └── resources/
│   │           └── application.yml
│   └── target/                           # Build artifacts (JAR)
│
├── frontend/                             # Frontend React + Vite
│   ├── package.json                      # Dependensi: react, react-router-dom, axios, lucide-react, tailwindcss
│   ├── vite.config.js                    # Konfigurasi Vite & Tailwind CSS v4
│   ├── index.html                        # HTML Entry dengan Google Font Plus Jakarta Sans
│   ├── .env                              # VITE_API_BASE_URL=http://localhost:8080
│   ├── .env.example
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx                       # Routing & ProtectedRoute Layout
│   │   ├── index.css                     # Dark Nature Glassmorphism styling & tokens
│   │   ├── context/
│   │   │   └── AuthContext.jsx           # JWT Auth state & Demo Mode switcher
│   │   ├── services/
│   │   │   ├── api.js                    # Axios instance & interceptor JWT
│   │   │   └── demoData.js               # Data simulasi eksplisit berlabel DEMO
│   │   ├── components/
│   │   │   ├── Navbar.jsx                # Navigasi horizontal + Logo Cengkih + Wordmark + Mobile menu
│   │   │   ├── StatCard.jsx              # Kartu KPI Glassmorphism
│   │   │   ├── BackendOfflineAlert.jsx   # Deteksi koneksi backend ramah
│   │   │   ├── LoadingSpinner.jsx        # Indikator loading
│   │   │   ├── EmptyState.jsx            # State data kosong
│   │   │   └── ProtectedRoute.jsx        # Pelindung rute autentikasi
│   │   └── pages/
│   │       ├── Login.jsx                 # Masuk akun & opsi Preview Demo Mode
│   │       ├── Register.jsx              # Registrasi akun baru
│   │       ├── Dashboard.jsx             # KPI Total Panen (Liter) & Total Pendapatan
│   │       ├── Gardens.jsx               # Manajemen Lahan Kebun Cengkih
│   │       ├── Harvests.jsx              # Catatan Panen Cengkih (Satuan LITER)
│   │       ├── Sales.jsx                 # Penjualan (Kalkulasi otomatis & validasi server)
│   │       ├── Reports.jsx               # Laporan & Filter Periode (Pendapatan vs Laba)
│   │       └── Profile.jsx               # Profil pengguna & Ganti password
│   └── dist/                             # Production build assets
│
└── README.md                             # Dokumentasi panduan operasional
```

---

## 2. Teknologi yang Digunakan

### Frontend:
- **Framework & Build**: React 19 dengan Vite 8.
- **Styling**: Tailwind CSS v4 dengan palet khusus **Dark Nature Glassmorphism**:
  - Forest Green Dark: `#0F1E0F`
  - Glass Background: `rgba(255, 255, 255, 0.08)`
  - Lime Green Accent: `#47C826`
  - Earthy Orange: `#D97706`
  - Text Light: `#FFFFFF`
  - Text Muted: `#AA8BAD`
- **Tipografi**: **Plus Jakarta Sans** (Google Fonts).
- **Routing**: React Router v7 (`react-router-dom`).
- **HTTP Client**: Axios dengan request/response interceptor untuk menyematkan JWT Bearer token serta deteksi status koneksi backend.
- **Ikonografi**: Lucide React.

### Backend:
- **Runtime**: Java 17 LTS.
- **Framework**: Spring Boot 3.2.5.
- **Security**: Spring Security 6 dengan Stateless JWT Authentication (`jjwt 0.11.5`) & BCrypt Password Encoder.
- **Data Persistence**: Spring Data JPA / Hibernate dengan `hibernate.ddl-auto=validate` (aman, tidak merusak skema produksi).
- **Validasi**: Jakarta Bean Validation (`spring-boot-starter-validation`).
- **Database Target**: PostgreSQL Driver.
- **Database Migration**: Flyway Migration (`V1` s.d `V4`).
- **Testing**: JUnit 5, Mockito, AssertJ.

---

## 3. Persyaratan Instalasi

Pastikan perangkat Anda memiliki:
1. **Node.js**: Versi 18+ (terverifikasi: v24.13.1) dan npm.
2. **Java JDK**: Java 17 LTS (terverifikasi: Oracle JDK 17.0.12).
3. **Apache Maven**: Versi 3.8+ (terverifikasi: Maven 3.9.12).
4. **PostgreSQL**: (Opsional saat ini — dibutuhkan nanti saat integrasi database permanen).

---

## 4. Cara Menjalankan Frontend Sekarang

Frontend dapat dijalankan secara langsung tanpa memerlukan backend atau database yang aktif:

```bash
cd frontend

# Install dependensi (sudah terpasang di workspace)
npm install

# Jalankan development server
npm run dev
```

Aplikasi web dapat dibuka di browser:
👉 **`http://localhost:5173`**

### Fitur Preview Desain (Demo Mode):
Jika backend Spring Boot atau PostgreSQL belum aktif, Anda dapat:
- Mengklik tombol **"Lihat Tampilan dengan Data DEMO"** di halaman Login.
- Mengklik tombol **"Preview Demo Mode"** pada banner notifikasi koneksi backend.
- Seluruh antarmuka (Dashboard, Data Kebun, Catat Panen, Penjualan, Laporan, Profil) dapat dieksplorasi secara visual dengan penanda **DEMO PREVIEW** yang jelas.

---

## 5. Cara Build Backend Tanpa Mengharuskan Database Aktif

Backend telah dirancang modular sehingga proses kompilasi kode dan pengemasan executable JAR **TIDAK** membutuhkan koneksi database PostgreSQL aktif:

```bash
cd backend

# Kompilasi source code Java
mvn compile

# Membuat file executable JAR tanpa koneksi database
mvn package -DskipTests
```

File JAR hasil kompilasi akan tersimpan di:
`backend/target/cengkihtrack-backend-0.0.1-SNAPSHOT.jar`

---

## 6. Cara Menjalankan Pengujian Backend Tanpa Database

Unit test bisnis logic (perhitungan server-side total penjualan dan validasi token JWT) menggunakan Mockito dan pengujian in-memory murni tanpa menyentuh database:

```bash
cd backend

# Menjalankan unit test
mvn test
```

**Hasil Pengujian:**
- `JwtTokenProviderTest`: 5 skenario (pembuatan token, decoding subjek email, validasi token sah, penolakan token rusak, verifikasi kedaluwarsa).
- `SaleServiceTest`: 4 skenario (perhitungan ulang server-side total harga = `quantityLiters * pricePerLiter`, validasi penolakan data tidak ditemukan, penghapusan transaksi).
- **Status: 9 passed, 0 failures, BUILD SUCCESS**.

---

## 7. Variabel Environment

### Frontend (`frontend/.env`):
| Variabel | Nilai Default | Keterangan |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | `http://localhost:8080` | URL alamat backend API |

### Backend (`backend/src/main/resources/application.yml`):
| Variabel | Nilai Default | Keterangan |
| :--- | :--- | :--- |
| `DATABASE_URL` | `jdbc:postgresql://localhost:5432/cengkihtrack` | URL koneksi JDBC PostgreSQL |
| `DATABASE_USERNAME` | `postgres` | Username database PostgreSQL |
| `DATABASE_PASSWORD` | `postgres` | Password database PostgreSQL |
| `JWT_SECRET` | `cengkihtrack-super-secret-key-for-jwt-signing-must-be-at-least-256-bits-long` | Secret key penandatanganan JWT (min. 256-bit) |

---

## 8. Cara Mengaktifkan Konfigurasi PostgreSQL Nanti

Ketika PostgreSQL telah diinstal di komputer Anda:

### Langkah 1: Buat Database PostgreSQL
Buka terminal / pgAdmin / psql:
```sql
CREATE DATABASE cengkihtrack;
```

### Langkah 2: Atur Kredensial (Bila Berbeda dengan Default)
Anda dapat mengekspor environment variables pada sistem atau terminal Anda:
```powershell
# Di Windows PowerShell:
$env:DATABASE_URL="jdbc:postgresql://localhost:5432/cengkihtrack"
$env:DATABASE_USERNAME="postgres"
$env:DATABASE_PASSWORD="password_anda"
```
Atau langsung sesuaikan di file `backend/src/main/resources/application.yml`.

### Langkah 3: Jalankan Backend Spring Boot
```bash
cd backend
mvn spring-boot:run
```

Saat backend pertama kali dijalankan dengan PostgreSQL aktif:
- **Flyway** akan secara otomatis membaca folder `src/main/resources/db/migration/` dan mengeksekusi skrip `V1` s.d `V4`.
- Tabel `users`, `gardens`, `harvest_records`, dan `sales` akan terbentuk lengkap dengan index, constraint, dan foreign key.
- Validasi Hibernate (`hibernate.ddl-auto=validate`) akan memverifikasi kesesuaian entity dengan tabel tanpa mengubah skema secara liar.

---

## 9. Skema Data & Desain Bisnis

1. **Satuan Produksi: LITER**:
   - Seluruh volume panen dan penjualan dihitung dalam satuan **LITER** (bukan kilogram), menggunakan tipe data `BigDecimal` (`NUMERIC(12, 3)` di database) untuk menghindari floating point issue.
2. **Perhitungan Total Harga di Server**:
   - Frontend menampilkan total estimasi otomatis di antarmuka pengguna (`volume * harga`).
   - Server Spring Boot **selalu menghitung ulang** nilai `totalPrice` di method `SaleService.computeTotal()` dengan pembulatan `HALF_UP` 2 desimal. Nilai total dari payload client tidak dipercaya mentah-mentah.
3. **Isolasi Data Antar Pengguna**:
   - Setiap entitas (`Garden`, `HarvestRecord`, `Sale`) terikat langsung dengan `user_id`.
   - Repositori query selalu menyaring berdasarkan ID pengguna yang sedang terotentikasi via token JWT (`findByIdAndUserId`), mencegah kebocoran data antar petani.
4. **Preservasi Riwayat Transaksi**:
   - Penghapusan kebun pada tabel penjualan menggunakan `ON DELETE SET NULL` pada kolom `garden_id`, sehingga riwayat finansial penjualan tidak hilang atau rusak ketika data kebun dihapus.
5. **Transparansi Finansial (Pendapatan vs Keuntungan)**:
   - Dashboard dan Laporan mencatat **Total Pendapatan (Gross Revenue)** dari penjualan cengkih. Nilai ini ditegaskan **bukan keuntungan bersih** karena biaya operasional (buruh petik, pupuk, transportasi) belum dicatat dalam sistem.

---

## 10. Status Pengujian & Kesiapan Sistem

- ✅ **Frontend Build**: Lulus (`npm run build` -> `dist/` berhasil dibuat dalam 398ms).
- ✅ **Backend Compilation**: Lulus (`mvn compile` sukses).
- ✅ **Backend Unit Tests**: Lulus (9 pengujian sukses, 0 failure).
- ✅ **Backend Package**: Lulus (file JAR `cengkihtrack-backend-0.0.1-SNAPSHOT.jar` 51.7 MB berhasil dibuat).
- ⏳ **End-to-End Integration Test dengan Database Real**: Belum dijalankan karena PostgreSQL belum dipasang di environment lokal. Panduan aktivasi Flyway & database telah disiapkan lengkap di atas.
