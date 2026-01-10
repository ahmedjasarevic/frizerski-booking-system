// routes/frizers.js
import express from 'express';
import FrizerController from '../controllers/FrizerController.js';

const router = express.Router();

// GET - svi frizeri (javna ruta)
router.get('/', FrizerController.getAllFrizers);

// GET - frizer po ID-u
router.get('/:id', FrizerController.getFrizerById);

export default router;
