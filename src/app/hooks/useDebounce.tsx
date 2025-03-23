import { useEffect, useState } from "react";

const useDebounce = <T,>(value: T, delay: number = 250) => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    let timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
};

export default useDebounce;
