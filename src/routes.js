const express = require('express');
const multer = require('multer');
const multerConfig = require('./config/multer');

const routes = new express.Router();
const upload = multer(multerConfig);

/**
 * Controllers
 */
const UserController = require('./app/controllers/UserController');
const SessionController = require('./app/controllers/SessionController');
const FileController = require('./app/controllers/FileController');
const ProviderController = require('./app/controllers/ProviderController');
const AppointmentController = require('./app/controllers/AppointmentController');
const ScheduleController = require('./app/controllers/ScheduleController');
const NotificationController = require('./app/controllers/NotificationController');
const AvailableController = require('./app/controllers/AvailableController');

/**
 * Middlewares
 */
const authMiddleware = require('./app/middlewares/auth');

/**
 * public
 */
routes.post('/api/v1/users', UserController.store);
routes.post('/api/v1/sessions', SessionController.store);

/**
 * privates
 */

routes.use(authMiddleware);

/**
 * User
 */
routes.get('/api/v1/users', UserController.index);
routes.get('/api/v1/users/me', UserController.show);
routes.put('/api/v1/users', UserController.update);

/**
 * File
 */
routes.post('/api/v1/files', upload.single('file'), FileController.store);

/**
 * Provider
 */
routes.get('/api/v1/providers', ProviderController.index);
routes.get(
  '/api/v1/providers/:providerId/available',
  AvailableController.index
);

/**
 * Appointment
 */

routes.get('/api/v1/appointments', AppointmentController.index);
routes.post('/api/v1/appointments', AppointmentController.store);
routes.delete('/api/v1/appointments/:id', AppointmentController.delete);

/**
 * Schedule
 */

routes.get('/api/v1/schedules', ScheduleController.index);

/**
 *  Notification
 */

routes.get('/api/v1/notifications', NotificationController.index);
routes.put('/api/v1/notifications/:id', NotificationController.update);

module.exports = routes;
