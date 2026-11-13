import { MEALS } from "../data/meals.js";
import { formatSeatPrice } from "../utils/pricing.js";

export default function MealSelector({ passenger, onSelectMeal }) {
  return (
    <fieldset className="meals">
      <legend>Meal for {passenger.name} <span className="muted">(optional)</span></legend>
      <p className="muted">Meal selection is independent of seat selection.</p>
      <label className="meal">
        <input
          type="radio"
          name={`meal-${passenger.id}`}
          checked={!passenger.mealId}
          onChange={() => onSelectMeal(passenger.id, null)}
        />
        <span className="meal__face">
          <span className="meal__name">No meal</span>
          <span className="meal__price">₹0</span>
        </span>
      </label>
      {MEALS.map((meal) => (
        <label className="meal" key={meal.id}>
          <input
            type="radio"
            name={`meal-${passenger.id}`}
            checked={passenger.mealId === meal.id}
            onChange={() => onSelectMeal(passenger.id, meal.id)}
          />
          <span className="meal__face">
            <span className="meal__name">
              {meal.name} <span className="meal__diet">{meal.diet}</span>
            </span>
            <span className="meal__desc">{meal.description}</span>
            <span className="meal__price">{formatSeatPrice(meal.price)}</span>
          </span>
        </label>
      ))}
    </fieldset>
  );
}
