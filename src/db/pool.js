import sql from 'mssql';
import config from '../../config/index.js';

if (!config.db.server) {
  console.error('FATAL: Database server not configured');
  process.exit(1);
}

const pool = new sql.ConnectionPool(config.db);
const poolConnect = pool.connect()
  .then(() => {
    console.log('Connected to SQL Server');
    return pool;
  })
  .catch(err => {
    console.error('Database Connection Failed!', err);
    process.exit(1);
  });

process.on('SIGINT', () => {
  pool.close().then(() => {
    console.log('SQL Server connection closed');
    process.exit(0);
  });
});

export { pool, poolConnect };