import { Minus, Plus } from "lucide-react";
import { MAX_PASSENGERS, MIN_PASSENGERS } from "../data/passengers.js";
import MealSelector from "./MealSelector.jsx";
import PassengerItem from "./PassengerItem.jsx";

export default function PassengerPanel({ selection }) {
  const {
    passengers, activePassenger, seatsById, mealsById,
    changePassengerCount, selectPassenger, removeSeat, selectMeal,
  } = selection;

  return (
    <section className="panel" aria-labelledby="passengers-title">
      <div className="panel__head">
        <h2 id="passengers-title">Passengers</h2>
      </div>

      <div className="stepper">
        <div>
          <p className="stepper__label" id="count-label">Number of passengers</p>
          <p className="muted">Choose {MIN_PASSENGERS} to {MAX_PASSENGERS}</p>
        </div>
        <div className="stepper__controls" role="group" aria-labelledby="count-label">
          <button
            type="button"
            className="icon-button icon-button--outline"
            onClick={() => changePassengerCount(passengers.length - 1)}
            disabled={passengers.length <= MIN_PASSENGERS}
            aria-label="Remove a passenger"
          >
            <Minus size={16} aria-hidden="true" />
          </button>
          <output className="stepper__value" aria-live="polite">{passengers.length}</output>
          <button
            type="button"
            className="icon-button icon-button--outline"
            onClick={() => changePassengerCount(passengers.length + 1)}
            disabled={passengers.length >= MAX_PASSENGERS}
            aria-label="Add a passenger"
          >
            <Plus size={16} aria-hidden="true" />
          </button>
        </div>
      </div>

      <ul className="passenger-list">
        {passengers.map((passenger) => (
          <PassengerItem
            key={passenger.id}
            passenger={passenger}
            seat={seatsById.get(passenger.seatId)}
            meal={mealsById.get(passenger.mealId)}
            isActive={passenger.id === activePassenger.id}
            onSelect={selectPassenger}
            onRemoveSeat={removeSeat}
          />
        ))}
      </ul>

      <MealSelector passenger={activePassenger} onSelectMeal={selectMeal} />
    </section>
  );
}
