import { authMiddleware } from '../middleware/auth.js';

const pong = async (req, res) => {
  try {
    res.send(200, { status: 'OK' });
  } catch (err) {
    throw new Error(`On pong error: ${err.message}`);
  }
};

export default (server) => {
  server.get('/get-data', authMiddleware, pong);
};