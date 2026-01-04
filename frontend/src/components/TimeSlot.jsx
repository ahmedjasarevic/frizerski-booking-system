import "./TimeSlot.css";

export default function TimeSlot({ slot, isSelected, isBooked, onClick }) {
  if (isBooked) {
    return (
      <button className="time-slot time-slot-booked" disabled>
        {slot}
        <span className="booked-badge">Zauzeto</span>
      </button>
    );
  }

  return (
    <button
      className={`time-slot ${isSelected ? "time-slot-selected" : ""}`}
      onClick={onClick}
    >
      {slot}
    </button>
  );
}
