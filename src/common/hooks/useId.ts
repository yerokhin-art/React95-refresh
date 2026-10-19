import { useId as useReactId } from 'react';

export const useId = (id?: string) => {
  const generatedId = useReactId();
  return id ?? generatedId;
};
