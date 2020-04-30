import React, { memo, CSSProperties } from "react";
import { TranslatableMessage, MessageParams } from "./types";
import { useValidation } from "./use-validation";

type ErrorListProps = {
  /** The ID attribute for the list */
  id?: string;
  /** The control name associated with the list */
  name: string;
  /** The label text to supply as a param to error messages */
  label?: string;
  /** The class name for the list */
  className?: string;
  /** The style for the list */
  style?: CSSProperties;
};

export const ErrorList = memo<ErrorListProps>(({ name, label, ...other }) => {
  const { getErrors, formatError } = useValidation<{ [key: string]: unknown }>();
  const errors = getErrors(name);

  if (errors.length === 0) {
    return null;
  }

  return (
    <ul {...other}>
      {errors.map((err, i) => {
        let key: string;
        let params: MessageParams;

        if (typeof err === "string") {
          key = err;
          params = {};
        } else {
          ({ key, params = {} } = err as TranslatableMessage);
        }

        if (!params.label && label) {
          params.label = label;
        }

        return <li key={i}>{formatError({ key, params })}</li>;
      })}
    </ul>
  );
});
ErrorList.displayName = "ErrorList";
