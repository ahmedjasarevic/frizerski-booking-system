// Model za rezervacije (Appointments)
import pool from '../config/database.js';

class Appointment {
  // Dohvatanje svih rezervacija
  static async findAll() {
    try {
      const [rows] = await pool.execute(
        `SELECT a.*, s.name as service_name, s.icon as service_icon 
         FROM appointments a 
         JOIN services s ON a.service_id = s.id 
         ORDER BY a.date DESC, a.time ASC`
      );
      return rows;
    } catch (error) {
      throw new Error(`Greška pri dohvaćanju rezervacija: ${error.message}`);
    }
  }

  // Pronalaženje rezervacije po ID-u
  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        `SELECT a.*, s.name as service_name, s.icon as service_icon 
         FROM appointments a 
         JOIN services s ON a.service_id = s.id 
         WHERE a.id = ?`,
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Greška pri pronalaženju rezervacije: ${error.message}`);
    }
  }

  // Dohvatanje rezervacija po datumu
  static async findByDate(date) {
    try {
      const [rows] = await pool.execute(
        `SELECT a.*, s.name as service_name, s.icon as service_icon 
         FROM appointments a 
         JOIN services s ON a.service_id = s.id 
         WHERE a.date = ? 
         ORDER BY a.time ASC`,
        [date]
      );
      return rows;
    } catch (error) {
      throw new Error(`Greška pri dohvaćanju rezervacija po datumu: ${error.message}`);
    }
  }

  // Dohvatanje rezervacija po usluzi i datumu
  static async findByServiceAndDate(serviceId, date) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM appointments WHERE service_id = ? AND date = ? ORDER BY time ASC',
        [serviceId, date]
      );
      return rows;
    } catch (error) {
      throw new Error(`Greška pri dohvaćanju rezervacija: ${error.message}`);
    }
  }

  // Provjera da li je termin zauzet
  static async isSlotBooked(serviceId, date, time) {
    try {
      const [rows] = await pool.execute(
        'SELECT id FROM appointments WHERE service_id = ? AND date = ? AND time = ?',
        [serviceId, date, time]
      );
      return rows.length > 0;
    } catch (error) {
      throw new Error(`Greška pri provjeri zauzetosti: ${error.message}`);
    }
  }

  // Dohvatanje dostupnih vremenskih slotova
  static async getAvailableSlots(serviceId, date) {
    const allSlots = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
      '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
    ];

    try {
      const bookedAppointments = await this.findByServiceAndDate(serviceId, date);
      const bookedSlots = bookedAppointments.map(apt => apt.time.toString().substring(0, 5));
      
      return allSlots.filter(slot => !bookedSlots.includes(slot));
    } catch (error) {
      throw new Error(`Greška pri dohvaćanju dostupnih termina: ${error.message}`);
    }
  }

  // Kreiranje nove rezervacije
  static async create(appointmentData) {
    const { service_id, date, time, customer_name, phone } = appointmentData;
    
    try {
      // Provjera da li je termin već zauzet
      const isBooked = await this.isSlotBooked(service_id, date, time);
      if (isBooked) {
        throw new Error('Termin je već zauzet');
      }

      const [result] = await pool.execute(
        'INSERT INTO appointments (service_id, date, time, customer_name, phone) VALUES (?, ?, ?, ?, ?)',
        [service_id, date, time, customer_name, phone]
      );
      
      return await this.findById(result.insertId);
    } catch (error) {
      throw new Error(`Greška pri kreiranju rezervacije: ${error.message}`);
    }
  }

  // Ažuriranje rezervacije
  static async update(id, appointmentData) {
    const { service_id, date, time, customer_name, phone } = appointmentData;
    
    try {
      // Provjera da li je novi termin zauzet (osim trenutne rezervacije)
      const current = await this.findById(id);
      if (!current) {
        throw new Error('Rezervacija nije pronađena');
      }

      if (current.service_id !== service_id || current.date !== date || current.time !== time) {
        const isBooked = await this.isSlotBooked(service_id, date, time);
        if (isBooked) {
          throw new Error('Termin je već zauzet');
        }
      }

      await pool.execute(
        'UPDATE appointments SET service_id = ?, date = ?, time = ?, customer_name = ?, phone = ? WHERE id = ?',
        [service_id, date, time, customer_name, phone, id]
      );
      
      return await this.findById(id);
    } catch (error) {
      throw new Error(`Greška pri ažuriranju rezervacije: ${error.message}`);
    }
  }

  // Brisanje rezervacije
  static async delete(id) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM appointments WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Greška pri brisanju rezervacije: ${error.message}`);
    }
  }
}

export default Appointment;
