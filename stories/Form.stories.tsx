import React from "react";
import { Control } from "../src";
import { ComplexExample } from "../examples/ComplexExample";
import "./stories.css";

Control.defaultProps = {
  className: "yup-control",
  errorClassName: "yup-control--error",
  errorListClassName: "yup-error-list",
  requiredClassName: "yup-control--required"
};

export default {
  title: "Form"
};

export const Example = () => {
  return <ComplexExample />;
};
