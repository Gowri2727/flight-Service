import BookingSummary from "./components/BookingSummary.jsx";
import CabinPanel from "./components/CabinPanel.jsx";
import Header from "./components/Header.jsx";
import PassengerPanel from "./components/PassengerPanel.jsx";
import SummaryBar from "./components/SummaryBar.jsx";
import { useSeatSelection } from "./hooks/useSeatSelection.js";
import { layoutDefinitions } from "./utils/seatLayout.js";

export default function App() {
  const selection = useSeatSelection();
  const { passengers, assignedCount, layout, rows, activePassenger, seatsById, grandTotal } = selection;

  return (
    <>
      <Header passengerCount={passengers.length} assignedCount={assignedCount} />
      <main className="page">
        <div className="intro">
          <h1>Choose your seats</h1>
          <p>
            Each passenger can select one seat. Pick a passenger, then choose a seat on the cabin map.
            Cabin layout: {layoutDefinitions[layout].label} ({layoutDefinitions[layout].description}), {rows.length} rows.
          </p>
        </div>
        <div className="grid">
          <div className="grid__passengers"><PassengerPanel selection={selection} /></div>
          <div className="grid__cabin"><CabinPanel selection={selection} /></div>
          <div className="grid__summary"><BookingSummary selection={selection} /></div>
        </div>
      </main>
      <SummaryBar
        activePassenger={activePassenger}
        seat={seatsById.get(activePassenger.seatId)}
        grandTotal={grandTotal}
      />
    </>
  );
}
