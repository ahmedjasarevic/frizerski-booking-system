// Rute za upravljanje uslugama
import express from 'express';
import ServiceController from '../controllers/ServiceController.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET - Dohvatanje svih usluga (javna ruta)
router.get('/', ServiceController.getAllServices);

// GET - Dohvatanje usluge po ID-u (javna ruta)
router.get('/:id', ServiceController.getServiceById);

// POST - Kreiranje nove usluge (zahtijeva admin dozvole)
router.post('/', authenticate, isAdmin, ServiceController.createService);

// PUT - Ažuriranje usluge (zahtijeva admin dozvole)
router.put('/:id', authenticate, isAdmin, ServiceController.updateService);

// DELETE - Brisanje usluge (zahtijeva admin dozvole)
router.delete('/:id', authenticate, isAdmin, ServiceController.deleteService);

export default router;
