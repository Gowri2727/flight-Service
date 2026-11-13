import { Check, ChevronsUpDown, Lock, Star, X } from "lucide-react";
import { SEAT_CATEGORIES } from "../data/seats.js";
import { formatSeatPrice } from "../utils/pricing.js";

export default function SeatLegend() {
  const { standard, premium, extraLegroom } = SEAT_CATEGORIES;
  return (
    <ul className="legend" aria-label="Seat legend">
      <li><span className="legend__swatch seat--free" />Free ({standard.name})</li>
      <li><span className="legend__swatch seat--paid" />Paid</li>
      <li>
        <span className="legend__swatch seat--paid"><Star size={11} aria-hidden="true" /></span>
        {premium.name} {formatSeatPrice(premium.price)}
      </li>
      <li>
        <span className="legend__swatch seat--paid"><ChevronsUpDown size={11} aria-hidden="true" /></span>
        {extraLegroom.name} {formatSeatPrice(extraLegroom.price)}
      </li>
      <li><span className="legend__swatch seat--mine"><Check size={12} strokeWidth={3} aria-hidden="true" /></span>Selected</li>
      <li><span className="legend__swatch seat--other"><Lock size={11} aria-hidden="true" /></span>Another passenger</li>
      <li><span className="legend__swatch seat--occupied"><X size={12} aria-hidden="true" /></span>Occupied</li>
    </ul>
  );
}
