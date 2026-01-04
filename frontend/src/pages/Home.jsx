import { useEffect, useState } from "react";
import { serviceAPI } from "../services/api";
import ServiceCard from "../components/ServiceCard";
import "./Home.css";

export default function Home() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await serviceAPI.getAll();
        
        if (response.data.success) {
          setServices(response.data.data || []);
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Greška pri učitavanju usluga. Molimo pokušajte ponovo.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Učitavanje usluga...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Greška</h2>
          <p>{error}</p>
          <button
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Pokušaj ponovo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="home-hero">
        <h1 className="hero-title">Dobrodošli u naš salon</h1>
        <p className="hero-subtitle">
          Izaberite uslugu i rezervišite termin koji vam odgovara
        </p>
      </div>

      {services.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💇‍♀️</div>
          <h2>Trenutno nema dostupnih usluga</h2>
          <p>Molimo provjerite kasnije.</p>
        </div>
      ) : (
        <div className="services-grid">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}