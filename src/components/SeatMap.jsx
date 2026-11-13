import { useRef } from "react";
import { layoutDefinitions } from "../utils/seatLayout.js";
import SeatRow from "./SeatRow.jsx";

const ARROWS = { ArrowLeft: [0, -1], ArrowRight: [0, 1], ArrowUp: [-1, 0], ArrowDown: [1, 0] };

export default function SeatMap({ layout, rows, ownerBySeatId, activePassengerId, onSelect, onPreview }) {
  const mapRef = useRef(null);
  const { groups, label } = layoutDefinitions[layout];

  // Arrow keys move focus between seats so keyboard users don't have to tab through every seat.
  function handleKeyDown(event) {
    const move = ARROWS[event.key];
    const current = event.target.closest?.("[data-row][data-col]");
    if (!move || !current) return;
    const row = Number(current.dataset.row) + move[0];
    const col = Number(current.dataset.col) + move[1];
    const next = mapRef.current.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    if (next) {
      event.preventDefault();
      next.focus();
    }
  }

  return (
    <div
      className="cabin-scroller"
      tabIndex={0}
      role="region"
      aria-label={`Seat map, ${label} layout. Scrolls sideways on small screens.`}
    >
      <div
        className="fuselage"
        ref={mapRef}
        onKeyDown={handleKeyDown}
        onMouseLeave={() => onPreview(null)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) onPreview(null);
        }}
      >
        <p className="fuselage__nose">Front of cabin</p>
        <div className="cabin-row cabin-row--heads" aria-hidden="true">
          <span className="cabin-row__num" />
          {groups.map((group, groupIndex) => (
            <div className="cabin-group" key={groupIndex}>
              {group.map((seatLabel) => (
                <span className="cabin-head" key={seatLabel}>{seatLabel}</span>
              ))}
            </div>
          ))}
        </div>
        {rows.map(({ row, groups: rowGroups }) => (
          <SeatRow
            key={row}
            row={row}
            groups={rowGroups}
            ownerBySeatId={ownerBySeatId}
            activePassengerId={activePassengerId}
            onSelect={onSelect}
            onPreview={onPreview}
          />
        ))}
        <p className="fuselage__tail">Rear of cabin</p>
      </div>
    </div>
  );
}
