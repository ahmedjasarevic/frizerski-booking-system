// Skripta za provjeru da li tabele postoje u bazi
import pool from '../config/database.js';

async function checkTables() {
  try {
    console.log('\n🔍 Provjera tabela u bazi podataka...\n');

    // Provjera da li tabele postoje
    const [tables] = await pool.execute(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = DATABASE()
    `);

    const tableNames = tables.map(t => t.TABLE_NAME);
    
    console.log('📊 Pronađene tabele:', tableNames.length > 0 ? tableNames.join(', ') : 'Nema tabela');
    
    // Provjera specifičnih tabela
    const requiredTables = ['users', 'services', 'appointments'];
    const missingTables = requiredTables.filter(t => !tableNames.includes(t));
    
    if (missingTables.length > 0) {
      console.log('\n❌ Nedostaju tabele:', missingTables.join(', '));
      console.log('💡 Pokrenite SQL skriptu iz database/mysql-schema.sql u MySQL bazi');
    } else {
      console.log('\n✅ Sve potrebne tabele postoje!');
      
      // Provjera broja redova
      for (const table of requiredTables) {
        const [rows] = await pool.execute(`SELECT COUNT(*) as count FROM ${table}`);
        console.log(`   ${table}: ${rows[0].count} redova`);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Greška pri provjeri tabela:', error.message);
    process.exit(1);
  }
}

checkTables();
