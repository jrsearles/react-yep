import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { SimpleExample } from "../../examples/SimpleExample";

test("should have no errors before validation", () => {
  render(<SimpleExample />);
  expect(screen.getByTestId("result")).toHaveTextContent("PASSED");
});

test("should have no errors when validation fails", async () => {
  render(<SimpleExample />);
  fireEvent.click(screen.getByText(/validate/i));
  expect(await screen.findByTestId("result")).toHaveTextContent("FAILED");
});

test("should clear errors when reset", async () => {
  render(<SimpleExample />);

  fireEvent.click(screen.getByText(/validate/i));
  expect(await screen.findByTestId("result")).toHaveTextContent("FAILED");

  fireEvent.click(screen.getByText(/reset/i));
  expect(await screen.findByTestId("result")).toHaveTextContent("PASSED");
});

test("should clear errors when validation errors resolved", async () => {
  render(<SimpleExample />);

  const button = screen.getByText(/validate/i);
  fireEvent.click(button);
  expect(await screen.findByTestId("result")).toHaveTextContent("FAILED");

  fireEvent.change(screen.getByLabelText(/first/i), { target: { value: "Joe" } });
  fireEvent.change(screen.getByLabelText(/last/i), { target: { value: "Blow" } });
  fireEvent.click(button);

  expect(await screen.findByTestId("result")).toHaveTextContent("PASSED");
});
