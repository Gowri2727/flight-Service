import { formatINR } from "../utils/pricing.js";

// Compact bar for tablet/mobile so the active passenger and total stay in view.
export default function SummaryBar({ activePassenger, seat, grandTotal }) {
  return (
    <div className="summary-bar">
      <div className="summary-bar__who">
        <p className="summary-bar__name">{activePassenger.name}</p>
        <p className="summary-bar__seat">{seat ? `Seat ${seat.id}` : "No seat yet"}</p>
      </div>
      <div className="summary-bar__total">
        <p className="summary-bar__label">Total</p>
        <p className="summary-bar__amount">{formatINR(grandTotal)}</p>
      </div>
      <a className="button" href="#summary">View summary</a>
    </div>
  );
}
