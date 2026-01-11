import express from 'express';
import FrizerController from '../controllers/FrizerController.js';

const router = express.Router();

// GET - svi frizeri
router.get('/', FrizerController.getAllFrizers);

// GET - frizer po ID-u
router.get('/:id', FrizerController.getFrizerById);

// POST - dodaj novog frizera
router.post('/', FrizerController.createFrizer);

// DELETE - obriši frizera po ID-u
router.delete('/:id', FrizerController.deleteFrizer);

export default router;
