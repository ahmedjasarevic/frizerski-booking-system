import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export default function Admin() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    supabase
      .from("appointments")
      .select("*")
      .then(({ data }) => setAppointments(data));
  }, []);

  return (
    <div>
      <h1>Rezervacije</h1>
      {appointments.map((a) => (
        <div key={a.id}>
          {a.date} {a.time} – {a.customer_name}
        </div>
      ))}
    </div>
  );
}
