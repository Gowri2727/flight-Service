import { CABIN_CONFIG, SEAT_CATEGORIES } from "../data/seats.js";

// Each layout is an ordered list of seat groups. Aisles sit between groups.
export const layoutDefinitions = {
  "3-2": {
    id: "3-2",
    label: "3–2",
    description: "3 seats, aisle, 2 seats",
    groups: [["A", "B", "C"], ["D", "E"]],
  },
  "2-3-2": {
    id: "2-3-2",
    label: "2–3–2",
    description: "2 seats, aisle, 3 seats, aisle, 2 seats",
    groups: [["A", "B"], ["D", "E", "F"], ["G", "H"]],
  },
};

export const LAYOUT_IDS = Object.keys(layoutDefinitions);

function categoryIdFor(layoutId, row, label) {
  const config = CABIN_CONFIG[layoutId];
  const seatId = `${row}${label}`;
  if (config.categoryOverrides[seatId]) return config.categoryOverrides[seatId];
  if (config.extraLegroomRows.includes(row)) return "extraLegroom";
  if (config.premiumRows.includes(row)) return "premium";
  return "standard";
}

export function buildSeats(layoutId) {
  const config = CABIN_CONFIG[layoutId];
  const labels = layoutDefinitions[layoutId].groups.flat();
  const occupied = new Set(config.occupied);
  const seats = [];

  for (let row = 1; row <= config.rows; row += 1) {
    labels.forEach((label) => {
      const id = `${row}${label}`;
      const category = SEAT_CATEGORIES[categoryIdFor(layoutId, row, label)];
      seats.push({
        id,
        row,
        label,
        layout: layoutId,
        categoryId: category.id,
        category: category.name,
        price: category.price,
        status: occupied.has(id) ? "occupied" : "available",
      });
    });
  }
  return seats;
}

// Builds [{ row, groups: [[seat, seat], [seat, seat, seat]] }] for rendering.
export function buildRows(layoutId, seats) {
  const byRow = new Map();
  seats.forEach((seat) => {
    if (!byRow.has(seat.row)) byRow.set(seat.row, new Map());
    byRow.get(seat.row).set(seat.label, seat);
  });
  const { groups } = layoutDefinitions[layoutId];
  return [...byRow.entries()].map(([row, bySeatLabel]) => ({
    row,
    groups: groups.map((group) => group.map((label) => bySeatLabel.get(label))),
  }));
}

// Seats never change at runtime (assignments live on passengers), so the
// inventory is generated once.
export const SEAT_INVENTORY = Object.fromEntries(
  LAYOUT_IDS.map((id) => {
    const seats = buildSeats(id);
    return [
      id,
      {
        seats,
        seatsById: new Map(seats.map((seat) => [seat.id, seat])),
        rows: buildRows(id, seats),
      },
    ];
  })
);
