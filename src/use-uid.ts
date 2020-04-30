import { useRef } from "react";

let counter = 0;
export const useUid = (prefix = "") => {
  const ref = useRef<string>();
  if (!ref.current) {
    ref.current = `${prefix}${Date.now().toString(36)}${String(
      ++counter % Number.MAX_SAFE_INTEGER
    )}`;
  }
  return ref.current;
};
