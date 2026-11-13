import { useState } from "react";
import AircraftLayoutSelector from "./AircraftLayoutSelector.jsx";
import SeatDetails from "./SeatDetails.jsx";
import SeatLegend from "./SeatLegend.jsx";
import SeatMap from "./SeatMap.jsx";
import StatusMessage from "./StatusMessage.jsx";

export default function CabinPanel({ selection }) {
  const {
    layout, rows, seatsById, ownerBySeatId, activePassenger, notice,
    dismissNotice, changeLayout, selectSeat,
  } = selection;
  const [previewSeatId, setPreviewSeatId] = useState(null);

  // Show the hovered/focused seat, or fall back to the active passenger's seat.
  const detailSeat =
    seatsById.get(previewSeatId) ?? seatsById.get(activePassenger.seatId) ?? null;

  return (
    <section className="panel cabin" aria-labelledby="cabin-title">
      <div className="panel__head cabin__head">
        <div>
          <h2 id="cabin-title">Aircraft cabin</h2>
          <p className="muted">Seating for {activePassenger.name}</p>
        </div>
        <AircraftLayoutSelector layout={layout} onChange={changeLayout} />
      </div>

      <StatusMessage notice={notice} onDismiss={dismissNotice} />
      <SeatLegend />
      <SeatDetails
        seat={detailSeat}
        owner={detailSeat ? ownerBySeatId.get(detailSeat.id) : undefined}
        activePassenger={activePassenger}
      />
      <p className="scroll-hint">Swipe sideways if part of the cabin is cut off.</p>
      <SeatMap
        layout={layout}
        rows={rows}
        ownerBySeatId={ownerBySeatId}
        activePassengerId={activePassenger.id}
        onSelect={(id) => {
          setPreviewSeatId(id);
          selectSeat(id);
        }}
        onPreview={setPreviewSeatId}
      />
    </section>
  );
}
