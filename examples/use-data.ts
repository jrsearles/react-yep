import { ChangeEvent, useCallback, useState } from "react";

export const useData = <T>(initial: T): [T, (e: ChangeEvent<HTMLInputElement>) => void] => {
  const [state, setState] = useState<T>(initial);
  const setter = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.currentTarget;
    setState((s) => ({ ...s, [name]: value }));
  }, []);
  return [state, setter];
};
