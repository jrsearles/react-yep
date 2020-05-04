# React-Yep

![](https://github.com/jrsearles/react-yep/workflows/CI/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/jrsearles/react-yep/badge.svg?branch=master)](https://coveralls.io/github/jrsearles/react-yep?branch=master)

A lightweight [React](https://reactjs.com) library which supports schema validation via [Yup](https://github.com/jquense/yup).

Features included/excluded:

- Bring your own state - this library is not opinionated about how you manage state.
- This library is intended to be used with forms, but is not bound to form rendering. The ValidationProvider can be wrapped around any set of components you'd like to validate against a specified schema. (For example, this can easily be used for validating rows in an editable table or list.)
- Built with localization in mind.

> This library is intended to be used with validation that is invoked on submit. (Validation on change/blur is not a current use case, though should be feasible without major changes.)

## Installation

```
yarn add react-yep yup
```

## Usage

```jsx
import React from "react";
import * as yup from "yup";
import { ValidationProvider, Control } from "react-yep";

// define your schema
export const schema = yup.object({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  age: yup.number().integer().notRequired()
});

const App = ({ state, setter }) => {
  return (
    <ValidationProvider schema={schema}>
      {({ hasErrors, validate, reset, isValidating }) => (
        <form>
          <label>
            First Name
            <Control>
              <input name="firstName" value={state.firstName} onChange={setter} />
            </Control>
          </label>
          <label>
            Last Name
            <Control>
              <input name="lastName" value={state.lastName} onChange={setter} />
            </Control>
          </label>
          <label>
            Age
            <Control>
              <input name="age" value={String(state.age || "")} onChange={setter} />
            </Control>
          </label>
          <button type="button" onClick={reset} disabled={isValidating()}>
            Reset
          </button>
          <button type="button" onClick={() => validate(data)} disabled={isValidating()}>
            Validate
          </button>
        </form>
      )}
    </ValidationProvider>
  );
};
```

The `ValidationProvider` is the primary component which wraps the children intended to be validated. The component will provide render props to a function (see [Render Props](#render-props)). The component can also be used without render props, using the `useValidation` hook to access the same validation context provided through the render props.

### Props

**Props for the `ValidationProvider` component:**

| Prop   |                   Type                    | Required | Description                                                                                            |
| ------ | :---------------------------------------: | :------: | ------------------------------------------------------------------------------------------------------ |
| schema |               `yup.Schema`                |   yes    | validation schema                                                                                      |
| t      | `(key: string, params: object) => string` |    no    | Message formatter for localization purposes. (see: [Localization](#localization) for more information) |

### Render Props

The following methods/properties are available to child components. These are accessible either using render props or using the `useValidation` hook.

| Prop          |                         Type                         | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ------------- | :--------------------------------------------------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| validate      |    `(data: any, context?: object) => Promise{T}`     | Calls the [validate](https://github.com/jquense/yup#mixedvalidatevalue-any-options-object-promiseany-validationerror) method on the `schema` object. If provided, the `context` parameter will be passed along to the `validate` method. Returns a `Promise` with an object casted to the provided schema when validation passed, otherwise the promise will be rejected with a `ErrorMap` with each of the error messages. Calling this method will update the component's state, setting error messages which can be read by child components. |
| check         | `(data: any, context?: object) => Promise{ErrorMap}` | Similar to `validate`, but does not update the component state. This returns an object with keys for each invalid property, with an array of error messages for each. (This will be an empty object if no errors are found.)                                                                                                                                                                                                                                                                                                                     |
| hasErrors     |             `(key?: string) => boolean`              | Indicates whether the specific key has errors. If a key is nor provided, it will indicate whether the current context has any errors.                                                                                                                                                                                                                                                                                                                                                                                                            |
| getErrors     |          `(key: string) => ErrorMessage[]`           | Gets the error messages for the provided key. If no errors exist, an empty array will be returned.                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| reset         |                     `() => void`                     | Clears any validation errors.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| hasValidation |       `(key: string, name: string) => boolean`       | Indicates whether the provided key has the specified validation. The `name` property is the identifier for the validation within Yup.                                                                                                                                                                                                                                                                                                                                                                                                            |
| isRequired    |              `(key: string) => boolean`              | Indicates whether the specified key has required validation                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| isValidating  |                   `() => boolean`                    | Indicates whether validation is being performed. Since validation can be asyncronous, this allows you to disable form elements while validation is being performed (for example).                                                                                                                                                                                                                                                                                                                                                                |
| formatError   |         `(message: ErrorMessage) => string`          | Helper method which formats the provided error message. This will call through to the `t` prop passed to the provider or to Yup's `ValidationError.formatError` method as a fallback.                                                                                                                                                                                                                                                                                                                                                            |

### Hook

A `useValidation` hook is available which will return the same object passed as [render props](#render-props) above.

## Localization

If you use localization support built into Yup then you do not need to do anything additional for translated messages.

There is another approach to localization which may work better if you are using a localization platform. This approach uses message identifiers along with additional contextual parameters. This requires that when you setup the Yup locale, that for your messages you return an object of type `{ key: string, params: object }`, where `key` is the message identifier and `params` is an object with any params that should be available as tokens for the message.

```js
import * as yup from "yup";

yup.setLocale({
  mixed: {
    required: (params) => ({ key: "warning-field-required", params })
  },
  number: {
    integer: (params) => ({ key: "warning-field-integer", params })
  },
  date: {
    min: ({ min, label, value }) => ({
      key: "warning-field-invalidMinDate",
      params: { min, label, value }
    })
  }
});
```

Then pass to `ValidationProvider` a function for the `t` prop which accepts the key and params and returns a string. This should work well with popular internationalization libraries like [react-i18next](https://github.com/i18next/react-i18next).

## Additional Components

### Control

This is an opinionated component intended to wrap inputs. It will wrap a _single_ component and include an error list when errors are generated for that component. There are several props to modify the style and behavior. It can be used as a reference for a generic wrapper component to provide some default validation behavior if nothing else.

| Prop               |             Type             | Required | Description                                                                                                                              |
| ------------------ | :--------------------------: | :------: | ---------------------------------------------------------------------------------------------------------------------------------------- |
| name               |           `string`           |    no    | Name attribute for the control. (If not provided, the child props will be inspected for a name prop.)                                    |
| label              |           `string`           |    no    | The label to use for validation messages. (If not provided, the text from an associated `HTMLLabelElement` will be used if found.)       |
| className          |           `string`           |    no    | The CSS class to apply to the component.                                                                                                 |
| style              |       `CSSProperties`        |    no    | The style to apply to the component. (Default style is set to `display: inline-block` when style & className are not provided.)          |
| errorClassName     |           `string`           |    no    | The CSS class to apply when the component has errors.                                                                                    |
| errorListClassName |           `string`           |    no    | The CSS class applied to the `ErrorList`.                                                                                                |
| requiredClassName  |           `string`           |    no    | The CSS class to apply when control is required.                                                                                         |
| requiredClassName  | `{ [name: string]: string }` |    no    | Additional CSS classes which are applied to the control based off of the validation applied to the control -> class name.                |
| excludeAria        |          `boolean`           |    no    | By default ARIA attributes will be applied to the child component, though this behavior can be prevented by setting this prop to `true`. |

### ErrorList

This component is rendered as an `HTMLUListElement` (`<ul />`) with a list item for every error found for the provided name. (This is used by the `Control` component.)

| Prop      |      Type       | Required | Description                                                                             |
| --------- | :-------------: | :------: | --------------------------------------------------------------------------------------- |
| name      |    `string`     |   yes    | The name of the property that the errors correspond to.                                 |
| label     |    `string`     |    no    | The label to identify the property, which will be passed to error messages if provided. |
| id        |    `string`     |    no    | The ID to apply to the component                                                        |
| className |    `string`     |    no    | The CSS class to apply to the component.                                                |
| style     | `CSSProperties` |    no    | The style to apply to the component.                                                    |

## License

[MIT](LICENSE)
