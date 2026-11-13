import { formatSeatPrice } from "../utils/pricing.js";
import { getSeatState } from "../utils/seatState.js";

export default function SeatDetails({ seat, owner, activePassenger }) {
  if (!seat) {
    return (
      <div className="seat-details seat-details--empty">
        <p>Hover, focus or tap a seat to see its details. Use the arrow keys to move between seats.</p>
      </div>
    );
  }

  const state = getSeatState(seat, owner, activePassenger.id);
  const statusText = {
    occupied: "Occupied. Not available.",
    mine: `Selected by ${owner?.name}. Select it again to remove.`,
    other: `Assigned to ${owner?.name}.`,
    free: `Available. Select to assign to ${activePassenger.name}.`,
    paid: `Available. Select to assign to ${activePassenger.name}.`,
  }[state];

  return (
    <div className={`seat-details seat-details--${state}`}>
      <div>
        <p className="seat-details__title">Seat {seat.id}</p>
        <p className="seat-details__category">{seat.category}</p>
      </div>
      <p className="seat-details__price">{formatSeatPrice(seat.price)}</p>
      <p className="seat-details__status">{statusText}</p>
    </div>
  );
}
