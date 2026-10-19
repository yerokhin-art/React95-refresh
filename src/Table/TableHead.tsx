import type React from 'react';
import { forwardRef } from 'react';
import styled from 'styled-components';
import type { CommonStyledProps } from '../types';

type TableHeadProps = {
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLTableSectionElement> &
  CommonStyledProps;

const StyledTableHead = styled.thead`
  display: table-header-group;
`;
const TableHead = forwardRef<HTMLTableSectionElement, TableHeadProps>(
  function TableHead({ children, ...otherProps }, ref) {
    return (
      <StyledTableHead ref={ref} {...otherProps}>
        {children}
      </StyledTableHead>
    );
  }
);

TableHead.displayName = 'TableHead';

export { TableHead, type TableHeadProps };
