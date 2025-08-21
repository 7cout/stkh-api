import { authenticate } from '../utils/passwords.js';

export const authMiddleware = (req, res, next) => {
  if (authenticate(req)) {
    next();
    console.log('Successful authentication');
  } else {
    res.send(401, { status: 'auth error' });
  }
};

export const errorHandler = (req, res, err, next) => {
  console.error('Unhandled error:', err);
  res.send(500, { status: 'server error' });
};

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});