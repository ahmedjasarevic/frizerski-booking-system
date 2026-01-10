import express from 'express';
import ServiceController from '../controllers/ServiceController.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', ServiceController.getAllServices);
router.get('/:id', ServiceController.getServiceById);
router.post('/', authenticate, isAdmin, ServiceController.createService);
router.put('/:id', authenticate, isAdmin, ServiceController.updateService);
router.delete('/:id', authenticate, isAdmin, ServiceController.deleteService);

export default router;
