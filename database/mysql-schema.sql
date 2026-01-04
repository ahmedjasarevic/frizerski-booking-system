-- Frizerski Booking System - MySQL Database Schema
-- Pokrenite ovu skriptu u MySQL bazi podataka

-- Kreiranje baze podataka
CREATE DATABASE IF NOT EXISTS frizerski_booking CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE frizerski_booking;

-- Tabela za korisnike (za login)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela za usluge
CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  duration INT, -- u minutama
  icon VARCHAR(10) DEFAULT '💇',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela za rezervacije
CREATE TABLE IF NOT EXISTS appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  service_id INT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
  UNIQUE KEY unique_booking (service_id, date, time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indeksi za bolje performanse
CREATE INDEX idx_appointments_date ON appointments(date);
CREATE INDEX idx_appointments_service ON appointments(service_id);
CREATE INDEX idx_appointments_datetime ON appointments(date, time);

-- Ubacivanje početnih podataka - admin korisnik
-- Napomena: Lozinka će biti hash-ovana kroz aplikaciju
-- Za testiranje, koristite: username: admin, password: admin123
-- Prvo pokrenite aplikaciju i registrujte admin korisnika kroz API ili
-- koristite bcrypt hash za lozinku "admin123": $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
INSERT INTO users (username, password, email, role) VALUES
  ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin@salon.com', 'admin')
ON DUPLICATE KEY UPDATE username=username;

-- Ubacivanje sample usluga
INSERT INTO services (name, description, price, duration, icon) VALUES
  ('Šišanje muško', 'Profesionalno šišanje za muškarce', 15.00, 30, '✂️'),
  ('Šišanje žensko', 'Moderno šišanje za žene', 25.00, 60, '💇‍♀️'),
  ('Farbanje', 'Kompletno farbanje kose', 45.00, 120, '🎨'),
  ('Pramenovi', 'Farbanje pramenova', 35.00, 90, '✨'),
  ('Frizura', 'Svečana frizura', 30.00, 60, '💫'),
  ('Brijanje', 'Klasično brijanje', 10.00, 20, '🪒')
ON DUPLICATE KEY UPDATE name=name;
