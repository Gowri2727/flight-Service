# AGENT.md --- KPaisa Flight Seat Selection Assessment

## 1. Project brief

Build a responsive **Flight Seat Selection & Passenger Management**
frontend for the KPaisa technical assessment.

The application lets a user: - Choose the number of passengers. - Switch
between passengers. - View and switch between two aircraft seat layouts:
**3--2** and **2--3--2**. - Assign one seat to each passenger. - Prevent
a seat from being assigned to more than one passenger. - Change or
remove a passenger's seat. - See seat categories, prices, and a live
total. - Optionally choose one meal per passenger after all required
functionality is complete.

This is a frontend-only assessment. Use mock data and local React state.
**Do not add a backend, database, authentication, real flight booking,
or payment integration.**

## 2. Source-of-truth requirements

Treat the supplied assessment PDF as the functional source of truth.

### Required

1.  Passenger count controls the passenger list.
2.  Users can switch the active passenger.
3.  Each passenger has at most one assigned seat.
4.  Each seat can be assigned to at most one passenger.
5.  Support both seat layouts:
    -   `3–2`: seats A, B, C \| aisle \| D, E.
    -   `2–3–2`: seats A, B \| aisle \| D, E, F \| aisle \| G, H.
6.  Show row numbers and seat labels.
7.  Distinguish available, occupied, selected, free, and paid seats.
8.  Occupied seats cannot be selected.
9.  Show seat category and price.
10. Allow a passenger to change or remove their assigned seat.
11. Preserve assignments when switching passengers.
12. Calculate the total of all assigned seats and update it immediately.
13. Make the UI responsive and provide clear feedback for invalid
    actions.

### Optional bonus

-   One meal per passenger.
-   Support free and paid meal options.
-   Include meal prices in the overall total.

Do not let the optional meal feature delay or weaken the required
functionality.

## 3. Technology decisions

Use this stack unless the project already has an established compatible
setup:

-   React.js
-   Vite
-   JavaScript (ES modules)
-   CSS (CSS Modules or organized global CSS)
-   React Hooks: `useState`, `useMemo`
-   `lucide-react` for icons, if useful
-   Vercel for deployment

Use plain CSS rather than introducing a large UI framework. Keep
dependencies minimal.

## 4. Application experience

Build a polished airline seat-selection experience with three clear
areas:

### A. Passenger panel

-   Passenger count control.
-   Passenger list with active-passenger indication.
-   Each passenger's assigned seat and seat price.
-   A clear indication when a passenger has not selected a seat.

### B. Aircraft seat map

-   Aircraft/cabin heading and layout selector.
-   Row numbers and seat labels.
-   Visible aisles matching the selected configuration.
-   Seat legend.
-   Seat buttons with distinct visual states.
-   Seat category/price information on the seat or in a nearby detail
    area.

### C. Booking summary

-   Passenger-by-passenger seat summary.
-   Optional meal summary if the bonus is implemented.
-   Seat subtotal, meal subtotal, and grand total.
-   Clear empty state when no seats have been selected.

On narrow screens, stack these areas vertically. Do not allow the seat
map to overflow horizontally without a deliberate, usable scrolling
treatment.

## 5. Suggested project structure

``` text
kpaisa-flight-seat-selection/
├── public/
│   └── (static assets, if needed)
├── src/
│   ├── components/
│   │   ├── PassengerPanel.jsx
│   │   ├── PassengerItem.jsx
│   │   ├── AircraftLayoutSelector.jsx
│   │   ├── SeatMap.jsx
│   │   ├── SeatRow.jsx
│   │   ├── SeatButton.jsx
│   │   ├── SeatLegend.jsx
│   │   ├── SeatDetails.jsx
│   │   ├── BookingSummary.jsx
│   │   └── (MealSelector.jsx — optional)
│   ├── data/
│   │   ├── passengers.js
│   │   ├── seats.js
│   │   └── meals.js (optional)
│   ├── hooks/
│   │   └── useSeatSelection.js
│   ├── utils/
│   │   ├── pricing.js
│   │   └── seatLayout.js
│   ├── styles/
│   │   └── (global.css and component styles)
│   ├── App.jsx
│   └── main.jsx
├── AGENT.md
├── CMD.md
├── README.md
├── package.json
└── .gitignore
```

Keep the structure proportionate. Do not create a separate file for
every tiny helper if that makes the project harder to understand.

## 6. Data model

Use stable IDs and keep seat definitions separate from passenger
assignments.

### Passenger

``` js
{
  id: "P1",
  name: "Passenger 1",
  seatId: null,
  mealId: null // optional bonus
}
```

### Seat

``` js
{
  id: "1C",
  row: 1,
  label: "C",
  layout: "3-2", // or "2-3-2"
  category: "Extra Legroom",
  price: 350,
  status: "available" // or "occupied"
}
```

Use mock data with enough rows to make the cabin feel realistic.
Include: - Free standard seats (`price: 0`). - Paid premium seats. -
Paid extra-legroom seats. - Some pre-occupied seats that cannot be
selected.

A seat's assignment to a passenger should be represented by passenger
`seatId` values or one equivalent central assignment map. Do not
maintain two competing sources of truth.

## 7. State management and business logic

Keep the source of truth in the top-level application state or in the
`useSeatSelection` hook.

Suggested state:

``` js
const [passengers, setPassengers] = useState(initialPassengers);
const [activePassengerId, setActivePassengerId] = useState("P1");
const [layout, setLayout] = useState("3-2");
const [seats, setSeats] = useState(initialSeats);
```

The exact implementation can differ, but follow these invariants:

### Assignment invariants

-   A passenger can have zero or one assigned seat.
-   A seat can be assigned to no more than one passenger.
-   A pre-occupied seat is never assignable.
-   A passenger cannot select a seat already assigned to another
    passenger.
-   Changing a passenger's seat releases the passenger's previous seat
    automatically.
-   Switching the active passenger must not clear or modify any
    assignments.
-   Removing a seat clears only the active passenger's assignment.

### Recommended assignment flow

1.  User selects a passenger.
2.  User activates an available seat.
3.  Validate that the seat is not pre-occupied.
4.  Validate that no other passenger currently owns that seat.
5.  Update the active passenger's `seatId`.
6.  Derive the selected-seat display and total from the updated
    passenger data.

Use functional state updates where appropriate to avoid stale state.
Keep assignment logic in a hook or utility, not duplicated across UI
components.

### Passenger count changes

-   Set a sensible supported range, such as 1--6, and communicate it in
    the UI.
-   When reducing the passenger count, remove passengers beyond the new
    count and release their assigned seats.
-   Keep the active passenger valid; if the active passenger is removed,
    select the first remaining passenger.
-   Do not silently leave orphaned assignments.

### Aircraft layout switching

-   Both layouts must be supported and selectable.
-   Define seat positions from layout metadata rather than hardcoding a
    different page for each layout.
-   Keep the selected layout's seat map readable and correctly spaced
    around aisles.
-   Decide and document how assignments behave when switching layouts.
    Recommended: retain assignments only when the same seat ID exists in
    the new layout; otherwise clear invalid assignments and show a brief
    explanation. Alternatively, use separate seat inventories per layout
    and explain that choice in the README.
-   Never display an assignment to a seat that does not exist in the
    currently active layout.

### Pricing

-   Derive prices; do not separately store a total that can become
    stale.
-   `seatTotal = sum(price of every passenger's assigned seat)`.
-   If meals are implemented, derive `mealTotal` in the same way.
-   `grandTotal = seatTotal + mealTotal`.
-   Use `useMemo` for derived totals only if it improves clarity;
    correctness is more important than memoization.

## 8. Seat layout rendering

Represent each row as ordered seat groups separated by aisle gaps.

Example metadata:

``` js
const layoutDefinitions = {
  "3-2": [["A", "B", "C"], ["D", "E"]],
  "2-3-2": [["A", "B"], ["D", "E", "F"], ["G", "H"]]
};
```

Render the groups with a visible aisle gap between them. Generate row
labels and seat IDs consistently, such as `1A`, `1B`, `1C`.

Seat visual states should be unambiguous: - **Occupied:** unavailable
and disabled. - **Assigned to active passenger:** selected state. -
**Assigned to another passenger:** unavailable to the active passenger;
show who owns it where practical. - **Available and free:** selectable,
zero price. - **Available and paid:** selectable, show category/price.

Do not rely on colour alone. Use text, icons, labels, tooltips, or
accessible names to communicate state.

## 9. Component responsibilities

-   `App`: owns or composes the main state and page layout.
-   `PassengerPanel`: displays passenger count and passenger list.
-   `PassengerItem`: displays one passenger and their seat assignment.
-   `AircraftLayoutSelector`: switches between the two layouts.
-   `SeatMap`: renders all rows for the selected layout.
-   `SeatRow`: renders a row and its seat groups/aisles.
-   `SeatButton`: renders one seat and forwards selection events.
-   `SeatLegend`: explains seat states and pricing categories.
-   `SeatDetails`: shows details for a focused/selected seat.
-   `BookingSummary`: displays assignments and derived totals.
-   `useSeatSelection`: encapsulates assignment, removal,
    passenger-count, and layout logic.
-   `pricing.js`: contains pure price-calculation helpers.
-   `seatLayout.js`: contains layout and seat-generation helpers.

Components should receive data and callbacks through props. Avoid
putting all application logic in one large component.

## 10. UX, accessibility, and quality

-   Use clear typography, consistent spacing, and a restrained
    airline-inspired colour palette.
-   Provide visible hover, focus, selected, disabled, and pressed
    states.
-   Use real buttons for interactive seats and controls.
-   Add accessible labels such as
    `Seat 1C, Extra Legroom, ₹350, available`.
-   Ensure keyboard users can navigate and activate controls.
-   Show a useful empty state when no passenger or seat is selected.
-   Give feedback when a user tries an invalid action.
-   Format currency consistently as INR (`₹`).
-   Test at mobile, tablet, and desktop widths.
-   Avoid unnecessary animation; keep transitions subtle and respect
    reduced-motion preferences.
-   No fake loading indicators are needed for a local mock-data app.

## 11. Required testing checklist

Before calling the project complete, manually test:

-   [ ] Initial passenger list renders.
-   [ ] Increasing passenger count adds passengers.
-   [ ] Decreasing passenger count removes excess passengers and their
    assignments.
-   [ ] Active passenger can be changed.
-   [ ] Previous passenger assignments remain intact after switching.
-   [ ] 3--2 layout renders with the correct aisle.
-   [ ] 2--3--2 layout renders with two aisles.
-   [ ] Layout switching follows the documented assignment policy.
-   [ ] Available free seat can be assigned.
-   [ ] Available paid seat can be assigned.
-   [ ] Occupied seat cannot be assigned.
-   [ ] A seat assigned to another passenger cannot be assigned again.
-   [ ] A passenger cannot hold two seats.
-   [ ] Changing a seat releases the old seat.
-   [ ] Removing a seat updates the passenger display.
-   [ ] Total updates after assignment, change, and removal.
-   [ ] Zero selected seats produces a total of ₹0.
-   [ ] UI works on mobile and desktop.
-   [ ] Browser console has no application errors.

If meals are implemented, also test one meal per passenger, free/paid
meals, changing/removing a meal, and meal totals.

## 12. README and submission requirements

The README must include: - Project overview. - Features. - Technology
stack. - Installation and run commands. - Project structure. -
State-management approach. - Seat assignment and duplicate-prevention
logic. - Pricing calculation approach. - Layout-switching behavior. -
Screenshots. - Live demo URL. - Known limitations, if any.

Submission: 1. Push the complete source to GitHub. 2. Deploy the
frontend to Vercel or GitHub Pages. 3. Verify the deployed URL in a
private/incognito browser window. 4. Include screenshots or a short demo
video if useful. 5. Reply to the assessment email with the repository
and live demo links. 6. If the repository is private, grant the hiring
team access.

## 13. Development order

Build in this order:

1.  Create the Vite React project and confirm it runs.
2.  Create mock passenger and seat data.
3.  Implement passenger count and passenger switching.
4.  Implement layout metadata and both seat maps.
5.  Implement seat assignment, reassignment, removal, and duplicate
    prevention.
6.  Implement price derivation and booking summary.
7.  Add occupied seats and all visual states.
8.  Make the experience responsive and accessible.
9.  Test every required edge case.
10. Add the optional meal feature only if the required work is stable.
11. Write the README, deploy, and verify the submission.

## 14. Agent working rules

When using a coding agent: - Read this `AGENT.md` and `CMD.md` before
changing code. - Inspect the existing project before replacing or
generating files. - Implement in small, verifiable steps. - After each
major step, run the development server and check for errors. - Do not
claim a feature is complete unless it has been implemented and tested. -
Do not add backend services or unrelated features. - Do not use
hardcoded UI-only seat selections that bypass the assignment state. -
Keep mock data, business logic, and presentation separate. - Preserve
working code and avoid unnecessary rewrites. - If a requirement is
ambiguous, state the assumption in the README rather than silently
inventing behavior. - Prioritize correctness of the required assessment
over optional polish.
