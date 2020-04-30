import { createContext } from "react";
import { ValidationState } from "./types";

export const ValidationContext = createContext<ValidationState | null>(null);
ValidationContext.displayName = "Validation";
