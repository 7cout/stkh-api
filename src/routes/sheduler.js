import { authMiddleware } from '../middleware/auth.js';

const schedulerStatus = async (req, res) => {
    try {
        res.send(200, scheduler.getStatus());
        return next();
    } catch (err) {
        throw new Error(`Scheduler error: ${err.message}`);
    }
};

const schedulerReload = async (req, res) => {
    try {
        scheduler.reload();
        res.send(200, { message: 'Конфигурация планировщика перезагружена' });
    } catch (err) {
        throw new Error(`Scheduler error: ${err.message}`);
    }
};

export default (server) => {
    server.get(
        '/scheduler/status',
        authMiddleware,
        schedulerStatus
    );

    server.get(
        '/scheduler/reload',
        authMiddleware,
        schedulerReload
    );
};