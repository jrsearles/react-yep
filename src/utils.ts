import { Ref, MutableRefObject } from "react";

export const setRef = <T>(
  value: T,
  ref: null | Ref<T> | MutableRefObject<T> | ((value: T) => void)
) => {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref && "current" in ref) {
    (ref as MutableRefObject<T>).current = value;
  }
};

const isTextNode = (node: ChildNode): node is Text => {
  return node?.nodeType === Node.TEXT_NODE;
};

export const getLabelText = (el: HTMLElement | null) => {
  const control = el as HTMLInputElement;
  if (control && control.labels && control.labels[0]) {
    if (isTextNode(control.labels[0].childNodes[0])) {
      return control.labels[0].childNodes[0].nodeValue;
    }

    return control.labels[0].innerText || control.labels[0].textContent || undefined;
  }

  return undefined;
};
