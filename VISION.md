# VISION.md --- KPaisa Flight Seat Selection

## 1. Product vision

Create a polished, intuitive flight seat-selection experience that feels
like a real airline booking interface.

The user should be able to understand the cabin layout at a glance,
select seats for each traveller, see exactly who owns each seat, and
understand the price before completing their selection.

The experience should feel: - Clear and trustworthy. - Modern and
professional. - Fast and responsive. - Easy to use on desktop, tablet,
and mobile. - Visually consistent, without distracting decoration.

This is a frontend assessment prototype using mock data. It is **not** a
real booking, payment, or airline reservation system.

## 2. Product goal

Deliver the core journey:

1.  Choose the number of passengers.
2.  Select a passenger.
3.  Inspect the aircraft seating layout.
4.  Select an available seat for that passenger.
5.  Repeat for the remaining passengers.
6.  Review the passenger-to-seat assignments.
7.  See the seat charges and grand total update immediately.

The two required cabin configurations are: - **3--2:** A, B, C \| aisle
\| D, E. - **2--3--2:** A, B \| aisle \| D, E, F \| aisle \| G, H.

The optional meal-selection experience may be added only after the core
journey is complete and reliable.

## 3. Design direction

### Visual personality

Use a premium, contemporary airline aesthetic: - Light, calm page
background. - White or near-white content surfaces. - Deep navy or
charcoal for primary text. - One confident blue or teal accent for
primary actions and selected states. - Subtle borders and restrained
shadows. - Consistent corner radii and spacing. - Clear typography with
a strong hierarchy.

Avoid: - Excessive gradients. - Too many accent colours. - Heavy
glassmorphism. - Oversized decorative illustrations. - Unnecessary
animations. - Dense, dashboard-like clutter.

The interface should look like a credible travel product, not a generic
admin panel.

## 4. Main screen structure

Use a clear page hierarchy.

### Header

-   Product/brand wordmark such as **SkySeat** (working name; keep it
    easy to rename).
-   Small context label such as "Flight seat selection".
-   Optional progress indicator, for example: Passengers → Seats →
    Summary.
-   Do not imply a real airline partnership or real booking
    confirmation.

### Page introduction

-   Heading: "Choose your seats".
-   Short supporting text explaining that each passenger can select one
    seat.
-   Display the selected cabin configuration clearly.

### Main content area

On desktop, use a balanced multi-column layout:

**Left column --- Passengers** - Passenger count control. - Passenger
cards or a compact passenger list. - Active passenger highlighted
clearly. - Seat assignment status for each passenger. - Seat label and
price when assigned.

**Centre column --- Aircraft cabin** - Layout switcher for 3--2 and
2--3--2. - A cabin/aircraft visual frame that makes the aisle positions
obvious. - Row numbers. - Seat labels. - Seat buttons with clear
interaction states. - Seat category and price detail. - A compact
legend.

**Right column --- Selection summary** - Selected seats grouped by
passenger. - Seat subtotal. - Optional meal subtotal if meal selection
exists. - Grand total. - Clear empty state before any seats are
selected.

On tablet, reduce columns while preserving readable seat controls. On
mobile, stack sections in a natural order: 1. Passenger selection. 2.
Layout selector and seat map. 3. Selection summary.

The seat map may use horizontal scrolling on narrow screens if
necessary, but the scroll area must be obvious and usable. Do not shrink
seat buttons until labels become unreadable.

## 5. Seat map visual language

Seat states must be immediately distinguishable and must not depend on
colour alone.

Suggested visual mapping: - Available, free: neutral or green-tinted
style with "Free" price information. - Available, paid: neutral style
with a visible price/category detail. - Selected by active passenger:
strong accent outline/fill and selected indicator. - Assigned to another
passenger: disabled or locked appearance, with owner information where
practical. - Pre-occupied: muted unavailable style, clearly marked as
occupied.

Interaction details: - Hover: subtle emphasis and pointer cursor only
for selectable seats. - Focus: visible keyboard focus ring. - Selected:
persistent state, not merely hover styling. - Disabled: no misleading
hover or click affordance. - Seat detail: show seat ID, category, and
price when focused, hovered, or selected where appropriate.

Use semantic buttons for seats. Provide accessible names such as:
`Seat 1C, Extra Legroom, ₹350, available`.

## 6. Passenger experience

The active passenger must be obvious at all times.

Each passenger item should show: - Passenger identifier/name. - Current
seat or "No seat selected". - Seat price. - Active/inactive styling.

When a passenger is selected: - Their existing assignment remains
visible. - Their currently assigned seat is visually identified in the
cabin. - Selecting another available seat changes their assignment
according to the assignment rules in `AGENT.md`. - Switching to another
passenger must not erase earlier choices.

If passenger count is reduced, explain or visibly reflect that removed
passengers and their assignments are no longer part of the selection.

## 7. Pricing and summary experience

Keep pricing transparent.

The summary should: - List each passenger and assigned seat. - Show each
seat's category and price. - Display the seat subtotal. - If meals are
implemented, display meal charges separately. - Display the grand total
with strong visual hierarchy. - Update immediately after every
assignment, change, or removal.

Use Indian Rupees consistently. Display free seats as `₹0` or `Free`
without ambiguity.

Do not add taxes, baggage, ticket fares, convenience fees, or payment
steps because these are outside the assessment scope.

## 8. Interaction and feedback

Every interactive element should have a clear purpose and response.

Provide: - Clear selected and disabled states. - A visible active
passenger. - Helpful feedback when a user attempts an unavailable or
already-assigned seat. - A clear action to remove an assignment. - A
clear way to switch layouts. - An understandable empty state. - No dead
buttons or decorative controls that appear interactive.

Avoid disruptive browser alerts for normal feedback. Prefer a small
inline message, toast, or contextual status message.

## 9. Responsive behaviour

### Desktop

-   Use the three-area layout where screen width permits.
-   Keep the aircraft map visually central.
-   Keep the summary visible without overwhelming the cabin.

### Tablet

-   Use two columns or a stacked summary.
-   Preserve the visual grouping of seat blocks and aisles.

### Mobile

-   Stack passenger panel, seat map, and summary.
-   Keep controls touch-friendly.
-   Use a deliberate horizontal scroll region for the cabin if needed.
-   Keep the active passenger and current total easy to find.
-   Avoid page-level horizontal overflow.

Test at narrow mobile width, typical tablet width, and desktop width.

## 10. Accessibility and usability

-   Use semantic headings, lists, and buttons.
-   Ensure all controls are keyboard accessible.
-   Provide visible focus indicators.
-   Include accessible labels for seat buttons and icon-only controls.
-   Do not communicate state by colour alone.
-   Maintain readable text contrast.
-   Respect reduced-motion preferences.
-   Keep labels and prices readable at mobile sizes.

## 11. Scope boundaries

### In scope

-   Passenger count and passenger switching.
-   Two aircraft seating layouts.
-   Mock available and occupied seats.
-   Free and paid seat categories.
-   Seat assignment, reassignment, and removal.
-   Duplicate-assignment prevention.
-   Live price calculation.
-   Responsive frontend UI.
-   Optional meal selection after core functionality.

### Out of scope

-   User accounts and authentication.
-   Backend APIs.
-   Database persistence.
-   Real-time seat inventory.
-   Real airline data.
-   Flight search or ticket booking.
-   Payment processing.
-   Email/SMS confirmations.
-   Admin dashboards.

Do not add out-of-scope functionality unless explicitly requested.

## 12. Definition of done

The product is ready when: - A user can select a passenger count and
switch passengers. - Both 3--2 and 2--3--2 seat maps render correctly. -
Seats show their availability and price category. - Occupied and
already-assigned seats cannot be selected. - Each passenger can hold
only one seat. - Assignments persist when switching passengers. - A seat
can be changed or removed. - Totals update immediately and correctly. -
The interface is usable on mobile and desktop. - All core controls work
and the browser console is free of application errors. - The README
explains the implementation and setup. - The deployed demo is
accessible.

## 13. Relationship to the other project documents

-   `AGENT.md` defines requirements, architecture, data structures,
    state rules, implementation responsibilities, and testing
    expectations.
-   `VISION.md` defines the product experience, visual direction,
    interaction design, and scope.
-   `CMD.md` contains terminal commands for setup, development, Git,
    build, and deployment.

When making a design decision, use this file for the intended experience
and `AGENT.md` for functional correctness. If a visual preference
conflicts with a required assessment behaviour, preserve the assessment
behaviour.
