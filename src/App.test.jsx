import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App.jsx";

const seat = (id) => document.querySelector(`[aria-label^="Seat ${id},"]`);
const totalText = () => within(document.querySelector(".totals__grand")).getByText(/₹/).textContent;
const passengerList = () => document.querySelector(".passenger-list");
const passengerButton = (name) =>
  within(passengerList()).getByRole("button", { name: new RegExp(`^${name}`) });
const statusText = () => document.querySelector(".status-slot").textContent;

describe("Seat selection app", () => {
  it("renders passengers, empty summary and a zero total", () => {
    render(<App />);
    expect(within(passengerList()).getByText("Passenger 1")).toBeInTheDocument();
    expect(within(passengerList()).getByText("Passenger 2")).toBeInTheDocument();
    expect(screen.getByText("No seats selected yet")).toBeInTheDocument();
    expect(totalText()).toBe("₹0");
  });

  it("renders correct aisle groups for both layouts", async () => {
    const user = userEvent.setup();
    render(<App />);
    const groupsInRow1 = () => document.querySelectorAll('[aria-label="Row 1"] .cabin-group');
    expect([...groupsInRow1()].map((g) => g.children.length)).toEqual([3, 2]);
    await user.click(screen.getByRole("radio", { name: /2–3–2/ }));
    expect([...groupsInRow1()].map((g) => g.children.length)).toEqual([2, 3, 2]);
  });

  it("assigns, changes, blocks duplicates and removes seats while the total stays right", () => {
    render(<App />);

    fireEvent.click(seat("1A"));
    expect(seat("1A")).toHaveAttribute("aria-pressed", "true");
    expect(totalText()).toBe("₹0");

    fireEvent.click(seat("1C")); // moves P1 from 1A to 1C
    expect(seat("1A")).toHaveAttribute("aria-pressed", "false");
    expect(totalText()).toBe("₹350");

    fireEvent.click(passengerButton("Passenger 2"));
    expect(seat("1C")).toHaveAttribute("aria-disabled", "true");
    fireEvent.click(seat("1C")); // duplicate attempt
    expect(statusText()).toContain("already assigned to Passenger 1");
    expect(totalText()).toBe("₹350");

    fireEvent.click(seat("1B")); // occupied
    expect(statusText()).toContain("already taken");

    fireEvent.click(seat("2A")); // paid, P2
    expect(totalText()).toBe("₹700");

    // switching back keeps earlier choices
    fireEvent.click(passengerButton("Passenger 1"));
    expect(seat("1C")).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(screen.getByRole("button", { name: "Remove seat 1C from Passenger 1" }));
    expect(totalText()).toBe("₹350");
  });

  it("releases seats when the passenger count is reduced", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(passengerButton("Passenger 2"));
    await user.click(seat("2A"));
    expect(totalText()).toBe("₹350");
    await user.click(screen.getByRole("button", { name: "Remove a passenger" }));
    expect(within(passengerList()).queryByText("Passenger 2")).not.toBeInTheDocument();
    expect(totalText()).toBe("₹0");
    expect(statusText()).toContain("seat 2A released");
    expect(seat("2A")).toHaveAttribute("aria-pressed", "false");
  });

  it("clears seats that do not exist after a layout switch", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(seat("1C"));
    await user.click(screen.getByRole("radio", { name: /2–3–2/ }));
    expect(statusText()).toContain("seat 1C is not available");
    expect(totalText()).toBe("₹0");
  });

  it("adds meal charges to the total", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(seat("1E")); // premium 250
    await user.click(screen.getByRole("radio", { name: /Vegetarian thali/ }));
    expect(totalText()).toBe("₹430");
    await user.click(screen.getByRole("radio", { name: /No meal/ }));
    expect(totalText()).toBe("₹250");
  });

  it("keeps the meal when a seat is removed and totals a meal without a seat", async () => {
    render(<App />);

    expect(screen.getByText("Meal selection is independent of seat selection.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("radio", { name: /Vegetarian thali/ }));
    expect(totalText()).toBe("₹180");
    expect(document.querySelector(".summary__item dd")).toHaveTextContent("Not selected");

    fireEvent.click(seat("1E"));
    expect(totalText()).toBe("₹430");
    fireEvent.click(screen.getByRole("button", { name: "Remove seat 1E from Passenger 1" }));
    expect(totalText()).toBe("₹180");
    expect(screen.getByRole("radio", { name: /Vegetarian thali/ })).toBeChecked();
  });

  it("removes both the seat and meal with a passenger and preserves both when switching", () => {
    render(<App />);

    fireEvent.click(seat("1A"));
    fireEvent.click(screen.getByRole("radio", { name: /Vegetarian thali/ }));
    fireEvent.click(passengerButton("Passenger 2"));
    fireEvent.click(seat("1C"));
    fireEvent.click(screen.getByRole("radio", { name: /Chicken biryani/ }));
    expect(totalText()).toBe("₹750");

    fireEvent.click(passengerButton("Passenger 1"));
    expect(seat("1A")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("radio", { name: /Vegetarian thali/ })).toBeChecked();
    fireEvent.click(passengerButton("Passenger 2"));
    expect(seat("1C")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("radio", { name: /Chicken biryani/ })).toBeChecked();

    fireEvent.click(screen.getByRole("button", { name: "Remove a passenger" }));
    expect(within(passengerList()).queryByText("Passenger 2")).not.toBeInTheDocument();
    expect(totalText()).toBe("₹180");
  });

  it("keeps seat details stable between adjacent seats and restores the active seat after leaving the cabin", () => {
    render(<App />);

    fireEvent.click(seat("1A"));
    fireEvent.mouseEnter(seat("2A"));
    expect(document.querySelector(".seat-details__title")).toHaveTextContent("Seat 2A");

    fireEvent.mouseEnter(seat("2B"));
    expect(document.querySelector(".seat-details__title")).toHaveTextContent("Seat 2B");
    fireEvent.mouseLeave(document.querySelector(".fuselage"));
    expect(document.querySelector(".seat-details__title")).toHaveTextContent("Seat 1A");
  });

  it("updates seat details with keyboard focus and clears them when focus leaves the cabin", () => {
    render(<App />);

    fireEvent.focus(seat("1A"));
    fireEvent.keyDown(seat("1A"), { key: "ArrowRight" });
    expect(seat("1B")).toHaveFocus();
    expect(document.querySelector(".seat-details__title")).toHaveTextContent("Seat 1B");

    fireEvent.blur(seat("1B"), { relatedTarget: document.body });
    expect(document.querySelector(".seat-details--empty")).toBeInTheDocument();
  });
});
