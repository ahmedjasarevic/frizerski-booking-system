import { useLocation, useNavigate, Link } from "react-router-dom";
import "./Success.css";

export default function Success() {
  const location = useLocation();
  const navigate = useNavigate();
  const { service, date, time, name } = location.state || {};

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("bs-BA", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="page-container">
      <div className="success-container">
        <div className="success-card card fade-in">
          <div className="success-icon">✅</div>
          <h1 className="success-title">Rezervacija uspješna!</h1>
          <p className="success-message">
            Vaš termin je uspješno rezervisan. Očekujemo vas!
          </p>

          {service && date && time && (
            <div className="booking-details">
              <h2>Detalji rezervacije</h2>
              <div className="detail-item">
                <span className="detail-label">Usluga:</span>
                <span className="detail-value">{service}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Datum:</span>
                <span className="detail-value">{formatDate(date)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Vrijeme:</span>
                <span className="detail-value">{time}</span>
              </div>
              {name && (
                <div className="detail-item">
                  <span className="detail-label">Ime:</span>
                  <span className="detail-value">{name}</span>
                </div>
              )}
            </div>
          )}

          <div className="success-actions">
            <Link to="/" className="btn btn-primary">
              Nazad na početnu
            </Link>
            <button
              className="btn btn-outline"
              onClick={() => navigate("/booking", { replace: true })}
            >
              Nova rezervacija
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}