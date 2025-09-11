import { pool, poolConnect } from '../db/pool.js';
import sql from 'mssql';
import { authMiddleware } from '../middleware/auth.js';
import { 
  OFFLINE_BY_USER_QUERY, 
  OFFLINE_ALL_USERS_QUERY 
} from '../db/queries/offline.js';

const getOfflineByDate = async (req, res) => {
  try {
    await poolConnect;
    const request = pool.request();
    
    if (!/^\d{8}$/.test(req.params.from) || 
        !/^\d{8}$/.test(req.params.to)) {
      res.send(400, { status: 'invalid date format' });
      return;
    }

    let from = req.params.from.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3');
    let to = req.params.to.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3');

    request.input('from', sql.Date, from);
    request.input('to', sql.Date, to);
    
    let query;
    if (req.params.userid) {
      if (isNaN(req.params.userid)) {
        res.send(400, { status: 'invalid user ID' });
        console.log('userid = ' + req.params.userid);
        return;
      }
      query = OFFLINE_BY_USER_QUERY;
      request.input('userid', sql.Int, parseInt(req.params.userid));
    } else {
      query = OFFLINE_ALL_USERS_QUERY;
    }
    
    const result = await request.query(query);
    res.send({ status: 'OK', rows: result.recordset });
    console.log('Successful getOfflineByDate');
  } catch (err) {
    throw new Error(`Database error: ${err.message}`);
  }
};

export default (server) => {
  server.get(
    '/get-data/offline/userid/:userid/from/:from/to/:to',
    authMiddleware,
    getOfflineByDate
  );
  
  server.get(
    '/get-data/offline/from/:from/to/:to',
    authMiddleware,
    getOfflineByDate
  );
};