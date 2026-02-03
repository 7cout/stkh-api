import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = ['DB_USER', 'DB_SERVER', 'DB_DATABASE', 'DB_PASSWORD', 'PASSWORDS_PATH','SERVER_PORT','SSL_KEY_PATH','SSL_CERT_PATH'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('FATAL: Missing required environment variables:', missingEnvVars.join(', '));
  process.exit(1);
}

export default {
  db: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
      encrypt: false,
      trustServerCertificate: true,
      enableArithAbort: true,
      // Дополнительные настройки для старых версий SQL Server
      cryptoCredentialsDetails: {
        minVersion: 'TLSv1'
      }
    }
  },
  port: process.env.SERVER_PORT,
  passwords_path: process.env.PASSWORDS_PATH,
  ssl_cert_path: process.env.SSL_CERT_PATH,
  ssl_key_path: process.env.SSL_KEY_PATH,
};