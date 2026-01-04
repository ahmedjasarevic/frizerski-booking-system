// Model za usluge (Services)
import pool from '../config/database.js';

class Service {
  // Dohvatanje svih usluga
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

  // Pronalaženje usluge po ID-u
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

  // Kreiranje nove usluge
  static async create(serviceData) {
    const { name, description, price, duration, icon = '💇' } = serviceData;
    
    try {
      const [result] = await pool.execute(
        'INSERT INTO services (name, description, price, duration, icon) VALUES (?, ?, ?, ?, ?)',
        [name, description, price, duration, icon]
      );
      
      return await this.findById(result.insertId);
    } catch (error) {
      throw new Error(`Greška pri kreiranju usluge: ${error.message}`);
    }
  }

  // Ažuriranje usluge
  static async update(id, serviceData) {
    const { name, description, price, duration, icon } = serviceData;
    
    try {
      await pool.execute(
        'UPDATE services SET name = ?, description = ?, price = ?, duration = ?, icon = ? WHERE id = ?',
        [name, description, price, duration, icon, id]
      );
      
      return await this.findById(id);
    } catch (error) {
      throw new Error(`Greška pri ažuriranju usluge: ${error.message}`);
    }
  }

  // Brisanje usluge
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
