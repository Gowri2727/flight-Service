import { describe, expect, it } from "vitest";
import { assignSeat, createPassenger, reconcileLayout, releaseSeat, resizePassengers, setPassengerMeal } from "./assignment.js";
import { getGrandTotal, getMealTotal, getSeatTotal } from "./pricing.js";
import { SEAT_INVENTORY, layoutDefinitions } from "./seatLayout.js";

const twoPassengers = () => [createPassenger(1), createPassenger(2)];
const seats32 = SEAT_INVENTORY["3-2"].seatsById;

describe("seat inventory", () => {
  it("matches the sample prices from the assessment brief", () => {
    const expected = { "1A": 0, "1B": 0, "1C": 350, "1D": 0, "1E": 250, "2A": 350, "2B": 0 };
    Object.entries(expected).forEach(([id, price]) => expect(seats32.get(id).price).toBe(price));
  });

  it("builds the right seats per row for each layout", () => {
    expect(layoutDefinitions["3-2"].groups.flat()).toEqual(["A", "B", "C", "D", "E"]);
    expect(layoutDefinitions["2-3-2"].groups.flat()).toEqual(["A", "B", "D", "E", "F", "G", "H"]);
    expect(SEAT_INVENTORY["3-2"].rows[0].groups.map((g) => g.length)).toEqual([3, 2]);
    expect(SEAT_INVENTORY["2-3-2"].rows[0].groups.map((g) => g.length)).toEqual([2, 3, 2]);
  });

  it("has free, paid and occupied seats in both layouts", () => {
    Object.values(SEAT_INVENTORY).forEach(({ seats }) => {
      expect(seats.some((s) => s.price === 0 && s.status === "available")).toBe(true);
      expect(seats.some((s) => s.price > 0 && s.status === "available")).toBe(true);
      expect(seats.some((s) => s.status === "occupied")).toBe(true);
    });
  });
});

describe("assignSeat", () => {
  it("assigns a free seat and a paid seat", () => {
    let { passengers } = assignSeat(twoPassengers(), "P1", seats32.get("1A"));
    expect(passengers[0].seatId).toBe("1A");
    ({ passengers } = assignSeat(passengers, "P2", seats32.get("1C")));
    expect(passengers[1].seatId).toBe("1C");
    expect(getSeatTotal(passengers, seats32)).toBe(350);
  });

  it("rejects occupied seats", () => {
    const start = twoPassengers();
    const { passengers, result } = assignSeat(start, "P1", seats32.get("1B"));
    expect(result.status).toBe("rejected");
    expect(passengers).toBe(start);
  });

  it("rejects a seat owned by another passenger", () => {
    let { passengers } = assignSeat(twoPassengers(), "P1", seats32.get("1A"));
    const out = assignSeat(passengers, "P2", seats32.get("1A"));
    expect(out.result.status).toBe("rejected");
    expect(out.passengers[1].seatId).toBeNull();
  });

  it("keeps one seat per passenger and frees the old seat on change", () => {
    let { passengers } = assignSeat(twoPassengers(), "P1", seats32.get("1A"));
    ({ passengers } = assignSeat(passengers, "P1", seats32.get("1C")));
    expect(passengers[0].seatId).toBe("1C");
    expect(passengers.filter((p) => p.seatId === "1A")).toHaveLength(0);
    const out = assignSeat(passengers, "P2", seats32.get("1A"));
    expect(out.passengers[1].seatId).toBe("1A");
  });

  it("releases the seat when the owner selects it again", () => {
    let { passengers } = assignSeat(twoPassengers(), "P1", seats32.get("1A"));
    ({ passengers } = assignSeat(passengers, "P1", seats32.get("1A")));
    expect(passengers[0].seatId).toBeNull();
  });
});

describe("releaseSeat", () => {
  it("clears only the chosen passenger", () => {
    let { passengers } = assignSeat(twoPassengers(), "P1", seats32.get("1A"));
    ({ passengers } = assignSeat(passengers, "P2", seats32.get("1D")));
    ({ passengers } = releaseSeat(passengers, "P1"));
    expect(passengers.map((p) => p.seatId)).toEqual([null, "1D"]);
  });

  it("preserves the passenger's meal when releasing their seat", () => {
    let { passengers } = assignSeat(twoPassengers(), "P1", seats32.get("1A"));
    passengers = setPassengerMeal(passengers, "P1", "veg-thali");
    ({ passengers } = releaseSeat(passengers, "P1"));
    expect(passengers[0]).toMatchObject({ seatId: null, mealId: "veg-thali" });
  });
});

describe("resizePassengers", () => {
  it("adds passengers, clamps to 1-6, and reports removed ones", () => {
    let { passengers } = resizePassengers(twoPassengers(), 4);
    expect(passengers).toHaveLength(4);
    expect(resizePassengers(passengers, 99).passengers).toHaveLength(6);
    expect(resizePassengers(passengers, 0).passengers).toHaveLength(1);
  });

  it("drops excess passengers together with their seats", () => {
    let { passengers } = resizePassengers(twoPassengers(), 3);
    ({ passengers } = assignSeat(passengers, "P3", seats32.get("1A")));
    const out = resizePassengers(passengers, 2);
    expect(out.removed.map((p) => p.seatId)).toEqual(["1A"]);
    expect(out.passengers.some((p) => p.seatId === "1A")).toBe(false);
  });

  it("removes a dropped passenger's meal together with the passenger", () => {
    let { passengers } = resizePassengers(twoPassengers(), 2);
    passengers = setPassengerMeal(passengers, "P2", "veg-thali");
    const out = resizePassengers(passengers, 1);
    expect(out.removed).toEqual([expect.objectContaining({ id: "P2", mealId: "veg-thali" })]);
    expect(out.passengers).toEqual([expect.objectContaining({ id: "P1", mealId: null })]);
  });
});

describe("reconcileLayout", () => {
  it("keeps seats that exist in the new layout and clears the rest", () => {
    let { passengers } = assignSeat(twoPassengers(), "P1", seats32.get("1C"));
    ({ passengers } = assignSeat(passengers, "P2", seats32.get("1A")));
    const out = reconcileLayout(passengers, SEAT_INVENTORY["2-3-2"].seatsById);
    expect(out.passengers.map((p) => p.seatId)).toEqual([null, "1A"]);
    expect(out.cleared).toEqual([{ passengerName: "Passenger 1", seatId: "1C" }]);
  });

  it("clears a seat that is pre-occupied in the new layout", () => {
    // 1F does not exist in 3-2; 2A is occupied in 2-3-2 but free in 3-2 (extra legroom).
    let { passengers } = assignSeat(twoPassengers(), "P1", seats32.get("2A"));
    const out = reconcileLayout(passengers, SEAT_INVENTORY["2-3-2"].seatsById);
    expect(out.passengers[0].seatId).toBeNull();
  });
});

describe("pricing", () => {
  it("is zero with no seats and sums seat and meal charges", () => {
    const meals = new Map([["m", { id: "m", price: 180 }]]);
    const empty = twoPassengers();
    expect(getGrandTotal(empty, seats32, meals)).toBe(0);
    let { passengers } = assignSeat(empty, "P1", seats32.get("1E"));
    passengers = passengers.map((p) => (p.id === "P2" ? { ...p, mealId: "m" } : p));
    expect(getGrandTotal(passengers, seats32, meals)).toBe(250 + 180);
  });

  it("includes meal charges even when no passenger has a seat", () => {
    const meals = new Map([["m", { id: "m", price: 180 }]]);
    const passengers = setPassengerMeal(twoPassengers(), "P1", "m");
    expect(getSeatTotal(passengers, seats32)).toBe(0);
    expect(getMealTotal(passengers, meals)).toBe(180);
    expect(getGrandTotal(passengers, seats32, meals)).toBe(180);
  });
});
