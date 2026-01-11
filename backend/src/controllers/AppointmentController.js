import Appointment from '../models/Appointment.js';

class AppointmentController {
  static async getAllAppointments(req, res) {
    try {
      const appointments = await Appointment.findAll();
      res.json({ success: true, data: appointments });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getAppointmentById(req, res) {
    try {
      const { id } = req.params;
      const appointment = await Appointment.findById(id);
      if (!appointment) return res.status(404).json({ success: false, error: 'Rezervacija nije pronađena' });
      res.json({ success: true, data: appointment });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getAppointmentsByDate(req, res) {
    try {
      const { date } = req.params;
      const appointments = await Appointment.findByFrizerAndDate(req.query.frizerId || null, date);
      res.json({ success: true, data: appointments });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getAvailableSlots(req, res) {
  try {
    const { serviceId, date, frizerId } = req.query;

    if (!serviceId || !date || !frizerId) {
      return res.status(400).json({ 
        success: false, 
        error: 'serviceId, date i frizerId su obavezni' 
      });
    }

    const slots = await Appointment.getAvailableSlots(
      parseInt(serviceId),
      parseInt(frizerId),
      date
    );

    res.json({ success: true, data: slots });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}


  static async createAppointment(req, res) {
    try {
      const { service_id, date, time, customer_name, phone } = req.body;
      if (!service_id || !date || !time || !customer_name || !phone) {
        return res.status(400).json({ success: false, error: 'Sva polja su obavezna' });
      }
      const appointment = await Appointment.create({ service_id, date, time, customer_name, phone });
      res.status(201).json({ success: true, data: appointment });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async updateAppointment(req, res) {
    try {
      const { id } = req.params;
      const { service_id, date, time, customer_name, phone } = req.body;
      const appointment = await Appointment.update(id, { service_id, date, time, customer_name, phone });
      res.json({ success: true, data: appointment });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async deleteAppointment(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Appointment.delete(id);
      if (!deleted) return res.status(404).json({ success: false, error: 'Rezervacija nije pronađena' });
      res.json({ success: true, message: 'Rezervacija uspješno obrisana' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

export default AppointmentController;
