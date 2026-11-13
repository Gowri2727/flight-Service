import { formatINR } from "./pricing.js";

// One place that decides how a seat should look and sound.
export function getSeatState(seat, owner, activePassengerId) {
  if (seat.status === "occupied") return "occupied";
  if (owner && owner.id === activePassengerId) return "mine";
  if (owner) return "other";
  return seat.price === 0 ? "free" : "paid";
}

export function getSeatStatusText(state, owner) {
  switch (state) {
    case "occupied":
      return "occupied";
    case "mine":
      return `selected by ${owner.name}`;
    case "other":
      return `assigned to ${owner.name}`;
    default:
      return "available";
  }
}

// Example: "Seat 1C, Extra Legroom, ₹350, available"
export function getSeatAriaLabel(seat, state, owner) {
  const price = seat.price === 0 ? "Free" : formatINR(seat.price);
  return `Seat ${seat.id}, ${seat.category}, ${price}, ${getSeatStatusText(state, owner)}`;
}
