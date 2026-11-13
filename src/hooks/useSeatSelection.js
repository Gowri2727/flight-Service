import { useCallback, useMemo, useState } from "react";
import { INITIAL_PASSENGER_COUNT } from "../data/passengers.js";
import { MEALS } from "../data/meals.js";
import {
  assignSeat,
  createPassenger,
  reconcileLayout,
  releaseSeat,
  resizePassengers,
  setPassengerMeal,
} from "../utils/assignment.js";
import { getGrandTotal, getMealTotal, getSeatTotal } from "../utils/pricing.js";
import { LAYOUT_IDS, SEAT_INVENTORY, layoutDefinitions } from "../utils/seatLayout.js";

const MEALS_BY_ID = new Map(MEALS.map((meal) => [meal.id, meal]));

function joinNames(items) {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

export function useSeatSelection() {
  const [passengers, setPassengers] = useState(() =>
    Array.from({ length: INITIAL_PASSENGER_COUNT }, (_, i) => createPassenger(i + 1))
  );
  const [activePassengerId, setActivePassengerId] = useState("P1");
  const [layout, setLayout] = useState(LAYOUT_IDS[0]);
  const [notice, setNotice] = useState(null);

  const showNotice = useCallback((type, message) => {
    setNotice({ id: `${Date.now()}-${Math.random()}`, type, message });
  }, []);
  const dismissNotice = useCallback(() => setNotice(null), []);

  const { seatsById, rows } = SEAT_INVENTORY[layout];

  // seatId -> passenger who owns it (derived, never stored separately)
  const ownerBySeatId = useMemo(() => {
    const map = new Map();
    passengers.forEach((p) => p.seatId && map.set(p.seatId, p));
    return map;
  }, [passengers]);

  const activePassenger = passengers.find((p) => p.id === activePassengerId) ?? passengers[0];

  const seatTotal = getSeatTotal(passengers, seatsById);
  const mealTotal = getMealTotal(passengers, MEALS_BY_ID);
  const grandTotal = getGrandTotal(passengers, seatsById, MEALS_BY_ID);
  const assignedCount = passengers.filter((p) => p.seatId).length;

  const changePassengerCount = useCallback(
    (nextCount) => {
      const { passengers: next, removed } = resizePassengers(passengers, nextCount);
      if (next === passengers) return;
      setPassengers(next);
      if (!next.some((p) => p.id === activePassengerId)) setActivePassengerId(next[0].id);
      if (removed.length > 0) {
        const parts = removed.map((p) =>
          p.seatId ? `${p.name} (seat ${p.seatId} released)` : p.name
        );
        showNotice("info", `Removed ${joinNames(parts)}.`);
      } else {
        setNotice(null);
      }
    },
    [passengers, activePassengerId, showNotice]
  );

  const selectPassenger = useCallback((id) => setActivePassengerId(id), []);

  const selectSeat = useCallback(
    (seatId) => {
      const { passengers: next, result } = assignSeat(passengers, activePassengerId, seatsById.get(seatId));
      if (next !== passengers) setPassengers(next);
      showNotice(result.type, result.message);
    },
    [passengers, activePassengerId, seatsById, showNotice]
  );

  const removeSeat = useCallback(
    (passengerId) => {
      const { passengers: next, result } = releaseSeat(passengers, passengerId);
      if (next !== passengers) setPassengers(next);
      showNotice(result.type, result.message);
    },
    [passengers, showNotice]
  );

  const selectMeal = useCallback((passengerId, mealId) => {
    setPassengers((prev) => setPassengerMeal(prev, passengerId, mealId));
  }, []);

  const changeLayout = useCallback(
    (nextLayout) => {
      if (nextLayout === layout) return;
      const { passengers: next, cleared } = reconcileLayout(passengers, SEAT_INVENTORY[nextLayout].seatsById);
      const label = layoutDefinitions[nextLayout].label;
      setLayout(nextLayout);
      setPassengers(next);
      if (cleared.length > 0) {
        const parts = cleared.map((c) => `${c.passengerName}'s seat ${c.seatId}`);
        showNotice("warn", `Switched to ${label}. ${joinNames(parts)} is not available in this layout, so ${cleared.length > 1 ? "they were" : "it was"} cleared.`);
      } else {
        showNotice("info", `Switched to ${label}.${next.some((p) => p.seatId) ? " Existing seats were kept." : ""}`);
      }
    },
    [layout, passengers, showNotice]
  );

  return {
    passengers,
    activePassenger,
    layout,
    rows,
    seatsById,
    ownerBySeatId,
    mealsById: MEALS_BY_ID,
    assignedCount,
    seatTotal,
    mealTotal,
    grandTotal,
    notice,
    dismissNotice,
    changePassengerCount,
    selectPassenger,
    selectSeat,
    removeSeat,
    selectMeal,
    changeLayout,
  };
}
