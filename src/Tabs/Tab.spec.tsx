import { fireEvent } from '@testing-library/react';
import { renderWithTheme } from '../../test/utils';
import { Tab } from './Tab';

describe('<Tab />', () => {
  describe('prop: children', () => {
    it('should render passed child', () => {
      const child = 'Hey there!';
      const { getByText } = renderWithTheme(<Tab>{child}</Tab>);

      expect(getByText(child)).toBeInTheDocument();
    });
  });

  describe('prop: selected', () => {
    it('should render with correct aria attribute', () => {
      const { getByRole } = renderWithTheme(<Tab selected />);

      expect(getByRole('tab')).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('prop: onClick', () => {
    it('should be called when a click is triggered', () => {
      const handleClick = vi.fn();
      const { getByRole } = renderWithTheme(<Tab onClick={handleClick} />);

      fireEvent.click(getByRole('tab'));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });
});
