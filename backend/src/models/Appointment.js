import pool from '../config/database.js';
import Service from './Service.js';

class Appointment {
  static allSlots = [
    '09:00','09:30','10:00','10:30','11:00','11:30',
    '12:00','12:30','13:00','13:30','14:00','14:30',
    '15:00','15:30','16:00','16:30','17:00','17:30'
  ];
static async findAll() {
  const [rows] = await pool.execute(`
    SELECT 
      a.*,
      s.name AS service_name,
      s.icon AS service_icon,
      s.duration AS duration,
      f.name AS frizer_name
    FROM appointments a
    JOIN services s ON a.service_id = s.id
    JOIN frizers f ON a.frizer_id = f.id
    ORDER BY a.date DESC, a.time ASC
  `);
  return rows;
}
static async findById(id) {
  const [rows] = await pool.execute(`
    SELECT 
      a.*,
      s.name AS service_name,
      s.icon AS service_icon,
      s.duration AS duration,
      f.name AS frizer_name
    FROM appointments a
    JOIN services s ON a.service_id = s.id
    JOIN frizers f ON a.frizer_id = f.id
    WHERE a.id = ?
  `, [id]);

  return rows[0] || null;
}

static async findByFrizerAndDate(frizer_id, date) {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("Datum mora biti u formatu YYYY-MM-DD");
  }

  let query = `SELECT a.*, s.duration 
               FROM appointments a 
               JOIN services s ON a.service_id = s.id 
               WHERE a.date = ?`;
  const params = [date];

  if (frizer_id != null) {
    query += ' AND a.frizer_id = ?';
    params.push(frizer_id);
  }

  const [rows] = await pool.execute(query, params);
  return rows;
}

static async getAvailableSlots(serviceId, frizer_id, date) {
  const service = await Service.findById(serviceId);
  const duration = service.duration; 
  const booked = await this.findByFrizerAndDate(frizer_id, date);

  // Intervali koji su već u bazi
  const bookedIntervals = booked.map(apt => {
    const [h, m] = apt.time.split(':').map(Number);
    const start = h * 60 + m;
    return { start, end: start + apt.duration };
  });

  // 1. Slobodni slotovi (gdje nova usluga može stati)
  const freeSlots = this.allSlots.filter(slot => {
    const [h, m] = slot.split(':').map(Number);
    const slotStart = h * 60 + m;
    const slotEnd = slotStart + duration;
    return !bookedIntervals.some(b => slotStart < b.end && slotEnd > b.start);
  });

  // 2. Fizički zauzeti slotovi (točno vrijeme iz baze)
  // Uzimamo sve slotove koji padaju unutar bilo koje postojeće rezervacije
  const occupiedSlots = this.allSlots.filter(slot => {
    const [h, m] = slot.split(':').map(Number);
    const timeInMins = h * 60 + m;
    return bookedIntervals.some(b => timeInMins >= b.start && timeInMins < b.end);
  });

  return { freeSlots, occupiedSlots };
}

static async create({ service_id, frizer_id, date, time, customer_name, phone }) {
  if (!frizer_id) throw new Error("Morate odabrati frizera");

  // ✅ Provjera datuma
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("Datum mora biti u formatu YYYY-MM-DD");
  }

  const service = await Service.findById(service_id);
  if (!service) throw new Error('Usluga nije pronađena');

  const available = await this.getAvailableSlots(service_id, frizer_id, date);
  if (!available.includes(time)) throw new Error('Odabrani termin nije dostupan');

  const [result] = await pool.execute(
    `INSERT INTO appointments (service_id, frizer_id, date, time, customer_name, phone) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [service_id, frizer_id, date, time, customer_name, phone]
  );

  return await this.findById(result.insertId);
}


  static async update(id, data) {
    const current = await this.findById(id);
    if (!current) throw new Error('Rezervacija nije pronađena');

    const service = await Service.findById(data.service_id);
    if (!service) throw new Error('Usluga nije pronađena');

   const available = await this.getAvailableSlots(data.service_id, data.frizer_id, data.date);

    if (!available.includes(data.time) && !(current.date === data.date && current.time === data.time)) {
      throw new Error('Odabrani termin nije dostupan');
    }

    await pool.execute(
  `UPDATE appointments SET service_id=?, frizer_id=?, date=?, time=?, customer_name=?, phone=? WHERE id=?`,
  [data.service_id, data.frizer_id, data.date, data.time, data.customer_name, data.phone, id]
);


    return await this.findById(id);
  }

  static async delete(id) {
    const [result] = await pool.execute('DELETE FROM appointments WHERE id=?', [id]);
    return result.affectedRows > 0;
  }
}

export default Appointment;
