# Frizerski Booking Sistem

Ovo je **full-stack aplikacija za rezervaciju termina u frizerskim salonima**, razvijena kao praktični projekt sa MVC arhitekturom.  
Omogućava korisnicima da pregledaju usluge, rezervišu termine i adminu da prati i upravlja svim rezervacijama.

---

## 🎯 Funkcionalnosti aplikacije

### Za korisnike:
- Prikaz svih dostupnih frizerskih usluga  
- Odabir datuma i slobodnog termina  
- Unos imena i broja telefona za rezervaciju  
- Potvrda rezervacije putem SMS verifikacije sa prikazom uspješnog završetka  

### Za admina:
- **Prijava u sistem** (login forma)
- Pregled svih rezervacija  
- Brzi uvid u zauzetost termina po datumu i vremenu, te frizeru
- **CRUD operacije za usluge** (kreiranje, čitanje, ažuriranje, brisanje)
- **CRUD operacije za rezervacije** (brisanje, pregled)
-  **CRUD operacije za frizere** (kreiranje, čitanje, ažuriranje, brisanje)
- Filtriranje rezervacija po datumu
- - Filtriranje rezervacija po frizeru
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

---

## 🚀 Instalacija i pokretanje

### Preduslovi
- Node.js (v18 ili noviji)
- npm 

### 1. Kloniranje repozitorija
```bash
git clone https://github.com/ahmedjasarevic/frizerski-booking-system.git
cd frizerski-booking-system
```


Kreirajte `.env` fajl u `root` folderu:
```env
# MySQL / Aiven Database
DB_HOST=frizerski-booking-size-dd43.l.aivencloud.com
DB_PORT=13515
DB_USER=avnadmin
DB_PASSWORD=AVNS_5-Ut0sHQlxbTxtcbLW5
DB_NAME=frizerski_booking
DB_SSL=true

TWILIO_ACCOUNT_SID=ACe65ca260c66b3b19090f319215fb72c0
TWILIO_AUTH_TOKEN=eb8be4fee32e49b4db02e35e6de7638b
TWILIO_VERIFY_SERVICE_SID=VA92a871330bdb2f01264602ba7c1ba7bf
VITE_API_URL=http://localhost:5000/api

# Server config
PORT=5000

```

### 2. Backend Setup

```bash
cd backend
npm install
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
│   │   ├── scripts/          # Skripte za ubacivanje admina, provjera dostupni tabela
│   │   ├── app.js            # Express aplikacija
│   │   └── server.js         # Server entry point
│   └── package.json
├── frontend/                  # React + Vite aplikacija
│   ├── src/
│   │   ├── components/       # Reusable komponente
│   │   ├── pages/           # VIEWS (Home, Booking, Admin, Login, Success)
│   │   ├── services/        # API servisi
│   │   ├── assets/          # Logo i ostale slike
│   │   └── App.jsx          # Glavna komponenta
│   └── package.json
├── database/                 # SQL skripte
│   ├── mysql-schema.sql     # MySQL schema sa tabelama    
└── README.md
└── .env
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
- Validacija putem SMS verifikacije
- Real-time provjera zauzetosti

### Admin Panel
- **Tabovi**: Rezervacije i Usluge
- **Rezervacije tab**:
  - Pregled svih rezervacija
  - Filtriranje po datumu
  - Filtriranje po frizeru
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
  - bcryptjs (za hash-ovanje lozinki)
  - jsonwebtoken (za JWT autentifikaciju)
  - CORS
  - dotenv

- **Database:**
  - MySQL na Cloduu AIVEN
  - 3 tabele: users, services, appointments

---

## 📝 Napomene

- Aplikacija koristi **MVC arhitekturu** sa jasno odvojenim Models, Views i Controllers
- **Svi HTTP metodi** (GET, POST, PUT, DELETE) su implementirani
- **3 Modela**: User, Service, Appointment
- **Login forma** sa JWT autentifikacijom
- **CRUD forme** za upravljanje uslugama i rezervacijama
- Test korisnik: `admin` / `admin123`

---
