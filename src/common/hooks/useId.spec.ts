import { render } from '@testing-library/react';
import React from 'react';
import { useId } from './useId';

function renderUseId(id?: string) {
  const result = { current: '' };
  function TestComponent() {
    result.current = useId(id);
    return null;
  }
  render(React.createElement(TestComponent));
  return { result };
}

describe(useId, () => {
  it('returns a non-empty generated ID when no argument is passed', () => {
    const { result } = renderUseId();
    expect(result.current.length).toBeGreaterThan(0);
  });

  it('returns the passed ID', () => {
    const { result } = renderUseId('test');
    expect(result.current).toEqual('test');
  });
});
