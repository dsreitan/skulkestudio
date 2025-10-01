import React, { type ButtonHTMLAttributes, forwardRef, type ReactNode } from "react";
import styled from "styled-components";

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  /** If true the textual children are visually hidden but remain accessible */
  srOnly?: boolean;
  children?: ReactNode;
}

const StyledButton = styled.button`
  --btn-bg: linear-gradient(135deg,#5a2cf0,#8f5aff);
  --btn-bg-hover: linear-gradient(135deg,#6131ff,#9a68ff);
  --btn-fg: #fff;
  background: var(--btn-bg);
  color: var(--btn-fg);
  border: none;
  padding: .65rem 1.05rem;
  font-size: .9rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  line-height: 1.2;
  user-select: none;
  -webkit-font-smoothing: antialiased;
  transition: background .25s, transform .13s ease-out, box-shadow .25s;
  box-shadow: 0 3px 8px rgba(0,0,0,0.18);
  &:hover:not(:disabled){ background: var(--btn-bg-hover); }
  &:active:not(:disabled){ transform: translateY(2px); box-shadow:0 2px 4px rgba(0,0,0,.35); }
  &:focus-visible{ outline:2px solid #c9b8ff; outline-offset:2px; }
  &:disabled{ opacity:.55; cursor:not-allowed; }
  .sr-only { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0 0 0 0); white-space:nowrap; border:0; }
`;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  props: ButtonProps,
  ref: React.ForwardedRef<HTMLButtonElement>,
) {
  const { iconLeft, iconRight, srOnly = false, children, type, ...rest } = props;
  const finalType: ButtonHTMLAttributes<HTMLButtonElement>["type"] = type ?? "button";
  return (
    <StyledButton ref={ref} type={finalType} {...rest}>
      {iconLeft ? (
        <span aria-hidden className="btn-icon">
          {iconLeft}
        </span>
      ) : null}
      {children ? <span className={srOnly ? "sr-only" : undefined}>{children}</span> : null}
      {iconRight ? (
        <span aria-hidden className="btn-icon">
          {iconRight}
        </span>
      ) : null}
    </StyledButton>
  );
});

Button.displayName = "Button";

export default Button;
