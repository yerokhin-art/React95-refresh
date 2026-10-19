import { render } from '@testing-library/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import useForkRef from './useForkRef';

const consoleError = console.error;

beforeEach(() => {
  console.error = vi.fn();
});

afterEach(() => {
  console.error = consoleError;
});

describe('useForkRef', () => {
  it('returns a single ref-setter function that forks the ref to its inputs', () => {
    function Component(props: {
      innerRef: React.RefObject<HTMLDivElement | null>;
    }) {
      const { innerRef } = props;
      const ownRef = useRef<HTMLDivElement | null>(null);
      const [, forceUpdate] = useState(true);
      useEffect(() => forceUpdate(n => !n), []);

      const handleRef = useForkRef(innerRef, ownRef);

      return (
        <div ref={handleRef}>{ownRef.current ? 'has a ref' : 'has no ref'}</div>
      );
    }

    const outerRef = React.createRef<HTMLDivElement>();
    render(<Component innerRef={outerRef} />);

    expect(outerRef.current?.textContent).toBe('has a ref');
    expect(console.error).not.toHaveBeenCalled();
  });

  it('forks if only one of the branches requires a ref', () => {
    const Component = React.forwardRef<HTMLDivElement>((_, ref) => {
      const [hasRef, setHasRef] = useState(false);
      const handleOwnRef = useCallback(() => setHasRef(true), []);
      const handleRef = useForkRef(handleOwnRef, ref);

      return <div ref={handleRef}>{String(hasRef)}</div>;
    });

    const { getByText } = render(<Component />);

    expect(getByText('true')).toBeInTheDocument();
    expect(console.error).not.toHaveBeenCalled();
  });

  it('does nothing if none of the forked branches requires a ref', () => {
    const setRef = vi.fn();

    type OuterProps = {
      children: React.ReactElement<{ ref?: React.Ref<null> }>;
    };

    const Outer = React.forwardRef<null, OuterProps>((props, ref) => {
      const { children } = props;

      // @ts-expect-error
      const handleRef = useForkRef(children?.ref, ref);
      setRef(handleRef);

      return children ? React.cloneElement(children, { ref: handleRef }) : null;
    });

    function Inner() {
      return <div />;
    }

    render(
      <Outer>
        <Inner />
      </Outer>
    );
    expect(console.error).not.toHaveBeenCalled();
    expect(setRef).toHaveBeenCalledWith(null);
  });

  describe('changing refs', () => {
    function Div(
      props: {
        leftRef?: React.Ref<HTMLDivElement>;
        rightRef?: React.Ref<HTMLDivElement>;
      } & React.HTMLAttributes<HTMLDivElement>
    ) {
      const { leftRef = null, rightRef = null, ...other } = props;
      const handleRef = useForkRef(leftRef, rightRef);

      return <div {...other} ref={handleRef} />;
    }

    it('handles changing from no ref to some ref', () => {
      const { rerender } = render(<Div id='test' />);

      expect(console.error).not.toHaveBeenCalled();

      const ref = React.createRef<HTMLDivElement>();
      rerender(<Div id='test' leftRef={ref} />);

      expect(ref.current?.id).toBe('test');
      expect(console.error).not.toHaveBeenCalled();
    });

    it('cleans up detached refs', () => {
      const firstLeftRef = React.createRef<HTMLDivElement>();
      const firstRightRef = React.createRef<HTMLDivElement>();
      const secondRightRef = React.createRef<HTMLDivElement>();

      const { rerender } = render(
        <Div leftRef={firstLeftRef} rightRef={firstRightRef} id='test' />
      );

      expect(console.error).not.toHaveBeenCalled();

      expect(firstLeftRef.current?.id).toBe('test');
      expect(firstRightRef.current?.id).toBe('test');
      expect(secondRightRef.current).toBe(null);

      rerender(
        <Div leftRef={firstLeftRef} rightRef={secondRightRef} id='test' />
      );

      expect(firstLeftRef.current?.id).toBe('test');
      expect(firstRightRef.current).toBe(null);
      expect(secondRightRef.current?.id).toBe('test');
    });
  });
});
