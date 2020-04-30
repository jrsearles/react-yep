import { Schema } from "yup";

export type MessageParams = {
  [key: string]: unknown;
};

export type ErrorParams = MessageParams & {
  label?: string | null;
};

export type TranslatableMessage = {
  key: string;
  params?: ErrorParams;
};

export type ErrorMessage = string | TranslatableMessage;

export type ErrorMap<T> = { [key in keyof T]: ErrorMessage[] };

export type Formatter = (key: string, params?: MessageParams) => string;

export type ValidationResult<T = unknown> = [T | undefined, ErrorMap<T>];

export type ValidationState<T = unknown> = {
  /** The validation schema */
  readonly schema: Schema<T>;
  /** Indicates whether validation is being performed */
  isValidating: () => boolean;
  /**
   * Indicates whether the key provided has errors. If no
   * key is provided it will indicate whether any errors
   * exist.
   */
  hasErrors: (key?: keyof T) => boolean;
  /** Gets the errors for the given key */
  getErrors: (key: keyof T) => Readonly<ErrorMessage[]>;
  /** Helper to format error messages */
  formatError: (message: ErrorMessage) => string;
  /** Indicates whether the key has a specified type of validation */
  hasValidation: (key: keyof T, name: string) => boolean;
  /** Indicates whether the key has required validation */
  isRequired: (key: keyof T) => boolean;
  /** Clears validation errors */
  reset: () => void;
  /**
   * Function which performs validation and returns results, but
   * does not update component state.
   */
  check: (payload: T | HTMLFormElement, context?: object) => Promise<ValidationResult<T>>;
  /**
   * Performs validation and updates component state.
   */
  validate: (payload: T | HTMLFormElement, context?: object) => Promise<T>;
};
