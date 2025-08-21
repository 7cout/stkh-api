import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const requiredEnvVars = ['DB_USER', 'DB_SERVER', 'DB_DATABASE'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('FATAL: Missing required environment variables:', missingEnvVars.join(', '));
  process.exit(1);
}

export default {
  port: process.env.DB_PORT || 3000,
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
  passwordsPath: path.resolve(__dirname, process.env.PASSWORDS_PATH || '../config/passwords.bin')
};