import Frizer from '../models/Frizer.js'; 



class FrizerController {
  static async getAllFrizers(req, res) {
    try {
      const frizers = await Frizer.findAll();
      res.json({ success: true, data: frizers });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async getFrizerById(req, res) {
    try {
      const frizer = await Frizer.findById(req.params.id);
      if (!frizer) {
        return res.status(404).json({ success: false, error: 'Frizer nije pronađen' });
      }
      res.json({ success: true, data: frizer });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async createFrizer(req, res) {
    try {
      const { name, bio } = req.body;
      if (!name) {
        return res.status(400).json({ success: false, error: 'Ime je obavezno' });
      }

      const frizer = await Frizer.create({ name, bio });
      res.status(201).json({ success: true, data: frizer });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async deleteFrizer(req, res) {
    try {
      await Frizer.delete(req.params.id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

export default FrizerController;
