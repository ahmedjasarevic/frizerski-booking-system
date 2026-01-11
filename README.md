# Frizerski Booking Sistem

Ovo je **full-stack aplikacija za rezervaciju termina u frizerskim salonima**, razvijena kao praktični projekt sa MVC arhitekturom.  
Omogućava korisnicima da pregledaju usluge, rezervišu termine i adminu da prati i upravlja svim rezervacijama.

---

## 🎯 Funkcionalnosti aplikacije

### Za korisnike:
- Prikaz svih dostupnih frizerskih usluga  
- Odabir datuma i slobodnog termina  
- Unos imena i broja telefona za rezervaciju  
- Potvrda rezervacije sa prikazom uspješnog završetka  

### Za admina:
- **Prijava u sistem** (login forma)
- Pregled svih rezervacija  
- Brzi uvid u zauzetost termina po datumu i vremenu  
- **CRUD operacije za usluge** (kreiranje, čitanje, ažuriranje, brisanje)
- **CRUD operacije za rezervacije** (brisanje, pregled)
- Filtriranje rezervacija po datumu
- Jednostavan interfejs bez komplikacija  

### Tehničke funkcionalnosti:
- **MVC arhitektura** (Models, Views, Controllers)
- **3 Modela**: User, Service, Appointment
- **Svi HTTP metodi**: GET, POST, PUT, DELETE
- Frontend u React + Vite sa modernim UI/UX dizajnom
- Backend u Express.js sa RESTful API rutama
- **MySQL baza podataka** 
- JWT autentifikacija za login
- Sigurno učitavanje podataka sa error handlingom
- Loading states i animacije
- Responsive dizajn za sve uređaje
- Modularna struktura za lako proširenje
- **Komentari na bosanskom jeziku** kroz kod

---

## 🚀 Instalacija i pokretanje

### Preduslovi
- Node.js (v18 ili noviji)
- npm ili yarn
- MySQL server (lokalno ili remote)

### 1. Kloniranje repozitorija
```bash
git clone https://github.com/ahmedjasarevic/frizerski-booking-system.git
cd frizerski-booking-system
```

### 2. MySQL Setup

1. Pokrenite MySQL server
2. Kreirajte bazu podataka:
```sql
CREATE DATABASE frizerski_booking CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. Pokrenite SQL skriptu iz `database/mysql-schema.sql` u MySQL klijentu:
```bash
mysql -u root -p frizerski_booking < database/mysql-schema.sql
```

Ili kopirajte sadržaj `database/mysql-schema.sql` i pokrenite u MySQL Workbench ili phpMyAdmin.

### 3. Backend Setup

```bash
cd backend
npm install
```

Kreirajte `.env` fajl u `backend/` folderu:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=frizerski_booking

JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=5000
NODE_ENV=development
```

Pokrenite backend:
```bash
npm run dev
```

Backend će raditi na `http://localhost:5000`

### 4. Frontend Setup

```bash
cd frontend
npm install
```

Kreirajte `.env` fajl u `frontend/` folderu:
```env
VITE_API_URL=http://localhost:5000/api
```

Pokrenite frontend:
```bash
npm run dev
```

Frontend će raditi na `http://localhost:5173`

---

## 📁 Struktura projekta (MVC)

```
frizerski-booking-system/
├── backend/                    # Express.js backend
│   ├── src/
│   │   ├── config/            # Konfiguracija (database.js)
│   │   ├── models/            # MODELS (User.js, Service.js, Appointment.js)
│   │   ├── controllers/       # CONTROLLERS (UserController.js, ServiceController.js, AppointmentController.js)
│   │   ├── routes/           # Rute (userRoutes.js, serviceRoutes.js, appointments.js)
│   │   ├── middleware/       # Middleware (auth.js)
│   │   ├── app.js            # Express aplikacija
│   │   └── server.js         # Server entry point
│   └── package.json
├── frontend/                  # React + Vite aplikacija
│   ├── src/
│   │   ├── components/       # Reusable komponente
│   │   ├── pages/           # VIEWS (Home, Booking, Admin, Login, Success)
│   │   ├── services/        # API servisi
│   │   └── App.jsx          # Glavna komponenta
│   └── package.json
├── database/                 # SQL skripte
│   ├── mysql-schema.sql     # MySQL schema sa tabelama
│   └── schema.sql        
└── README.md
```

---

## 🎨 Funkcionalnosti

### Login Page
- Forma za prijavu korisnika
- JWT autentifikacija
- Test korisnik: `admin` / `admin123`

### Home Page
- Prikaz svih dostupnih usluga u grid layout-u
- Moderni kartice sa hover efektima
- Loading i error states

### Booking Page
- Odabir datuma (minimalno danas)
- Prikaz dostupnih vremenskih slotova
- Validacija formi
- Real-time provjera zauzetosti

### Admin Panel
- **Tabovi**: Rezervacije i Usluge
- **Rezervacije tab**:
  - Pregled svih rezervacija
  - Filtriranje po datumu
  - Brisanje rezervacija (DELETE)
- **Usluge tab**:
  - Pregled svih usluga
  - Dodavanje nove usluge (POST)
  - Uređivanje usluge (PUT)
  - Brisanje usluge (DELETE)

### Success Page
- Potvrda rezervacije
- Prikaz detalja rezervacije
- Navigacija nazad ili nova rezervacija

---

## 🔌 API Endpoints

### Users (Korisnici)
- `POST /api/users/login` - Prijava korisnika
- `GET /api/users` - Dohvatanje svih korisnika (auth required)
- `GET /api/users/:id` - Dohvatanje korisnika po ID-u (auth required)
- `POST /api/users` - Kreiranje novog korisnika
- `PUT /api/users/:id` - Ažuriranje korisnika (auth required)
- `DELETE /api/users/:id` - Brisanje korisnika (admin only)

### Services (Usluge)
- `GET /api/services` - Dohvatanje svih usluga
- `GET /api/services/:id` - Dohvatanje usluge po ID-u
- `POST /api/services` - Kreiranje nove usluge (admin only)
- `PUT /api/services/:id` - Ažuriranje usluge (admin only)
- `DELETE /api/services/:id` - Brisanje usluge (admin only)

### Appointments (Rezervacije)
- `GET /api/appointments` - Dohvatanje svih rezervacija (auth required)
- `GET /api/appointments/:id` - Dohvatanje rezervacije po ID-u (auth required)
- `GET /api/appointments/date/:date` - Dohvatanje rezervacija po datumu (auth required)
- `GET /api/appointments/available-slots?serviceId=X&date=YYYY-MM-DD` - Dostupni slotovi
- `POST /api/appointments` - Kreiranje nove rezervacije
- `PUT /api/appointments/:id` - Ažuriranje rezervacije (admin only)
- `DELETE /api/appointments/:id` - Brisanje rezervacije (admin only)

---

## 🛠️ Tehnologije

- **Frontend:**
  - React 19
  - React Router DOM
  - Vite
  - Axios (za API pozive)
  - CSS3 (Custom Properties, Flexbox, Grid)

- **Backend:**
  - Express.js
  - MySQL2 (za MySQL bazu)
  - bcryptjs (za hash-ovanje lozinki)
  - jsonwebtoken (za JWT autentifikaciju)
  - CORS
  - dotenv

- **Database:**
  - MySQL
  - 3 tabele: users, services, appointments

---

## 📝 Napomene

- Aplikacija koristi **MVC arhitekturu** sa jasno odvojenim Models, Views i Controllers
- **Svi HTTP metodi** (GET, POST, PUT, DELETE) su implementirani
- **3 Modela**: User, Service, Appointment
- **Login forma** sa JWT autentifikacijom
- **CRUD forme** za upravljanje uslugama i rezervacijama
- **Komentari na bosanskom jeziku** kroz kod
- Test korisnik: `admin` / `admin123`

---

## 📄 Licenca

ISC