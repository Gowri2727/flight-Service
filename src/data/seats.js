// Mock seat inventory configuration. Seats themselves are generated from this
// by utils/seatLayout.js so both cabin layouts share one set of rules.

export const SEAT_CATEGORIES = {
  standard: { id: "standard", name: "Standard", price: 0 },
  premium: { id: "premium", name: "Premium", price: 250 },
  extraLegroom: { id: "extraLegroom", name: "Extra Legroom", price: 350 },
};

export const CABIN_CONFIG = {
  "3-2": {
    rows: 20,
    premiumRows: [3, 4, 5],
    extraLegroomRows: [9, 10],
    // Rows 1-2 follow the sample table in the assessment brief exactly
    // (1A-1E and 2A-2B); the remaining seats in those rows are filled in.
    categoryOverrides: {
      "1A": "standard",
      "1B": "standard",
      "1C": "extraLegroom",
      "1D": "standard",
      "1E": "premium",
      "2A": "extraLegroom",
      "2B": "standard",
      "2C": "standard",
      "2D": "standard",
      "2E": "premium",
    },
    occupied: [
      "1B", "2D", "3A", "3E", "4C", "5B", "6D", "7A", "7B", "8C", "9E",
      "10A", "11D", "12B", "13C", "14E", "15A", "16C", "16D", "17B",
      "18E", "19A", "20C",
    ],
  },
  "2-3-2": {
    rows: 18,
    premiumRows: [1, 2, 3],
    extraLegroomRows: [8, 9],
    categoryOverrides: {},
    occupied: [
      "1B", "1F", "2A", "2G", "3D", "3H", "4E", "5A", "5B", "6F", "7H",
      "8D", "9A", "10G", "11E", "11F", "12B", "13H", "14D", "15A", "15E",
      "16G", "17F", "18B",
    ],
  },
};
