import { fireEvent } from '@testing-library/react';
import { renderWithTheme } from '../../test/utils';
import { ColorInput } from './ColorInput';

describe('<ColorInput />', () => {
  it('should call handlers', () => {
    const color = '#f0f0dd';
    const onChange = vi.fn();
    const { container } = renderWithTheme(<ColorInput onChange={onChange} />);
    const input = container.querySelector(`[type="color"]`) as HTMLInputElement;
    fireEvent.change(input, { target: { value: color } });
    expect(onChange).toBeCalledTimes(1);
  });

  it('should properly pass value to input element', () => {
    const color = '#f0f0dd';
    const { container } = renderWithTheme(<ColorInput value={color} />);
    const input = container.querySelector(`[type="color"]`) as HTMLInputElement;

    expect(input.value).toBe(color);
  });
  it('should display current color', () => {
    const color = '#f0f0dd';
    const { getByRole } = renderWithTheme(<ColorInput value={color} />);
    const colorPreview = getByRole('presentation');

    expect(colorPreview).toHaveStyleRule('background', color);
  });

  describe('prop: disabled', () => {
    it('should render disabled input', () => {
      const { container } = renderWithTheme(<ColorInput disabled />);
      const input = container.querySelector(`[type="color"]`);

      expect(input).toHaveAttribute('disabled');
    });

    it('should be overridden by props', () => {
      const { container, rerender } = renderWithTheme(<ColorInput disabled />);
      rerender(<ColorInput disabled={false} />);
      const input = container.querySelector(`[type="color"]`);

      expect(input).not.toHaveAttribute('disabled');
    });
  });
});
