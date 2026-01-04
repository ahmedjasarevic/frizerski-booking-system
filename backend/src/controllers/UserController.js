// Kontroler za upravljanje korisnicima
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

class UserController {
  // GET - Dohvatanje svih korisnika
  static async getAllUsers(req, res) {
    try {
      const users = await User.findAll();
      res.json({ success: true, data: users });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // GET - Dohvatanje korisnika po ID-u
  static async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      
      if (!user) {
        return res.status(404).json({ success: false, error: 'Korisnik nije pronađen' });
      }
      
      res.json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // POST - Kreiranje novog korisnika
  static async createUser(req, res) {
    try {
      const { username, password, email, role } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ 
          success: false, 
          error: 'Username i password su obavezni' 
        });
      }

      // Provjera da li korisnik već postoji
      const existingUser = await User.findByUsername(username);
      if (existingUser) {
        return res.status(409).json({ 
          success: false, 
          error: 'Korisnik sa tim username-om već postoji' 
        });
      }

      const user = await User.create({ username, password, email, role });
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // PUT - Ažuriranje korisnika
  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { username, email, role } = req.body;
      
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ success: false, error: 'Korisnik nije pronađen' });
      }

      const updatedUser = await User.update(id, { username, email, role });
      res.json({ success: true, data: updatedUser });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // DELETE - Brisanje korisnika
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      
      const deleted = await User.delete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Korisnik nije pronađen' });
      }

      res.json({ success: true, message: 'Korisnik uspješno obrisan' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // POST - Login korisnika
  static async login(req, res) {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ 
          success: false, 
          error: 'Username i password su obavezni' 
        });
      }

      console.log(`🔐 Login pokušaj za korisnika: ${username}`);
      
      const user = await User.findByUsername(username);
      if (!user) {
        console.log(`❌ Korisnik ${username} nije pronađen`);
        return res.status(401).json({ 
          success: false, 
          error: 'Neispravni podaci za prijavu' 
        });
      }

      console.log(`✅ Korisnik pronađen: ${user.username} (ID: ${user.id})`);
      console.log(`🔑 Provjera lozinke...`);
      
      const isValidPassword = await User.verifyPassword(password, user.password);
      if (!isValidPassword) {
        console.log(`❌ Neispravna lozinka za korisnika: ${username}`);
        return res.status(401).json({ 
          success: false, 
          error: 'Neispravni podaci za prijavu' 
        });
      }

      console.log(`✅ Lozinka ispravna za korisnika: ${username}`);

      // Generisanje JWT tokena
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.json({ 
        success: true, 
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

export default UserController;
