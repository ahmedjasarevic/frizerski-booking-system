// Rute za upravljanje korisnicima
import express from 'express';
import UserController from '../controllers/UserController.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// POST - Login (javna ruta)
router.post('/login', UserController.login);

// GET - Dohvatanje svih korisnika (zahtijeva autentifikaciju)
router.get('/', authenticate, isAdmin, UserController.getAllUsers);

// GET - Dohvatanje korisnika po ID-u (zahtijeva autentifikaciju)
router.get('/:id', authenticate, UserController.getUserById);

// POST - Kreiranje novog korisnika (javna ruta za registraciju)
router.post('/', UserController.createUser);

// PUT - Ažuriranje korisnika (zahtijeva autentifikaciju)
router.put('/:id', authenticate, UserController.updateUser);

// DELETE - Brisanje korisnika (zahtijeva admin dozvole)
router.delete('/:id', authenticate, isAdmin, UserController.deleteUser);

export default router;
