import React, {
  forwardRef,
  useRef,
  Children,
  isValidElement,
  ReactElement,
  cloneElement,
  CSSProperties,
  PropsWithChildren
} from "react";
import clsx, { ClassDictionary } from "clsx";
import { useValidation } from "./use-validation";
import { ErrorList } from "./ErrorList";
import { useUid } from "./use-uid";
import { setRef, getLabelText } from "./utils";

type ClassMap = {
  [name: string]: string;
};

type ControlProps = {
  /** Name attribute for the control. (If not provided, the child props will be inspected for a name prop.) */
  name?: string;
  /**
   * The label to use for the control for validation messages.
   * (If not provided, the text from an associated HTMLLabelElement
   * will be used if found.)
   */
  label?: string;
  /**
   * Class name which is applied to wrapping div.
   */
  className?: string;
  /**
   * Style to apply to wrapping div.
   * @default "display: inline-block"
   */
  style?: CSSProperties;
  /**
   * Class name which is applied to the wrapping div when in error.
   */
  errorClassName?: string;
  /**
   * Class name which is applied to the error list for the control.
   */
  errorListClassName?: string;
  /**
   * Class name which is applied to wrapping div when control is required.
   */
  requiredClassName?: string;
  /**
   * Additional classes which are applied to the control keyed off of validation name -> class name
   */
  validationClasses?: ClassMap;
  /**
   * By default ARIA attributes will be applied to the child component, though
   * this behavior can be prevented by setting this prop to true
   */
  excludeAria?: boolean;
};

export const Control = forwardRef<HTMLElement, PropsWithChildren<ControlProps>>(
  (
    {
      name,
      label,
      className,
      errorClassName,
      errorListClassName,
      requiredClassName,
      validationClasses,
      style,
      excludeAria = false,
      children
    },
    theirRef
  ) => {
    const { isRequired, hasErrors, hasValidation } = useValidation<{
      [key: string]: unknown;
    }>();

    const ourRef = useRef<HTMLElement>(null);
    const id = useUid("err");

    const child = Children.only(children);
    if (!isValidElement(child)) {
      return child as ReactElement;
    }

    const controlName = name || (child.props.name as string);
    const errors = !!controlName && hasErrors(controlName);
    const required = !!controlName && isRequired(controlName);

    const classes =
      validationClasses &&
      Object.keys(validationClasses).reduce(
        (acc: ClassDictionary, key: keyof typeof validationClasses) => {
          acc[validationClasses[key]] = hasValidation(controlName, String(key));
          return acc;
        },
        {}
      );

    const aria = excludeAria
      ? undefined
      : {
          "aria-invalid": errors || undefined,
          "aria-describedby": errors ? id : undefined,
          "aria-required": required
        };

    const clone = cloneElement(child, {
      ...aria,
      className: clsx(child.props.className, errors && errorClassName),
      ref(node: HTMLElement) {
        setRef(node, theirRef);
        setRef(node, ourRef);
        setRef(node, (child as any).ref);
      }
    });

    if (errors) {
      const labelText = label || getLabelText(ourRef.current) || (child.props.title as string);
      return (
        <div className={clsx(className, required && requiredClassName, classes)} style={style}>
          {clone}
          <ErrorList id={id} name={controlName} label={labelText} className={errorListClassName} />
        </div>
      );
    }

    return <div className={clsx(className, required && requiredClassName, classes)}>{clone}</div>;
  }
);
Control.displayName = "Control";
Control.defaultProps = { style: { display: "inline-block" } };
