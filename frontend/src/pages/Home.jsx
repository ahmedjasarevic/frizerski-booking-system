import { useEffect, useState } from "react";
import { serviceAPI, frizerAPI } from "../services/api"; // Dodan frizerAPI
import ServiceCard from "../components/ServiceCard";
import "./Home.css";

export default function Home() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [frizers, setFrizers] = useState([]);
  const [selectedFrizer, setSelectedFrizer] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [servicesRes, frizersRes] = await Promise.all([
          serviceAPI.getAll(),
          frizerAPI.getAll()
        ]);

        if (servicesRes.data.success) {
          setServices(servicesRes.data.data || []);
          setFilteredServices(servicesRes.data.data || []);
        } else {
          setError("Greška pri učitavanju usluga.");
        }

        if (frizersRes.data.success) {
          setFrizers(frizersRes.data.data || []);
        } else {
          console.error("Greška pri učitavanju frizera:", frizersRes.data.error);
        }
      } catch (err) {
        console.error("Greška pri učitavanju podataka:", err);
        setError("Greška pri učitavanju podataka. Molimo pokušajte ponovo.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter po frizeru
  useEffect(() => {
    if (!selectedFrizer) {
      setFilteredServices(services);
    } else {
      setFilteredServices(
        services.filter(s => s.frizer_id === parseInt(selectedFrizer))
      );
    }
  }, [selectedFrizer, services]);

  if (loading) {
    return (
      <div className='page-container'>
        <div className='loading-container'>
          <div className='loading-spinner'></div>
          <p>Učitavanje usluga...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='page-container'>
        <div className='error-container'>
          <div className='error-icon'>⚠️</div>
          <h2>Greška</h2>
          <p>{error}</p>
          <button
            className='btn btn-primary'
            onClick={() => window.location.reload()}
          >
            Pokušaj ponovo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='page-container'>
      <div className='home-hero'>
        <h1 className='hero-title'>Dobrodošli u naš salon</h1>
        <p className='hero-subtitle'>
          Izaberite uslugu i rezervišite termin koji vam odgovara
        </p>
      </div>

      {/* Filter po frizerima */}
      <div className='filter-bar card'>
        <label htmlFor='filter-frizer'>Filtriraj po frizeru:</label>
        <select
          id='filter-frizer'
          className='input'
          value={selectedFrizer}
          onChange={e => setSelectedFrizer(e.target.value)}
        >
          <option value=''>Svi frizeri</option>
          {frizers.map(f => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>
      </div>

      {filteredServices.length === 0 ? (
        <div className='empty-state'>
          <div className='empty-icon'>💇‍♀️</div>
          <h2>Trenutno nema dostupnih usluga</h2>
          <p>Molimo provjerite kasnije.</p>
        </div>
      ) : (
        <div className='services-grid'>
          {filteredServices.map(service => {
            const frizer = frizers.find(f => f.id === service.frizer_id);
            return (
              <ServiceCard
                key={service.id}
                service={{
                  ...service,
                  frizer_name: frizer ? frizer.name : "Nepoznat"
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
