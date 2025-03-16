require('dotenv').config();
console.log('Server berjalan di port:', process.env.SERVER_PORT);

module.exports = {
  serverPort: process.env.SERVER_PORT,
  dbConfig: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  jwtSecret: process.env.JWT_SECRET,
};