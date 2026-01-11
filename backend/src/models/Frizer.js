import pool from '../config/database.js';


class Frizer {
  static async findAll() {
    const [rows] = await pool.execute(
      'SELECT id, name, bio FROM frizers WHERE active = 1 ORDER BY name ASC'
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, name, bio FROM frizers WHERE id = ? AND active = 1',
      [id]
    );
    return rows[0];
  }

  static async create({ name, bio }) {
    const [result] = await pool.execute(
      'INSERT INTO frizers (name, bio, active) VALUES (?, ?, 1)',
      [name, bio]
    );

    return { id: result.insertId, name, bio };
  }

  static async delete(id) {
    await pool.execute(
      'UPDATE frizers SET active = 0 WHERE id = ?',
      [id]
    );
  }
}

export default Frizer;
