import { Check, ChevronsUpDown, Lock, Star, X } from "lucide-react";
import { formatSeatPrice } from "../utils/pricing.js";
import { getSeatAriaLabel, getSeatState } from "../utils/seatState.js";

const CATEGORY_ICON = { premium: Star, extraLegroom: ChevronsUpDown };

export default function SeatButton({ seat, owner, activePassengerId, col, onSelect, onPreview }) {
  const state = getSeatState(seat, owner, activePassengerId);
  const isSelectable = state === "free" || state === "paid" || state === "mine";
  const CategoryIcon = CATEGORY_ICON[seat.categoryId];

  let meta;
  if (state === "occupied") meta = <X size={13} aria-hidden="true" />;
  else if (owner) meta = owner.id;
  else meta = formatSeatPrice(seat.price);

  return (
    <button
      type="button"
      className={`seat seat--${state} seat--${seat.categoryId}`}
      aria-label={getSeatAriaLabel(seat, state, owner)}
      aria-pressed={isSelectable ? state === "mine" : undefined}
      aria-disabled={isSelectable ? undefined : true}
      data-row={seat.row}
      data-col={col}
      onClick={() => onSelect(seat.id)}
      onMouseEnter={() => onPreview(seat.id)}
      onFocus={() => onPreview(seat.id)}
    >
      <span className="seat__label">{seat.label}</span>
      <span className="seat__meta">{meta}</span>
      {state === "mine" && <Check className="seat__state-icon" size={12} strokeWidth={3} aria-hidden="true" />}
      {state === "other" && <Lock className="seat__state-icon" size={11} aria-hidden="true" />}
      {CategoryIcon && state !== "occupied" && (
        <CategoryIcon className="seat__category-icon" size={11} aria-hidden="true" />
      )}
    </button>
  );
}
