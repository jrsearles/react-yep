import React, { FunctionComponent } from "react";
import { useData } from "./use-data";
import { Person, schema } from "./schema";
import { ValidationProvider } from "../src";

export const SimpleExample: FunctionComponent = () => {
  const [state, setter] = useData<Person>({ firstName: "", lastName: "" });

  return (
    <ValidationProvider<Person> schema={schema}>
      {({ hasErrors, validate, reset, isValidating }) => (
        <>
          <h1 data-testid="result">{hasErrors() ? "FAILED" : "PASSED"}</h1>
          <label>
            First Name
            <input name="firstName" value={state.firstName} onChange={setter} />
          </label>
          <label>
            Last Name
            <input name="lastName" value={state.lastName} onChange={setter} />
          </label>
          <label>
            Age
            <input name="age" value={String(state.age ?? "")} onChange={setter} />
          </label>
          <button type="button" onClick={reset} disabled={isValidating()}>
            Reset
          </button>
          <button
            type="button"
            onClick={() => validate(state).catch(() => {})}
            disabled={isValidating()}
          >
            Validate
          </button>
        </>
      )}
    </ValidationProvider>
  );
};
