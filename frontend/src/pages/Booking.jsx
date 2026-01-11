import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { serviceAPI, appointmentAPI, verifyAPI } from "../services/api";
import TimeSlot from "../components/TimeSlot";
import "./Booking.css";

const TIME_SLOTS = [
  "09:00","09:30","10:00","10:30","11:00","11:30",
  "12:00","12:30","13:00","13:30","14:00","14:30",
  "15:00","15:30","16:00","16:30","17:00","17:30"
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
  const [occupiedSlots, setOccupiedSlots] = useState([]); // Novo
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [loadingService, setLoadingService] = useState(true);

  // Twilio verification states
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [phoneSent, setPhoneSent] = useState("");
  const frizerId = service?.frizer_id; 
  // Minimum date today
  const today = new Date().toISOString().split("T")[0];

  // Fetch service info
  useEffect(() => {
    if (!serviceId) {
      navigate("/");
      return;
    }

    const fetchService = async () => {
      try {
        const response = await serviceAPI.getById(serviceId);
        if (response.data.success) setService(response.data.data);
        else setError("Usluga nije pronađena.");
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
  if (!date || !serviceId || !service) {
    setAvailableSlots([]);
    return;
  }

  const fetchAvailableSlots = async () => {
    try {
      setLoading(true);
      const frizerId = service.frizer_id;

      console.log("📅 Fetching available slots...");
      console.log("serviceId:", serviceId);
      console.log("frizerId:", frizerId);
      console.log("date:", date);

      const response = await appointmentAPI.getAvailableSlots(
        serviceId,
        frizerId,
        date
      );

      console.log("✅ API response:", response.data);

     if (response.data.success) {
  setAvailableSlots(response.data.data.freeSlots || []);
  setOccupiedSlots(response.data.data.occupiedSlots || []); // Novo
}
    } catch (err) {
      console.error("Error fetching available slots:", err);
      setError("Greška pri učitavanju termina.");
    } finally {
      setLoading(false);
    }
  };

  fetchAvailableSlots();
}, [date, serviceId, service]);

  // Submit booking → send verification code
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
      // Send verification code via verifyAPI
      await verifyAPI.sendCode(phone.trim());

      setPhoneSent(phone.trim());
      setShowCodeModal(true);
    } catch (err) {
      console.error("Error sending verification code:", err);
      setError(err.response?.data?.error || "Greška pri slanju verifikacijskog koda");
    } finally {
      setSubmitting(false);
    }
  };

  // Verify code and create appointment
   const handleVerifyCode = async () => {
    if (!verificationCode.trim()) return;

    try {
      const res = await verifyAPI.verifyCode(phoneSent, verificationCode.trim());
      if (res.data.success) {
        await appointmentAPI.create({
          service_id: parseInt(serviceId),
          frizer_id: parseInt(selectedFrizer),
          date,
          time: selectedTime,
          customer_name: name.trim(),
          phone: phoneSent,
        });

        alert("✅ Termin uspješno rezervisan!");
        setShowCodeModal(false);
        setVerificationCode("");
        setName("");
        setPhone("");
        setDate("");
        setSelectedTime("");
        setSelectedFrizer("");
        setAvailableSlots([]);
      }
    } catch (err) {
      console.error("Error verifying code:", err);
      setError(err.response?.data?.error || "❌ Neispravan kod");
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
          <button className="btn btn-primary" onClick={() => navigate("/")}>Nazad na početnu</button>
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
          {error && <div className="error-message"><span>⚠️</span> {error}</div>}

          <div className="form-group">
            <label htmlFor="date">Datum *</label>
            <input
              id="date"
              type="date"
              className="input"
              value={date}
              min={today}
              onChange={(e) => {
                 console.log("Odabrani datum:", e.target.value);
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
                    const isFree = availableSlots.includes(slot);
                    const isOccupied = occupiedSlots.includes(slot);
                    return (
                    <TimeSlot
      key={slot}
      slot={slot}
      isSelected={selectedTime === slot}
      // "Zauzeto" je samo ono što je u occupiedSlots
      isBooked={isOccupied} 
      // Dugme je isključeno ako nije slobodno (bilo da je zauzeto ili nema mjesta)
      disabled={!isFree} 
      onClick={() => isFree && setSelectedTime(slot)}
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
            ) : "Potvrdi rezervaciju"}
          </button>
        </form>

        {/* ======== Verification Code Modal ======== */}
        {showCodeModal && (
          <div className="modal-overlay">
            <div className="modal-content card">
              <h3>Unesite verifikacijski kod</h3>
              <p>Poslali smo kod na broj: {phoneSent}</p>
              <input
                type="text"
                placeholder="Unesite kod"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
              <div className="modal-actions">
                <button className="btn btn-outline" onClick={() => setShowCodeModal(false)}>Otkaži</button>
                <button className="btn btn-primary" onClick={handleVerifyCode}>Potvrdi</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
