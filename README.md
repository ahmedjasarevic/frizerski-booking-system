# Frizerski Booking Sistem

Ovo je **full-stack aplikacija za rezervaciju termina u frizerskim salonima**, razvijena kao praktični projekt.  
Omogućava korisnicima da pregledaju usluge, rezervišu termine i adminu da prati sve rezervacije.

---

## 🎯 Funkcionalnosti aplikacije

### Za korisnike:
- Prikaz svih dostupnih frizerskih usluga  
- Odabir datuma i slobodnog termina  
- Unos imena i broja telefona za rezervaciju  
- Potvrda rezervacije sa prikazom uspješnog završetka  

### Za admina:
- Pregled svih rezervacija  
- Brzi uvid u zauzetost termina po datumu i vremenu  
- Jednostavan interfejs bez komplikacija  

### Tehničke funkcionalnosti:
- Frontend u React + Vite  
- Backend u Express.js  
- Supabase za bazu podataka i autentifikaciju (kasnije)  
- Sigurno učitavanje podataka sa error handlingom  
- Modularna struktura za lako proširenje

---

## 🏗️ Struktura projekta

sistem-za-rezervaciju-termina/
├── backend/ # Express backend
│ ├── src/
│ │ ├── app.js # Glavni Express app
│ │ ├── server.js # Start servera
│ │ └── routes/ # API rute (services, appointments)
│ └── package.json
│
├── frontend/ # React frontend (Vite)
│ ├── src/
│ │ ├── components/ # UI komponente (Navbar, ServiceCard, BookingForm...)
│ │ ├── pages/ # Stranice (Home, Booking, Success, Admin)
│ │ ├── services/ # Supabase connection i API pozivi
│ │ └── App.jsx # Root komponenta
│ └── package.json
│
├── .gitignore # Ignorira node_modules, env, build itd.
├── README.md # Ovaj fajl
└── package-lock.json / yarn.lock # Lock fajlovi za npm/yarn
