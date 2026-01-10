// controllers/FrizerController.js
import Frizer from '../models/Frizer.js';

class FrizerController {
  static async getAllFrizers(req, res, next) {
    try {
      const frizers = await Frizer.findAll();
      res.json({ success: true, data: frizers });
    } catch (error) {
      next(error);
    }
  }

  static async getFrizerById(req, res, next) {
    try {
      const frizer = await Frizer.findById(req.params.id);
      if (!frizer) {
        return res.status(404).json({ success: false, error: 'Frizer nije pronađen' });
      }
      res.json({ success: true, data: frizer });
    } catch (error) {
      next(error);
    }
  }
}

export default FrizerController;
