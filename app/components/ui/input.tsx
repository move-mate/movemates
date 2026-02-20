import * as React from "react";
import { cn } from "../../../libs/utils";

type InputProps = React.ComponentProps<"input"> & {
  label?: string;
  labelClassName?: string;
  containerClassName?: string;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      id,
      label,
      required,
      labelClassName,
      containerClassName,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;

    return (
      <div className={cn("space-y-1", containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "text-xs font-bold text-secondary/50 uppercase tracking-wide ml-1",
              labelClassName,
            )}
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          required={required}
          className={cn(
            "w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-secondary placeholder:text-gray-300 transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
