import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { appointmentAPI, serviceAPI } from "../services/api";
import "./Admin.css";

export default function Admin() {
  const navigate = useNavigate();

  // Koristimo "Lazy initializer" da pročitamo localStorage samo jednom pri mount-u
  const [user] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterDate, setFilterDate] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // 1. Provjera permisija (samo jednom pri učitavanju)
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [user, navigate]);

  // 2. Učitavanje podataka (samo jednom pri učitavanju)
  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchData();
    }
    // Uklanjamo 'user' iz zavisnosti jer se on neće mijenjati dok smo na ovoj stranici
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      if (appointments.length === 0 && services.length === 0) {
        setLoading(true);
      }
      setError(null);
      
      console.log('📡 Učitavanje podataka...');
      const [appointmentsRes, servicesRes] = await Promise.all([
        appointmentAPI.getAll().catch(err => {
          console.error('❌ Greška pri učitavanju rezervacija:', err);
          return { data: { success: false, error: err.response?.data?.error || err.message } };
        }),
        serviceAPI.getAll().catch(err => {
          console.error('❌ Greška pri učitavanju usluga:', err);
          return { data: { success: false, error: err.response?.data?.error || err.message } };
        })
      ]);

      if (appointmentsRes.data.success) {
        setAppointments(appointmentsRes.data.data || []);
        console.log('✅ Rezervacije učitane:', appointmentsRes.data.data?.length || 0);
      } else {
        console.error('❌ Greška pri učitavanju rezervacija:', appointmentsRes.data.error);
        setError(appointmentsRes.data.error || 'Greška pri učitavanju rezervacija');
      }
      
      if (servicesRes.data.success) {
        setServices(servicesRes.data.data || []);
        console.log('✅ Usluge učitane:', servicesRes.data.data?.length || 0);
      } else {
        console.error('❌ Greška pri učitavanju usluga:', servicesRes.data.error);
        if (!error) {
          setError(servicesRes.data.error || 'Greška pri učitavanju usluga');
        }
      }
    } catch (err) {
      console.error("❌ Greška pri učitavanju podataka:", err);
      setError(err.response?.data?.error || err.message || "Greška pri učitavanju podataka.");
    } finally {
      setLoading(false);
    }
  };

  // Filtriranje rezervacija po datumu
  const filteredAppointments = filterDate
    ? appointments.filter(apt => apt.date === filterDate)
    : appointments;

  // Formatiranje datuma
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("bs-BA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Brisanje rezervacije
  const handleDeleteAppointment = async (id) => {
    if (!window.confirm('Da li ste sigurni da želite obrisati ovu rezervaciju?')) {
      return;
    }

    try {
      await appointmentAPI.delete(id);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Greška pri brisanju rezervacije');
    }
  };

  // Brisanje usluge
  const handleDeleteService = async (id) => {
    if (!window.confirm('Da li ste sigurni da želite obrisati ovu uslugu?')) {
      return;
    }

    try {
      await serviceAPI.delete(id);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Greška pri brisanju usluge');
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Učitavanje podataka...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="admin-container">
        <div className="admin-header">
          <h1 className="admin-title">Admin Panel</h1>
          <p className="admin-subtitle">Upravljanje rezervacijama i uslugama</p>
        </div>

        {/* Tabovi */}
        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            Rezervacije
          </button>
          <button
            className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            Usluge
          </button>
        </div>

        {error && (
          <div className="error-message">
            <span>⚠️</span> {error}
            <button 
              className="btn btn-primary" 
              onClick={fetchData}
              style={{ marginLeft: '12px', marginTop: '8px' }}
            >
              Pokušaj ponovo
            </button>
          </div>
        )}

        {/* Rezervacije tab */}
        {activeTab === 'appointments' && (
          <>
            <div className="admin-filters card">
              <div className="filter-group">
                <label htmlFor="filter-date">Filtriraj po datumu:</label>
                <input
                  id="filter-date"
                  type="date"
                  className="input"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
                {filterDate && (
                  <button
                    className="btn btn-outline"
                    onClick={() => setFilterDate("")}
                    style={{ marginLeft: "12px" }}
                  >
                    Obriši filter
                  </button>
                )}
              </div>
              <div className="stats">
                <div className="stat-item">
                  <span className="stat-label">Ukupno rezervacija:</span>
                  <span className="stat-value">{appointments.length}</span>
                </div>
                {filterDate && (
                  <div className="stat-item">
                    <span className="stat-label">Filtrirano:</span>
                    <span className="stat-value">{filteredAppointments.length}</span>
                  </div>
                )}
              </div>
            </div>

            {filteredAppointments.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📅</div>
                <h2>Nema rezervacija</h2>
                <p>
                  {filterDate
                    ? "Nema rezervacija za odabrani datum."
                    : "Trenutno nema rezervacija."}
                </p>
              </div>
            ) : (
              <div className="appointments-list">
                {filteredAppointments.map((apt) => (
                  <div key={apt.id} className="appointment-card card">
                    <div className="appointment-header">
                      <div className="appointment-service">
                        <span className="service-icon">{apt.service_icon || "💇"}</span>
                        <div>
                          <h3 className="service-name">{apt.service_name || "Nepoznata usluga"}</h3>
                          <p className="appointment-date">📅 {formatDate(apt.date)}</p>
                        </div>
                      </div>
                      <div className="appointment-time">
                        <span className="time-icon">🕐</span>
                        <span className="time-value">{apt.time}</span>
                      </div>
                    </div>
                    <div className="appointment-details">
                      <div className="detail-row">
                        <span className="detail-label">Klijent:</span>
                        <span className="detail-value">{apt.customer_name}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Telefon:</span>
                        <a
                          href={`tel:${apt.phone}`}
                          className="detail-value phone-link"
                        >
                          {apt.phone}
                        </a>
                      </div>
                    </div>
                    <div className="appointment-actions">
                      <button
                        className="btn btn-outline btn-danger"
                        onClick={() => handleDeleteAppointment(apt.id)}
                      >
                        Obriši
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Usluge tab */}
        {activeTab === 'services' && (
          <>
            <div className="admin-actions">
              <button
                className="btn btn-primary"
                onClick={() => {
                  setEditingItem(null);
                  setShowForm(true);
                }}
              >
                + Dodaj novu uslugu
              </button>
            </div>

            {showForm && (
              <ServiceForm
                service={editingItem}
                onClose={() => {
                  setShowForm(false);
                  setEditingItem(null);
                }}
                onSuccess={() => {
                  fetchData();
                  setShowForm(false);
                  setEditingItem(null);
                }}
              />
            )}

            {services.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">💇</div>
                <h2>Nema usluga</h2>
                <p>Dodajte novu uslugu da počnete.</p>
              </div>
            ) : (
              <div className="services-admin-list">
                {services.map((service) => (
                  <div key={service.id} className="service-admin-card card">
                    <div className="service-admin-header">
                      <span className="service-icon-large">{service.icon || "💇"}</span>
                      <div>
                        <h3>{service.name}</h3>
                        <p className="service-description">{service.description}</p>
                      </div>
                    </div>
                    <div className="service-admin-info">
                      <div className="info-item">
                        <span className="info-label">Cijena:</span>
                        <span className="info-value">{service.price} KM</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Trajanje:</span>
                        <span className="info-value">{service.duration} min</span>
                      </div>
                    </div>
                    <div className="service-admin-actions">
                      <button
                        className="btn btn-outline"
                        onClick={() => {
                          setEditingItem(service);
                          setShowForm(true);
                        }}
                      >
                        Uredi
                      </button>
                      <button
                        className="btn btn-outline btn-danger"
                        onClick={() => handleDeleteService(service.id)}
                      >
                        Obriši
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Komponenta za formu usluge
function ServiceForm({ service, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: service?.name || '',
    description: service?.description || '',
    price: service?.price || '',
    duration: service?.duration || '',
    icon: service?.icon || '💇',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (service) {
        // Ažuriranje
        await serviceAPI.update(service.id, formData);
      } else {
        // Kreiranje
        await serviceAPI.create(formData);
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Greška pri čuvanju usluge');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{service ? 'Uredi uslugu' : 'Nova usluga'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              <span>⚠️</span> {error}
            </div>
          )}

          <div className="form-group">
            <label>Naziv usluge *</label>
            <input
              type="text"
              className="input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Opis</label>
            <textarea
              className="input"
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Cijena (KM) *</label>
              <input
                type="number"
                step="0.01"
                className="input"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Trajanje (min) *</label>
              <input
                type="number"
                className="input"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Ikona (emoji)</label>
            <input
              type="text"
              className="input"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              maxLength="2"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Otkaži
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Čuvanje...' : service ? 'Sačuvaj izmjene' : 'Kreiraj uslugu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}