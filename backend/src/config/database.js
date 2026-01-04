import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Dobijemo __dirname ekvivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Učitavamo .env iz root foldera projekta
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// Debug: Prikaz učitane konfiguracije (bez password-a)
console.log('📋 Database Configuration:');
console.log('   Host:', process.env.DB_HOST || 'localhost');
console.log('   Port:', process.env.DB_PORT || '3306');
console.log('   User:', process.env.DB_USER || 'root');
console.log('   Database:', process.env.DB_NAME || 'frizerski_booking');
console.log('   SSL:', process.env.DB_SSL === 'true' ? 'Enabled' : 'Disabled');
console.log('   Password:', process.env.DB_PASSWORD ? '***' : 'Not set');


// Konfiguracija za Aiven Cloud MySQL
// Aiven obično zahtijeva SSL konekciju
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'frizerski_booking',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
  connectTimeout: 60000, // 60 sekundi timeout za Aiven (samo za pool, ne za Connection)
};

// SSL konfiguracija za Aiven Cloud
// Aiven zahtijeva SSL, ali možemo koristiti self-signed cert
if (process.env.DB_SSL === 'true' || process.env.DB_HOST?.includes('aivencloud.com') || process.env.DB_HOST?.includes('aiven.io')) {
  dbConfig.ssl = {
    rejectUnauthorized: false, // Aiven koristi self-signed cert
  };
  console.log('🔒 SSL konekcija omogućena za Aiven Cloud');
}

// Kreiranje connection pool-a
const pool = mysql.createPool(dbConfig);

// Test konekcije sa detaljnim error handlingom i provjerom tabela
pool.getConnection()
  .then(async (connection) => {
    console.log('✅ Povezan sa MySQL bazom podataka');
    console.log(`📍 Host: ${dbConfig.host}:${dbConfig.port}`);
    console.log(`📊 Database: ${dbConfig.database}`);
    
    // Provjera da li tabele postoje
    try {
      const [tables] = await connection.execute(`
        SELECT TABLE_NAME 
        FROM information_schema.TABLES 
        WHERE TABLE_SCHEMA = ?
      `, [dbConfig.database]);
      
      const tableNames = tables.map(t => t.TABLE_NAME);
      const requiredTables = ['users', 'services', 'appointments'];
      const missingTables = requiredTables.filter(t => !tableNames.includes(t));
      
      if (missingTables.length > 0) {
        console.log('\n⚠️  UPOZORENJE: Nedostaju tabele:', missingTables.join(', '));
        console.log('💡 Pokrenite SQL skriptu iz database/mysql-schema.sql u MySQL bazi');
        console.log('   Ili pokrenite: node backend/src/scripts/check-tables.js');
      } else {
        console.log('✅ Sve potrebne tabele postoje');
      }
    } catch (err) {
      console.log('⚠️  Nije moguće provjeriti tabele:', err.message);
    }
    
    connection.release();
  })
  .catch(err => {
    console.error('❌ Greška pri povezivanju sa bazom:');
    console.error('   Poruka:', err.message);
    console.error('   Code:', err.code);
    console.error('   Errno:', err.errno);
    console.error('   SQL State:', err.sqlState);
    
    // Korisni savjeti za Aiven
    if (err.code === 'ECONNREFUSED') {
      console.error('\n💡 Savjet: Provjerite da li je host i port ispravan');
    } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 Savjet: Provjerite username i password u .env fajlu');
    } else if (err.code === 'ENOTFOUND') {
      console.error('\n💡 Savjet: Provjerite da li je DB_HOST ispravan u .env fajlu');
    } else if (err.message.includes('SSL')) {
      console.error('\n💡 Savjet: Aiven zahtijeva SSL. Provjerite da li je DB_SSL=true u .env');
    }
    
    console.error('\n📝 Provjerite .env fajl sa sljedećim varijablama:');
    console.error('   DB_HOST=your-aiven-host.aivencloud.com');
    console.error('   DB_PORT=your-port (obično 25060 ili slično)');
    console.error('   DB_USER=your-username');
    console.error('   DB_PASSWORD=your-password');
    console.error('   DB_NAME=frizerski_booking');
    console.error('   DB_SSL=true');
  });

export default pool;
