// Rute za upravljanje rezervacijama
import express from 'express';
import AppointmentController from '../controllers/AppointmentController.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// VAŽNO: Specifične rute moraju biti prije dinamičkih ruta!

// GET - Dohvatanje dostupnih vremenskih slotova (javna ruta) - PRIJE /:id
router.get('/available-slots', AppointmentController.getAvailableSlots);

// GET - Dohvatanje rezervacija po datumu (zahtijeva autentifikaciju) - PRIJE /:id
router.get('/date/:date', authenticate, AppointmentController.getAppointmentsByDate);

// GET - Dohvatanje svih rezervacija (zahtijeva autentifikaciju)
router.get('/', authenticate, AppointmentController.getAllAppointments);

// GET - Dohvatanje rezervacije po ID-u (zahtijeva autentifikaciju) - NA KRAJU
router.get('/:id', authenticate, AppointmentController.getAppointmentById);

// POST - Kreiranje nove rezervacije (javna ruta)
router.post('/', AppointmentController.createAppointment);

// PUT - Ažuriranje rezervacije (zahtijeva admin dozvole)
router.put('/:id', authenticate, isAdmin, AppointmentController.updateAppointment);

// DELETE - Brisanje rezervacije (zahtijeva admin dozvole)
router.delete('/:id', authenticate, isAdmin, AppointmentController.deleteAppointment);

export default router;