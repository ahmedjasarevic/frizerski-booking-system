// Model za korisnike (Users)
import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

class User {
  // Pronalaženje korisnika po username-u
  static async findByUsername(username) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Greška pri pronalaženju korisnika: ${error.message}`);
    }
  }

  // Pronalaženje korisnika po ID-u
  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Greška pri pronalaženju korisnika: ${error.message}`);
    }
  }

  // Kreiranje novog korisnika
  static async create(userData) {
    const { username, password, email, role = 'user' } = userData;
    
    try {
      // Hash-ovanje lozinke
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const [result] = await pool.execute(
        'INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)',
        [username, hashedPassword, email, role]
      );
      
      return { id: result.insertId, username, email, role };
    } catch (error) {
      throw new Error(`Greška pri kreiranju korisnika: ${error.message}`);
    }
  }

  // Provjera lozinke
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Ažuriranje korisnika
  static async update(id, userData) {
    const { username, email, role } = userData;
    
    try {
      await pool.execute(
        'UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?',
        [username, email, role, id]
      );
      return await this.findById(id);
    } catch (error) {
      throw new Error(`Greška pri ažuriranju korisnika: ${error.message}`);
    }
  }

  // Brisanje korisnika
  static async delete(id) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM users WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Greška pri brisanju korisnika: ${error.message}`);
    }
  }

  // Dohvatanje svih korisnika
  static async findAll() {
    try {
      const [rows] = await pool.execute(
        'SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC'
      );
      return rows;
    } catch (error) {
      throw new Error(`Greška pri dohvaćanju korisnika: ${error.message}`);
    }
  }
}

export default User;
