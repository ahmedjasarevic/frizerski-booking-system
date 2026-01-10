import express from 'express';
import AppointmentController from '../controllers/AppointmentController.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/available-slots', AppointmentController.getAvailableSlots);
router.get('/date/:date', authenticate, AppointmentController.getAppointmentsByDate);
router.get('/', authenticate, AppointmentController.getAllAppointments);
router.get('/:id', authenticate, AppointmentController.getAppointmentById);

router.post('/', AppointmentController.createAppointment);
router.put('/:id', authenticate, isAdmin, AppointmentController.updateAppointment);
router.delete('/:id', authenticate, isAdmin, AppointmentController.deleteAppointment);

export default router;
