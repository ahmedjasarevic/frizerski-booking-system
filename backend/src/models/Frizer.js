// models/Frizer.js
import pool from '../config/database.js';

class Frizer {
  // Dohvati sve aktivne frizere
  static async findAll() {
    try {
      const [rows] = await pool.execute(
        'SELECT id, name, bio, image FROM frizers WHERE active = 1 ORDER BY name ASC'
      );
      return rows;
    } catch (error) {
      throw new Error(`Greška pri dohvaćanju frizera: ${error.message}`);
    }
  }

  // Dohvati frizera po ID-u
  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT id, name, bio, image FROM frizers WHERE id = ? AND active = 1',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Greška pri pronalaženju frizera: ${error.message}`);
    }
  }
}

export default Frizer;
