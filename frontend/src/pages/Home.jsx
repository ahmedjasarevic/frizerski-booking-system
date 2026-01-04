import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    supabase
      .from("services")
      .select("*")
      .then(({ data }) => setServices(data));
  }, []);

  return (
    <div>
      <h1>Izaberite uslugu</h1>
      {services.map((s) => (
        <div key={s.id}>
          <h3>{s.name}</h3>
          <button onClick={() => navigate(`/booking?service=${s.id}`)}>
            Rezerviši
          </button>
        </div>
      ))}
    </div>
  );
}
