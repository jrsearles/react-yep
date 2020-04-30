import React, { useState, useMemo, ReactNode, ReactElement, useRef } from "react";
import { Schema, SchemaDescription, ValidationError } from "yup";
import { ErrorMap, ValidationState, ErrorMessage, Formatter, ValidationResult } from "./types";
import { ValidationContext } from "./ValidationContext";
import { useMethod } from "./use-method";

type ValidationProps<T> = {
  /** Yup schema to use for validation */
  schema: Schema<T>;
  /** Optional function which is to generate error messages */
  t?: Formatter;

  children: ReactNode | ((context: ValidationState<T>) => ReactNode);
};

const EMPTY_MAP: ErrorMap<unknown> = Object.freeze({});
const NO_ERRORS: Readonly<ErrorMessage[]> = [];

/** React Context to wrap components of a given schema */
export const ValidationProvider = <T,>({
  schema,
  t,
  children
}: ValidationProps<T>): ReactElement => {
  const [state, setState] = useState({ errors: EMPTY_MAP as ErrorMap<T>, validating: false });
  const pending = useRef<Promise<T>>();
  const format = useMethod(t || (ValidationError.formatError as Formatter));

  const context = useMemo<ValidationState>(() => {
    const { errors, validating } = state;
    const EMPTY = EMPTY_MAP as ErrorMap<T>;
    const meta = schema.describe();
    const hasValidation = (key: keyof unknown, name: string) => {
      return (meta.fields[key] as SchemaDescription)?.tests.some((x) => x.name === name) || false;
    };

    const check = (payload: unknown, context?: object): Promise<ValidationResult> => {
      return schema
        .validate(payload, { abortEarly: false, context })
        .then((obj) => [obj, EMPTY] as ValidationResult)
        .catch((error: unknown) => {
          if (!ValidationError.isError(error)) {
            throw error;
          }

          const result = error.inner.reduce((acc, err) => {
            const key = err.path as keyof T;
            acc[key] = acc[key] || [];
            acc[key].push(err.message);
            return acc;
          }, {} as ErrorMap<T>);

          return [, result] as ValidationResult;
        });
    };

    return {
      schema,
      check,
      hasValidation,
      isValidating() {
        return validating;
      },
      hasErrors(key?: keyof unknown) {
        return key == null ? errors !== EMPTY_MAP : key! in errors;
      },
      getErrors(key: keyof unknown) {
        return errors[key] || NO_ERRORS;
      },
      formatError(message: ErrorMessage) {
        if (typeof message === "string") {
          return format(message);
        }
        return format(message.key, message.params);
      },
      isRequired(key: keyof unknown) {
        return hasValidation(key, "required");
      },
      reset() {
        setState({ errors: EMPTY, validating: false });
      },
      validate(payload: unknown, context?: object) {
        // If there is already validation pending, don't retrigger,
        // but instead return the same Promise.
        if (pending.current) {
          return pending.current;
        }

        setState((s) => ({ errors: s.errors, validating: true }));
        return (pending.current = check(payload, context).then(([obj, errors]) => {
          pending.current = undefined;
          setState({ errors: errors as ErrorMap<T>, validating: false });

          if (obj == null) {
            throw errors;
          }

          return obj as T;
        }));
      }
    };
  }, [schema, state]);

  return (
    <ValidationContext.Provider value={context}>
      {typeof children === "function" ? children(context as ValidationState<T>) : children}
    </ValidationContext.Provider>
  );
};
