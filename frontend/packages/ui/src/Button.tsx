import React, { type ButtonHTMLAttributes, forwardRef, type ReactNode } from "react";
import { button } from "./button.css";

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  /** If true the textual children are visually hidden but remain accessible */
  srOnly?: boolean;
  children?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  props: ButtonProps,
  ref: React.ForwardedRef<HTMLButtonElement>,
) {
  const { iconLeft, iconRight, srOnly = false, children, type, ...rest } = props;
  const finalType: ButtonHTMLAttributes<HTMLButtonElement>["type"] = type ?? "button";
  return (
    <button ref={ref} type={finalType} {...rest} className={button}>
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
    </button>
  );
});

Button.displayName = "Button";

export default Button;
