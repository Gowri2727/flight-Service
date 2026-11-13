import SeatButton from "./SeatButton.jsx";

export default function SeatRow({ row, groups, ownerBySeatId, activePassengerId, onSelect, onPreview }) {
  let col = -1;
  return (
    <div className="cabin-row" role="group" aria-label={`Row ${row}`}>
      <span className="cabin-row__num" aria-hidden="true">{row}</span>
      {groups.map((group, groupIndex) => (
        <div className="cabin-group" key={groupIndex}>
          {group.map((seat) => {
            col += 1;
            return (
              <SeatButton
                key={seat.id}
                seat={seat}
                col={col}
                owner={ownerBySeatId.get(seat.id)}
                activePassengerId={activePassengerId}
                onSelect={onSelect}
                onPreview={onPreview}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
