import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { ValidationProvider, Control } from "../";
import { ComplexExample } from "../../examples/ComplexExample";
import { Person, schema } from "../../examples/schema";

test("should initially have no errors", () => {
  render(<ComplexExample />);
  expect(screen.queryByTestId("result")).toHaveTextContent("PASSED");
});

test("should show control errors", async () => {
  render(<ComplexExample />);

  fireEvent.click(screen.getByText(/validate/i));

  expect(await screen.findByTestId("result")).toHaveTextContent("FAILED");
  expect(await screen.findByText(/specify first name/i)).not.toBeNull();
});

test("should use label if provided", async () => {
  render(<ComplexExample />);

  fireEvent.change(screen.getByLabelText(/first/i), { target: { value: "Joe" } });
  fireEvent.change(screen.getByLabelText(/last/i), { target: { value: "Blow" } });
  fireEvent.change(screen.getByLabelText(/age/i), { target: { value: "foo" } });
  fireEvent.click(screen.getByText(/validate/i));

  expect(await screen.findByTestId("result")).toHaveTextContent("FAILED");
  expect(await screen.findByText(/User Age must be a number/)).not.toBeNull();
});

test("should disable button when validating", async () => {
  render(<ComplexExample />);

  const button = screen.getByText(/validate/i);
  fireEvent.click(button);

  await waitFor(() => {
    expect(button).toBeDisabled();
  });
});

test("should include aria attributes", async () => {
  render(<ComplexExample />);

  const control = screen.getByLabelText(/first/i);

  expect(control).toHaveAttribute("aria-required", "true");
  expect(control).not.toHaveAttribute("aria-invalid");
  expect(control).not.toHaveAttribute("aria-describedby");

  // put in invalid state
  fireEvent.click(screen.getByText(/validate/i));

  await waitFor(() => {
    expect(control).toHaveAttribute("aria-invalid", "true");
    expect(control).toHaveAttribute("aria-describedby");
  });
});

test("should allow aria attributes to be excluded", () => {
  render(
    <ValidationProvider<Person> schema={schema}>
      <fieldset>
        <label htmlFor="firstName">First Name</label>
        <Control excludeAria>
          <input id="firstName" name="firstName" value="" onChange={() => {}} />
        </Control>
      </fieldset>
    </ValidationProvider>
  );

  const control = screen.getByLabelText(/first/i);

  expect(control).not.toHaveAttribute("aria-required");
});

test("should apply custom classes for validation rules", () => {
  render(
    <ValidationProvider<Person> schema={schema}>
      <fieldset>
        <label htmlFor="age">Age</label>
        <Control validationClasses={{ integer: "foo" }}>
          <input id="age" name="age" value="" onChange={() => {}} />
        </Control>
      </fieldset>
    </ValidationProvider>
  );

  const control = screen.getByLabelText(/age/i);

  expect(control.parentElement).toHaveClass("foo");
});
