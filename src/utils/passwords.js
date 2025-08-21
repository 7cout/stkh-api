import fs from 'fs/promises';
import config from '../../config/index.js';

let passwords = {};

export const loadPasswords = async () => {
  try {
    const data = await fs.readFile(config.passwordsPath, 'utf8');
    passwords = JSON.parse(data);
  } catch (err) {
    console.error('FATAL: Cannot load passwords', err);
    process.exit(1);
  }
};

export const authenticate = (req) => {
  const auth = req.authorization?.basic;
  return auth && passwords[auth.username] === auth.password;
};