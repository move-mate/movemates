import * as React from "react";
import { cn } from "../../../libs/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const baseStyles =
  "inline-flex items-center justify-center rounded-lg font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary-600 active:scale-95",
  secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95",
  outline:
    "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 active:scale-95",
  ghost:
    "bg-transparent text-gray-600 hover:bg-gray-100 active:scale-95 border border-secondary/20",
  danger: "bg-red-600 text-white hover:bg-red-700 active:scale-95",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-3 text-sm",
};

type ButtonProps = React.ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", type = "button", ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
