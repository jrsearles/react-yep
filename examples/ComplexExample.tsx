import React, { FunctionComponent } from "react";
import { useData } from "./use-data";
import { Person, schema } from "./schema";
import { ValidationProvider, Control, Formatter } from "../src";
import { translate } from "./locale";

export const ComplexExample: FunctionComponent = () => {
  const [state, setter] = useData<Person>({ firstName: "", lastName: "" });

  return (
    <ValidationProvider<Person> schema={schema} t={translate as Formatter}>
      {({ validate, reset, hasErrors, isValidating }) => (
        <form>
          <h1 data-testid="result">{hasErrors() ? "FAILED" : "PASSED"}</h1>
          <fieldset>
            <label>
              First Name
              <Control>
                <input name="firstName" type="text" value={state.firstName} onChange={setter} />
              </Control>
            </label>
          </fieldset>
          <fieldset>
            <label htmlFor="lastName">
              Last Name
              <Control name="lastName">
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={state.lastName}
                  onChange={setter}
                />
              </Control>
            </label>
          </fieldset>
          <fieldset>
            <label htmlFor="age">
              Age
              <Control label="User Age">
                <input
                  id="age"
                  name="age"
                  type="text"
                  value={String(state.age ?? "")}
                  onChange={setter}
                />
              </Control>
            </label>
          </fieldset>
          <button type="button" onClick={reset} disabled={isValidating()}>
            Reset
          </button>
          <button
            type="button"
            onClick={() => validate(state, { locale: "en-US" }).catch(() => {})}
            disabled={isValidating()}
          >
            Validate
          </button>
        </form>
      )}
    </ValidationProvider>
  );
};
