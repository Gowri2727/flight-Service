import { formatINR, formatSeatPrice } from "../utils/pricing.js";

export default function BookingSummary({ selection }) {
  const { passengers, seatsById, mealsById, seatTotal, mealTotal, grandTotal } = selection;
  const hasSelection = passengers.some((p) => p.seatId || p.mealId);

  return (
    <section className="panel summary" id="summary" aria-labelledby="summary-title">
      <div className="panel__head">
        <h2 id="summary-title">Your selection</h2>
      </div>

      {hasSelection ? (
        <ul className="summary__list">
          {passengers.map((p) => {
            const seat = seatsById.get(p.seatId);
            const meal = mealsById.get(p.mealId);
            return (
              <li key={p.id} className="summary__item">
                <p className="summary__name">{p.name}</p>
                <dl>
                  <div>
                    <dt>{seat ? `Seat ${seat.id}` : "Seat"}</dt>
                    <dd>{seat ? `${seat.category} · ${formatSeatPrice(seat.price)}` : "Not selected"}</dd>
                  </div>
                  <div>
                    <dt>Meal</dt>
                    <dd>{meal ? `${meal.name} · ${formatSeatPrice(meal.price)}` : "Not selected"}</dd>
                  </div>
                </dl>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="empty">
          <p className="empty__title">No seats selected yet</p>
          <p className="muted">Pick a passenger, then choose a seat on the cabin map. Your charges appear here.</p>
        </div>
      )}

      <dl className="totals" aria-live="polite" aria-atomic="true">
        <div><dt>Seat subtotal</dt><dd>{formatINR(seatTotal)}</dd></div>
        <div><dt>Meal subtotal</dt><dd>{formatINR(mealTotal)}</dd></div>
        <div className="totals__grand"><dt>Total</dt><dd>{formatINR(grandTotal)}</dd></div>
      </dl>
      <p className="muted summary__note">Prototype with mock data. Nothing is booked or charged.</p>
    </section>
  );
}
