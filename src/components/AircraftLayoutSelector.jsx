import { LAYOUT_IDS, layoutDefinitions } from "../utils/seatLayout.js";

export default function AircraftLayoutSelector({ layout, onChange }) {
  return (
    <fieldset className="segmented">
      <legend className="visually-hidden">Cabin layout</legend>
      {LAYOUT_IDS.map((id) => (
        <label className="segmented__item" key={id}>
          <input
            type="radio"
            name="cabin-layout"
            value={id}
            checked={layout === id}
            onChange={() => onChange(id)}
          />
          <span className="segmented__face">
            <strong>{layoutDefinitions[id].label}</strong>
            <small>{layoutDefinitions[id].description}</small>
          </span>
        </label>
      ))}
    </fieldset>
  );
}
