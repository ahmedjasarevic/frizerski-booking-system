import { useNavigate } from "react-router-dom";
import "./ServiceCard.css";

export default function ServiceCard({ service }) {
  const navigate = useNavigate();

  const handleBook = () => {
    navigate(`/booking?service=${service.id}`);
  };

  return (
    <div className="service-card card fade-in">
      <div className="service-icon">{service.icon || "💇"}</div>
      <h3 className="service-name">{service.name}</h3>
      {service.description && (
        <p className="service-description">{service.description}</p>
      )}
      {service.price && (
        <div className="service-price">{service.price} KM</div>
      )}
      {service.duration && (
        <div className="service-duration">⏱️ {service.duration} min</div>
      )}
      <button className="btn btn-primary service-btn" onClick={handleBook}>
        Rezerviši termin
      </button>
    </div>
  );
}
