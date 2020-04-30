import * as yup from "yup";

const messages = {
  "warning-field-required": "Specify ${label}.",
  "warning-field-number": "${label} must be a number.",
  "warning-field-integer": "${label} must be an integer."
};

export const translate = (key: keyof typeof messages, params?: {}) => {
  return yup.ValidationError.formatError(messages[key], params) as string;
};
