import { useContext } from "react";
import { ValidationContext } from "./ValidationContext";
import { ValidationState } from "./types";

/** Hook which returns the current validation context. */
export const useValidation = <T>() => {
  const context = useContext(ValidationContext) as ValidationState<T>;
  if (context == null) {
    throw new Error("useValidation must be called within a ValidationContext.");
  }
  return context;
};
