import { useRef, useLayoutEffect, useCallback } from "react";

type Callback<Args extends any[], Result> = (...args: Args) => Result;

export const useMethod = <Args extends any[], Result>(callback: Callback<Args, Result>) => {
  const ref = useRef(callback);
  const method = useCallback((...args: Args) => ref.current(...args), []);

  useLayoutEffect(() => {
    ref.current = callback;
  });

  return method;
};
