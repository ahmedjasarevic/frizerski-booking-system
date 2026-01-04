import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../services/supabase";

export default function Booking() {
  const [params] = useSearchParams();
  const serviceId = params.get("service");
  const navigate = useNavigate();

  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    if (!date) return;

    supabase
      .rpc("get_available_slots", { p_date: date, p_service: serviceId })
      .then(({ data }) => setSlots(data || []));
  }, [date]);

  const reserve = async () => {
    await supabase.from("appointments").insert([
      {
        service_id: serviceId,
        date,
        time,
        customer_name: name,
        phone,
      },
    ]);

    navigate("/success");
  };

  return (
    <div>
      <h1>Rezervacija</h1>

      <input type='date' onChange={(e) => setDate(e.target.value)} />

      <div>
        {slots.map((s) => (
          <button key={s.slot} onClick={() => setTime(s.slot)}>
            {s.slot}
          </button>
        ))}
      </div>

      <input placeholder='Ime' onChange={(e) => setName(e.target.value)} />
      <input placeholder='Telefon' onChange={(e) => setPhone(e.target.value)} />

      <button onClick={reserve} disabled={!time}>
        Potvrdi
      </button>
    </div>
  );
}
