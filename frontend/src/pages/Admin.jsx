import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { appointmentAPI, serviceAPI, frizerAPI } from "../services/api"; // frizerAPI koristi tabelu frizers
import "./Admin.css";

export default function Admin() {
  const navigate = useNavigate();

  const [user] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [frizers, setFrizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterDate, setFilterDate] = useState("");
  const [filterFrizer, setFilterFrizer] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Provjera permisija
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [user, navigate]);

  // Učitavanje podataka
  useEffect(() => {
    if (user && user.role === 'admin') fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [appointmentsRes, servicesRes, frizersRes] = await Promise.all([
        appointmentAPI.getAll().catch(err => ({ data: { success: false, error: err.message } })),
        serviceAPI.getAll().catch(err => ({ data: { success: false, error: err.message } })),
        frizerAPI.getAll().catch(err => ({ data: { success: false, error: err.message } }))
      ]);

      if (appointmentsRes.data.success) setAppointments(appointmentsRes.data.data || []);
      else setError(appointmentsRes.data.error);

      if (servicesRes.data.success) setServices(servicesRes.data.data || []);
      else if (!error) setError(servicesRes.data.error);

      if (frizersRes.data.success) setFrizers(frizersRes.data.data || []);
      else console.error("Greška pri učitavanju frizera:", frizersRes.data.error);

    } catch (err) {
      console.error("Greška pri učitavanju podataka:", err);
      setError(err.message || "Greška pri učitavanju podataka.");
    } finally {
      setLoading(false);
    }
  };

  // Filtriranje rezervacija po datumu i frizeru
  const filteredAppointments = appointments.filter(apt => {
    return (!filterDate || apt.date === filterDate) &&
           (!filterFrizer || apt.frizer_id === parseInt(filterFrizer));
  });

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("bs-BA", { year: "numeric", month: "long", day: "numeric" });
  };

  const handleDeleteAppointment = async (id) => {
    if (!window.confirm('Da li ste sigurni da želite obrisati ovu rezervaciju?')) return;
    try { await appointmentAPI.delete(id); fetchData(); }
    catch (err) { alert(err.response?.data?.error || 'Greška pri brisanju rezervacije'); }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Da li ste sigurni da želite obrisati ovu uslugu?')) return;
    try { await serviceAPI.delete(id); fetchData(); }
    catch (err) { alert(err.response?.data?.error || 'Greška pri brisanju usluge'); }
  };

  if (loading) return (
    <div className="page-container">
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Učitavanje podataka...</p>
      </div>
    </div>
  );

  return (
    <div className="page-container">
      <div className="admin-container">
        <div className="admin-header">
          <h1 className="admin-title">Admin Panel</h1>
          <p className="admin-subtitle">Upravljanje rezervacijama i uslugama</p>
        </div>

        {/* Tabovi */}
        <div className="admin-tabs">
          <button className={`tab-btn ${activeTab==='appointments'?'active':''}`} onClick={()=>setActiveTab('appointments')}>Rezervacije</button>
          <button className={`tab-btn ${activeTab==='services'?'active':''}`} onClick={()=>setActiveTab('services')}>Usluge</button>
        </div>

        {error && <div className="error-message"><span>⚠️</span> {error}<button className="btn btn-primary" onClick={fetchData} style={{marginLeft:'12px',marginTop:'8px'}}>Pokušaj ponovo</button></div>}

        {/* Rezervacije tab */}
        {activeTab==='appointments' && (
          <>
            <div className="admin-filters card">
              <div className="filter-group">
                <label htmlFor="filter-date">Filtriraj po datumu:</label>
                <input id="filter-date" type="date" className="input" value={filterDate} onChange={e=>setFilterDate(e.target.value)}/>
                {filterDate && <button className="btn btn-outline" onClick={()=>setFilterDate("")}>Obriši filter</button>}
              </div>
              <div className="filter-group">
                <label htmlFor="filter-frizer">Filtriraj po frizeru:</label>
                <select id="filter-frizer" className="input" value={filterFrizer} onChange={e=>setFilterFrizer(e.target.value)}>
                  <option value="">Svi frizeri</option>
                  {frizers.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              </div>
            </div>

            {filteredAppointments.length===0 ? (
              <div className="empty-state">
                <div className="empty-icon">📅</div>
                <h2>Nema rezervacija</h2>
                <p>{filterDate ? "Nema rezervacija za odabrani datum." : "Trenutno nema rezervacija."}</p>
              </div>
            ) : (
              <div className="appointments-list">
                {filteredAppointments.map(apt=>(
                  <div key={apt.id} className="appointment-card card">
                    <div className="appointment-header">
                      <div className="appointment-service">
                        <span className="service-icon">{apt.service_icon || "💇"}</span>
                        <div>
                          <h3 className="service-name">{apt.service_name || "Nepoznata usluga"}</h3>
                          <p className="appointment-date">📅 {formatDate(apt.date)}</p>
                        </div>
                      </div>
                      <div className="appointment-time"><span className="time-icon">🕐</span><span className="time-value">{apt.time}</span></div>
                    </div>
                    <div className="appointment-details">
                      <div className="detail-row"><span className="detail-label">Klijent:</span><span className="detail-value">{apt.customer_name}</span></div>
                      <div className="detail-row"><span className="detail-label">Telefon:</span><a href={`tel:${apt.phone}`} className="detail-value phone-link">{apt.phone}</a></div>
                      <div className="detail-row"><span className="detail-label">Frizer:</span><span className="detail-value">{apt.frizer_name || "Nepoznat"}</span></div>
                    </div>
                    <div className="appointment-actions">
                      <button className="btn btn-outline btn-danger" onClick={()=>handleDeleteAppointment(apt.id)}>Obriši</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Usluge tab */}
        {activeTab==='services' && (
          <>
            <div className="admin-actions">
              <button className="btn btn-primary" onClick={()=>{setEditingItem(null); setShowForm(true)}}>+ Dodaj novu uslugu</button>
            </div>

            {showForm && <ServiceForm service={editingItem} onClose={()=>{setShowForm(false); setEditingItem(null)}} onSuccess={()=>{fetchData(); setShowForm(false); setEditingItem(null)}} frizers={frizers}/>}

            {services.length===0 ? (
              <div className="empty-state">
                <div className="empty-icon">💇</div>
                <h2>Nema usluga</h2>
                <p>Dodajte novu uslugu da počnete.</p>
              </div>
            ) : (
              <div className="services-admin-list">
                {services.map(service => (
                  <div key={service.id} className="service-admin-card card">
                    <div className="service-admin-header">
                      <span className="service-icon-large">{service.icon || "💇"}</span>
                      <div>
                        <h3>{service.name}</h3>
                        <p className="service-description">{service.description}</p>
                      </div>
                    </div>
                    <div className="service-admin-info">
                      <div className="info-item"><span className="info-label">Cijena:</span><span className="info-value">{service.price} KM</span></div>
                      <div className="info-item"><span className="info-label">Trajanje:</span><span className="info-value">{service.duration} min</span></div>
                      <div className="info-item"><span className="info-label">Frizer:</span><span className="info-value">{frizers.find(f=>f.id===service.frizer_id)?.name || 'Nepoznat'}</span></div>
                    </div>
                    <div className="service-admin-actions">
                      <button className="btn btn-outline" onClick={()=>{setEditingItem(service); setShowForm(true)}}>Uredi</button>
                      <button className="btn btn-outline btn-danger" onClick={()=>handleDeleteService(service.id)}>Obriši</button>
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

// Form za dodavanje/uređivanje usluge
function ServiceForm({ service, onClose, onSuccess, frizers }) {
  const [formData, setFormData] = useState({
    name: service?.name || '',
    description: service?.description || '',
    price: service?.price || '',
    duration: service?.duration || '',
    icon: service?.icon || '💇',
    frizer_id: service?.frizer_id || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const payload = {
      ...formData,
      duration: Number(formData.duration), // <-- OBAVEZNO
      price: Number(formData.price),       // i cijena ako je decimal
      barber_id: Number(formData.barber_id) // frizer također broj
    };

    if (service) await serviceAPI.update(service.id, payload);
    else await serviceAPI.create(payload);

    onSuccess();
  } catch(err) {
    setError(err.response?.data?.error || 'Greška pri čuvanju usluge');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content card" onClick={e=>e.stopPropagation()}>
        <div className="modal-header">
          <h2>{service?'Uredi uslugu':'Nova usluga'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message"><span>⚠️</span> {error}</div>}

          <div className="form-group">
            <label>Naziv usluge *</label>
            <input type="text" className="input" value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} required/>
          </div>

          <div className="form-group">
            <label>Opis</label>
            <textarea className="input" rows="3" value={formData.description} onChange={e=>setFormData({...formData, description:e.target.value})}/>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Cijena (KM) *</label>
              <input type="number" step="0.01" className="input" value={formData.price} onChange={e=>setFormData({...formData, price:e.target.value})} required/>
            </div>
            <div className="form-group">
              <label>Trajanje (min) *</label>
              <input type="number" className="input" value={formData.duration} onChange={e=>setFormData({...formData, duration:e.target.value})} required/>
            </div>
          </div>

          <div className="form-group">
            <label>Ikona (emoji)</label>
            <input type="text" className="input" value={formData.icon} onChange={e=>setFormData({...formData, icon:e.target.value})} maxLength="2"/>
          </div>

          <div className="form-group">
            <label>Frizer *</label>
            <select className="input" value={formData.frizer_id} onChange={e=>setFormData({...formData, frizer_id:e.target.value})} required>
              <option value="">Izaberite frizera</option>
              {frizers.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>Otkaži</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading?'Čuvanje...':(service?'Sačuvaj izmjene':'Kreiraj uslugu')}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
