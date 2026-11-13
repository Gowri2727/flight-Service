// Pure assignment rules. Each function takes the current passengers and
// returns the next passengers plus a result describing what happened.
// Passenger.seatId is the single source of truth for who owns which seat.
import { MIN_PASSENGERS, MAX_PASSENGERS } from "../data/passengers.js";

export function createPassenger(index) {
  return { id: `P${index}`, name: `Passenger ${index}`, seatId: null, mealId: null };
}

export function clampPassengerCount(count) {
  return Math.min(MAX_PASSENGERS, Math.max(MIN_PASSENGERS, Math.round(count)));
}

export function resizePassengers(passengers, requestedCount) {
  const count = clampPassengerCount(requestedCount);
  if (count === passengers.length) return { passengers, removed: [] };
  if (count > passengers.length) {
    const added = Array.from({ length: count - passengers.length }, (_, i) =>
      createPassenger(passengers.length + i + 1)
    );
    return { passengers: [...passengers, ...added], removed: [] };
  }
  return { passengers: passengers.slice(0, count), removed: passengers.slice(count) };
}

export function assignSeat(passengers, activePassengerId, seat) {
  const active = passengers.find((p) => p.id === activePassengerId);
  if (!active || !seat) {
    return { passengers, result: { type: "warn", status: "rejected", message: "Select a passenger first." } };
  }

  if (seat.status === "occupied") {
    return {
      passengers,
      result: { type: "warn", status: "rejected", message: `Seat ${seat.id} is already taken. Choose another seat.` },
    };
  }

  const owner = passengers.find((p) => p.seatId === seat.id);

  if (owner && owner.id !== active.id) {
    return {
      passengers,
      result: {
        type: "warn",
        status: "rejected",
        message: `Seat ${seat.id} is already assigned to ${owner.name}. Pick another seat, or remove it from ${owner.name} first.`,
      },
    };
  }

  // Clicking your own seat again releases it.
  if (owner && owner.id === active.id) {
    return releaseSeat(passengers, active.id);
  }

  const previous = active.seatId;
  return {
    passengers: passengers.map((p) => (p.id === active.id ? { ...p, seatId: seat.id } : p)),
    result: {
      type: "success",
      status: previous ? "changed" : "assigned",
      message: previous
        ? `${active.name} moved from ${previous} to ${seat.id}. Seat ${previous} is free again.`
        : `Seat ${seat.id} assigned to ${active.name}.`,
    },
  };
}

export function releaseSeat(passengers, passengerId) {
  const target = passengers.find((p) => p.id === passengerId);
  if (!target || !target.seatId) {
    return { passengers, result: { type: "info", status: "noop", message: "No seat to remove." } };
  }
  return {
    passengers: passengers.map((p) => (p.id === passengerId ? { ...p, seatId: null } : p)),
    result: {
      type: "info",
      status: "released",
      message: `Seat ${target.seatId} removed from ${target.name}.`,
    },
  };
}

export function setPassengerMeal(passengers, passengerId, mealId) {
  return passengers.map((p) => (p.id === passengerId ? { ...p, mealId: mealId || null } : p));
}

// When the layout changes, keep a seat only if the same seat ID exists in the
// new layout and is not pre-occupied there. Everything else is cleared.
export function reconcileLayout(passengers, nextSeatsById) {
  const cleared = [];
  const next = passengers.map((p) => {
    if (!p.seatId) return p;
    const seat = nextSeatsById.get(p.seatId);
    if (seat && seat.status === "available") return p;
    cleared.push({ passengerName: p.name, seatId: p.seatId });
    return { ...p, seatId: null };
  });
  return { passengers: next, cleared };
}
