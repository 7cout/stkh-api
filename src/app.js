import config from '../config/index.js';
import restify from 'restify';
import usersRoutes from './routes/users.js';
import offlineRoutes from './routes/offline.js';
import schedulerRoutes from './routes/sheduler.js';
import pongRoutes from './routes/pong.js';
import scheduler from './utils/scheduler.js';
import { loadPasswords } from './utils/passwords.js';
import { errorHandler } from './middleware/auth.js';

const server = restify.createServer({
  name: 'stkh-activity-monitoring-api',
  version: '1.0.0'
});

server.use(restify.plugins.pre.sanitizePath());
server.use(restify.plugins.authorizationParser());
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

const startServer = async () => {
  try {
    await loadPasswords();
    
    offlineRoutes(server);
    usersRoutes(server);
    
    pongRoutes(server);

    schedulerRoutes(server);
    
    server.on('restifyError', errorHandler);

    server.on('NotFound', (req, res, err, next) => {
      res.send(404, { status: 'route not found' });
    });
    
    server.listen(config.port, async () => {
      console.log(`${server.name} listening at ${server.url}`);

      await scheduler.initialize();
    });
  } catch (err) {
    console.error('FATAL: Server initialization failed', err);
    process.exit(1);
  }
};

startServer();

process.on('SIGTERM', () => {
  console.log('Stopping the scheduler');
  scheduler.stopAll();

  server.close(() => {
    console.log('Server stopped gracefully');
    process.exit(0);
  });
});