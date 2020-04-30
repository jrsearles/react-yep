import * as yup from "yup";

// Locale strings must be set before schema is defined!
yup.setLocale({
  mixed: {
    required: () => ({ key: "warning-field-required" }),
    notType: ({ type }) => ({ key: `warning-field-${type}` })
  },
  number: {
    integer: () => ({ key: "warning-field-integer" })
  }
});

export const schema = yup.object({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  age: yup.number().integer().notRequired()
});

export type Person = yup.InferType<typeof schema>;
