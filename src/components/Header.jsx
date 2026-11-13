import { Check, Plane } from "lucide-react";

export default function Header({ passengerCount, assignedCount }) {
  const allSeated = assignedCount === passengerCount;
  const steps = [
    { label: "Passengers", state: "done" },
    { label: "Seats", detail: `${assignedCount}/${passengerCount}`, state: allSeated ? "done" : "current" },
    { label: "Summary", state: allSeated ? "current" : "upcoming" },
  ];

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="brand">
          <span className="brand__mark" aria-hidden="true"><Plane size={18} /></span>
          <div>
            <p className="brand__name">SkySeat</p>
            <p className="brand__context">Flight seat selection</p>
          </div>
        </div>
        <ol className="progress" aria-label="Progress">
          {steps.map((step, index) => (
            <li
              key={step.label}
              className={`progress__step progress__step--${step.state}`}
              aria-current={step.state === "current" ? "step" : undefined}
            >
              <span className="progress__dot" aria-hidden="true">
                {step.state === "done" ? <Check size={12} strokeWidth={3} /> : index + 1}
              </span>
              <span className="progress__text">
                {step.label}
                {step.detail && <span className="progress__detail"> {step.detail}</span>}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </header>
  );
}
