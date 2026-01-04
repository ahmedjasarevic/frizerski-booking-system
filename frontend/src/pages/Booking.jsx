import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { serviceAPI, appointmentAPI } from "../services/api";
import TimeSlot from "../components/TimeSlot";
import "./Booking.css";

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
];

export default function Booking() {
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("service");
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [date, setDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [loadingService, setLoadingService] = useState(true);

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!serviceId) {
      navigate("/");
      return;
    }

    const fetchService = async () => {
      try {
        const response = await serviceAPI.getById(serviceId);
        
        if (response.data.success) {
          setService(response.data.data);
        } else {
          setError("Usluga nije pronađena.");
        }
      } catch (err) {
        console.error("Error fetching service:", err);
        setError("Greška pri učitavanju usluge.");
      } finally {
        setLoadingService(false);
      }
    };

    fetchService();
  }, [serviceId, navigate]);

  useEffect(() => {
    if (!date || !serviceId) {
      setAvailableSlots([]);
      return;
    }

    const fetchAvailableSlots = async () => {
      try {
        setLoading(true);
        const response = await appointmentAPI.getAvailableSlots(serviceId, date);
        
        if (response.data.success) {
          setAvailableSlots(response.data.data || []);
        }
      } catch (err) {
        console.error("Error fetching available slots:", err);
        setError("Greška pri učitavanju termina.");
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableSlots();
  }, [date, serviceId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !phone.trim()) {
      setError("Molimo unesite ime i broj telefona.");
      return;
    }

    if (!selectedTime) {
      setError("Molimo odaberite vrijeme.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await appointmentAPI.create({
        service_id: parseInt(serviceId),
        date,
        time: selectedTime,
        customer_name: name.trim(),
        phone: phone.trim(),
      });

      if (response.data.success) {
        navigate("/success", {
          state: {
            service: service?.name,
            date,
            time: selectedTime,
            name: name.trim(),
          },
        });
      }
    } catch (err) {
      console.error("Error creating appointment:", err);
      setError(err.response?.data?.error || "Greška pri rezervaciji. Molimo pokušajte ponovo.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingService) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Učitavanje...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="page-container">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Usluga nije pronađena</h2>
          <button className="btn btn-primary" onClick={() => navigate("/")}>
            Nazad na početnu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="booking-container">
        <div className="booking-header">
          <h1 className="booking-title">Rezervacija termina</h1>
          <div className="service-info-card card">
            <div className="service-info-icon">{service.icon || "💇"}</div>
            <h2>{service.name}</h2>
            {service.price && <p className="service-info-price">{service.price} KM</p>}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="booking-form card">
          {error && (
            <div className="error-message">
              <span>⚠️</span> {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="date">Datum *</label>
            <input
              id="date"
              type="date"
              className="input"
              value={date}
              min={today}
              onChange={(e) => {
                setDate(e.target.value);
                setSelectedTime("");
              }}
              required
            />
          </div>

          {date && (
            <div className="form-group">
              <label>Vrijeme *</label>
              <div className="time-slots-grid">
                {loading ? (
                  <div className="loading-time-slots">Učitavanje...</div>
                ) : (
                  TIME_SLOTS.map((slot) => {
                    const isAvailable = availableSlots.includes(slot);
                    return (
                      <TimeSlot
                        key={slot}
                        slot={slot}
                        isSelected={selectedTime === slot}
                        isBooked={!isAvailable}
                        onClick={() => isAvailable && setSelectedTime(slot)}
                      />
                    );
                  })
                )}
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name">Ime i prezime *</label>
            <input
              id="name"
              type="text"
              className="input"
              placeholder="Unesite vaše ime i prezime"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Broj telefona *</label>
            <input
              id="phone"
              type="tel"
              className="input"
              placeholder="Unesite broj telefona"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-submit"
            disabled={submitting || !date || !selectedTime}
          >
            {submitting ? (
              <>
                <span className="loading"></span>
                Rezervisanje...
              </>
            ) : (
              "Potvrdi rezervaciju"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}