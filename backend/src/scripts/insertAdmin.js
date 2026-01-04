import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

async function insertAdmin() {
  try {
    const username = 'admin';
    const password = 'admin123';
    const email = 'admin@salon.com';
    const role = 'admin';

    console.log('🔐 Hash-ovanje lozinke...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('✅ Lozinka hash-ovana');

    // Provjera da li korisnik već postoji
    const [existing] = await pool.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (existing.length > 0) {
      console.log('ℹ️  Korisnik već postoji, ažuriranje lozinke...');
      await pool.execute(
        'UPDATE users SET password = ?, email = ?, role = ? WHERE username = ?',
        [hashedPassword, email, role, username]
      );
      console.log('✅ Admin korisnik ažuriran');
    } else {
      console.log('➕ Kreiranje novog admin korisnika...');
      const [result] = await pool.execute(
        'INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)',
        [username, hashedPassword, email, role]
      );
      console.log('✅ Admin korisnik kreiran sa ID:', result.insertId);
    }

    // Provjera da li je korisnik uspješno kreiran/ažuriran
    const [verify] = await pool.execute(
      'SELECT id, username, email, role FROM users WHERE username = ?',
      [username]
    );
    
    if (verify.length > 0) {
      console.log('\n📋 Admin korisnik:');
      console.log('   Username:', verify[0].username);
      console.log('   Email:', verify[0].email);
      console.log('   Role:', verify[0].role);
      console.log('   ID:', verify[0].id);
      console.log('\n✅ Login podaci:');
      console.log('   Username: admin');
      console.log('   Password: admin123');
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Greška:', err.message);
    console.error(err);
    process.exit(1);
  }
}

insertAdmin();
