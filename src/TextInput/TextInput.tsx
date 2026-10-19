import type React from 'react';
import { forwardRef } from 'react';
import styled, { css } from 'styled-components';
import {
  createDisabledTextStyles,
  createFlatBoxStyles,
  createScrollbars
} from '../common';
import { blockSizes } from '../common/system';
import { noOp } from '../common/utils';
import { StyledScrollView } from '../ScrollView/ScrollView';
import type { CommonStyledProps, CommonThemeProps } from '../types';

type TextInputInputProps = {
  multiline?: false | undefined;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  /** @default text */
  type?: React.HTMLInputTypeAttribute;
} & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'className' | 'disabled' | 'style' | 'type'
>;

type TextInputTextAreaProps = {
  multiline: true;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
} & Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'className' | 'disabled' | 'style' | 'type'
>;

type TextInputProps = {
  className?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  multiline?: boolean;
  shadow?: boolean;
  style?: React.CSSProperties;
  variant?: 'default' | 'flat';
} & (TextInputInputProps | TextInputTextAreaProps) &
  CommonStyledProps;

type WrapperProps = {
  $fullWidth?: boolean;
  $variant?: TextInputProps['variant'];
} & CommonThemeProps;

const sharedWrapperStyles = css<WrapperProps>`
  display: flex;
  align-items: center;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  min-height: ${blockSizes.md};
`;

const Wrapper = styled(StyledScrollView)<WrapperProps>`
  ${sharedWrapperStyles}
  background: ${({ $disabled, theme }) =>
    $disabled ? theme.material : theme.canvas};
`;

const FlatWrapper = styled.div<WrapperProps>`
  ${createFlatBoxStyles()}
  ${sharedWrapperStyles}
  position: relative;
`;

type InputProps = {
  disabled?: boolean;
  $variant?: TextInputProps['variant'];
};

const sharedInputStyles = css<InputProps>`
  display: block;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  outline: none;
  border: none;
  background: none;
  font-size: 1rem;
  min-height: 27px;
  font-family: inherit;
  color: ${({ theme }) => theme.canvasText};
  ${({ disabled, $variant }) =>
    $variant !== 'flat' && disabled && createDisabledTextStyles()}
`;

const StyledTextInput = styled.input<InputProps>`
  ${sharedInputStyles}
  padding: 0 8px;
`;

const StyledTextArea = styled.textarea<InputProps>`
  ${sharedInputStyles}
  padding: 8px;
  resize: none;
  ${({ $variant }) => createScrollbars($variant)}
`;

const TextInput = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  TextInputProps
>(
  (
    {
      className,
      disabled = false,
      fullWidth,
      multiline,
      onChange = noOp,
      shadow = true,
      style,
      variant = 'default',
      ...otherProps
    },
    ref
  ) => {
    const WrapperComponent = variant === 'flat' ? FlatWrapper : Wrapper;
    const wrapperTestId =
      variant === 'flat' ? 'variant-flat' : 'variant-default';

    const field = multiline ? (
      <StyledTextArea
        disabled={disabled}
        onChange={
          disabled
            ? undefined
            : (onChange as React.ChangeEventHandler<HTMLTextAreaElement>)
        }
        readOnly={disabled}
        ref={ref as React.Ref<HTMLTextAreaElement>}
        $variant={variant}
        {...(otherProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
      />
    ) : (
      <StyledTextInput
        disabled={disabled}
        onChange={
          disabled
            ? undefined
            : (onChange as React.ChangeEventHandler<HTMLInputElement>)
        }
        readOnly={disabled}
        ref={ref as React.Ref<HTMLInputElement>}
        type={
          (otherProps as React.InputHTMLAttributes<HTMLInputElement>).type ??
          'text'
        }
        $variant={variant}
        {...(otherProps as React.InputHTMLAttributes<HTMLInputElement>)}
      />
    );

    return (
      <WrapperComponent
        data-testid={wrapperTestId}
        className={className}
        $fullWidth={fullWidth}
        $disabled={disabled}
        $shadow={shadow}
        style={style}
      >
        {field}
      </WrapperComponent>
    );
  }
);

TextInput.displayName = 'TextInput';

export { TextInput, type TextInputProps };
