const mysql = require('mysql2');
require('dotenv').config();

// Configuration de la connexion à la base de données
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ecole_db',
  port: process.env.PORT_MYSQL || 3306
});

// Connexion à la base de données
connection.connect((err) => {
  if (err) {
    console.error('❌ Erreur de connexion à la base de données:', err.message);
    process.exit(1);
  }
  console.log('✅ Connecté à la base de données MySQL');
});

// Gestion des erreurs de connexion
connection.on('error', (err) => {
  console.error('Erreur MySQL:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.error('Connexion à la base de données perdue. Redémarrage nécessaire.');
  }
});

module.exports = connection;