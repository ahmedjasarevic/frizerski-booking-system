// Kontroler za upravljanje uslugama
import Service from '../models/Service.js';

class ServiceController {
  // GET - Dohvatanje svih usluga
  static async getAllServices(req, res) {
    try {
      const services = await Service.findAll();
      res.json({ success: true, data: services });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // GET - Dohvatanje usluge po ID-u
  static async getServiceById(req, res) {
    try {
      const { id } = req.params;
      const service = await Service.findById(id);
      
      if (!service) {
        return res.status(404).json({ success: false, error: 'Usluga nije pronađena' });
      }
      
      res.json({ success: true, data: service });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // POST - Kreiranje nove usluge
  static async createService(req, res) {
    try {
      const { name, description, price, duration, icon } = req.body;
      
      if (!name) {
        return res.status(400).json({ 
          success: false, 
          error: 'Naziv usluge je obavezan' 
        });
      }

      const service = await Service.create({ name, description, price, duration, icon });
      res.status(201).json({ success: true, data: service });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // PUT - Ažuriranje usluge
  static async updateService(req, res) {
    try {
      const { id } = req.params;
      const { name, description, price, duration, icon } = req.body;
      
      const service = await Service.findById(id);
      if (!service) {
        return res.status(404).json({ success: false, error: 'Usluga nije pronađena' });
      }

      const updatedService = await Service.update(id, { name, description, price, duration, icon });
      res.json({ success: true, data: updatedService });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // DELETE - Brisanje usluge
  static async deleteService(req, res) {
    try {
      const { id } = req.params;
      
      const deleted = await Service.delete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Usluga nije pronađena' });
      }

      res.json({ success: true, message: 'Usluga uspješno obrisana' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

export default ServiceController;
