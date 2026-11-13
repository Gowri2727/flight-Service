export function formatINR(amount) {
  return `₹${Number(amount).toLocaleString("en-IN")}`;
}

export function formatSeatPrice(price) {
  return price === 0 ? "Free" : formatINR(price);
}

export function getSeatPrice(passenger, seatsById) {
  if (!passenger.seatId) return 0;
  return seatsById.get(passenger.seatId)?.price ?? 0;
}

export function getMealPrice(passenger, mealsById) {
  if (!passenger.mealId) return 0;
  return mealsById.get(passenger.mealId)?.price ?? 0;
}

export function getSeatTotal(passengers, seatsById) {
  return passengers.reduce((sum, p) => sum + getSeatPrice(p, seatsById), 0);
}

export function getMealTotal(passengers, mealsById) {
  return passengers.reduce((sum, p) => sum + getMealPrice(p, mealsById), 0);
}

export function getGrandTotal(passengers, seatsById, mealsById) {
  return getSeatTotal(passengers, seatsById) + getMealTotal(passengers, mealsById);
}
