import pool from '../config/database.js';

class Service {
  static async findAll() {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM services ORDER BY id ASC'
      );
      return rows;
    } catch (error) {
      throw new Error(`Greška pri dohvaćanju usluga: ${error.message}`);
    }
  }

  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM services WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Greška pri pronalaženju usluge: ${error.message}`);
    }
  }

  static async create(serviceData) {
    const { name, description, price, duration, frizer_id, icon = '💇' } = serviceData;
    
    if (![30, 60, 90, 120].includes(duration)) {
      throw new Error('Trajanje usluge mora biti 30, 60, 90 ili 120 minuta');
    }

    try {
      const [result] = await pool.execute(
        'INSERT INTO services (name, description, price, duration, frizer_id, icon) VALUES (?, ?, ?, ?, ?, ?)',
        [name, description, price, duration, frizer_id, icon]
      );
      return await this.findById(result.insertId);
    } catch (error) {
      throw new Error(`Greška pri kreiranju usluge: ${error.message}`);
    }
  }

  static async update(id, serviceData) {
    const { name, description, price, duration, frizer_id, icon } = serviceData;

    if (duration && ![30, 60, 90, 120].includes(duration)) {
      throw new Error('Trajanje usluge mora biti 30, 60, 90 ili 120 minuta');
    }

    try {
      await pool.execute(
        'UPDATE services SET name = ?, description = ?, price = ?, duration = ?, frizer_id = ?, icon = ? WHERE id = ?',
        [name, description, price, duration, frizer_id, icon, id]
      );
      return await this.findById(id);
    } catch (error) {
      throw new Error(`Greška pri ažuriranju usluge: ${error.message}`);
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM services WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Greška pri brisanju usluge: ${error.message}`);
    }
  }
}

export default Service;
