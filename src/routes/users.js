import { pool, poolConnect } from '../db/pool.js';
import { authMiddleware } from '../middleware/auth.js';
import { USERS_QUERY } from '../db/queries/users.js';

const getUsers = async (req, res) => {
  try {
    await poolConnect;
    const request = pool.request();
    
    const result = await request.query(USERS_QUERY);
    res.send({ status: 'OK', rows: result.recordset });
    console.log('Successful getUsers');
  } catch (err) {
    throw new Error(`Database error: ${err.message}`);
  }
};

export default (server) => {
  server.get('/get-data/users', authMiddleware, getUsers);
};