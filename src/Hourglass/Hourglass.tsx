import type React from 'react';
import { forwardRef } from 'react';
import styled from 'styled-components';
import { getSize } from '../common/utils';
import type { CommonStyledProps } from '../types';
import base64hourglass from './base64hourglass';

type HourglassProps = {
  size?: string | number;
} & React.HTMLAttributes<HTMLDivElement> &
  CommonStyledProps;

const StyledContainer = styled.div<{
  $size: NonNullable<HourglassProps['size']>;
}>`
  display: inline-block;
  height: ${({ $size }) => getSize($size)};
  width: ${({ $size }) => getSize($size)};
`;

const StyledHourglass = styled.span`
  display: block;
  background: ${base64hourglass};
  background-size: cover;
  width: 100%;
  height: 100%;
`;

const Hourglass = forwardRef<HTMLDivElement, HourglassProps>(
  ({ size = 30, ...otherProps }, ref) => {
    return (
      <StyledContainer $size={size} ref={ref} {...otherProps}>
        <StyledHourglass />
      </StyledContainer>
    );
  }
);

Hourglass.displayName = 'Hourglass';

export { Hourglass, type HourglassProps };
