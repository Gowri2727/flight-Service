import { Trash2 } from "lucide-react";
import { formatSeatPrice } from "../utils/pricing.js";

export default function PassengerItem({ passenger, seat, meal, isActive, onSelect, onRemoveSeat }) {
  return (
    <li className={`passenger ${isActive ? "passenger--active" : ""}`}>
      <button
        type="button"
        className="passenger__select"
        aria-current={isActive ? "true" : undefined}
        onClick={() => onSelect(passenger.id)}
      >
        <span className="passenger__avatar" aria-hidden="true">{passenger.id.slice(1)}</span>
        <span className="passenger__info">
          <span className="passenger__name">
            {passenger.name}
            {isActive && <span className="tag">Selecting</span>}
          </span>
          {seat ? (
            <span className="passenger__seat">
              Seat <strong>{seat.id}</strong> · {seat.category} · {formatSeatPrice(seat.price)}
            </span>
          ) : (
            <span className="passenger__seat passenger__seat--none">No seat selected</span>
          )}
          {meal && (
            <span className="passenger__meal">
              Meal: {meal.name} · {formatSeatPrice(meal.price)}
            </span>
          )}
        </span>
      </button>
      {seat && (
        <button
          type="button"
          className="icon-button"
          onClick={() => onRemoveSeat(passenger.id)}
          aria-label={`Remove seat ${seat.id} from ${passenger.name}`}
          title="Remove seat"
        >
          <Trash2 size={16} aria-hidden="true" />
        </button>
      )}
    </li>
  );
}
