import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", type = "text", label, error, ...props }, ref) => {
    const inputStyles = `
      flex h-11 w-full rounded-lg border border-border bg-card px-3 py-2 text-base 
      ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium 
      placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 
      focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50
      ${error ? "border-destructive focus-visible:ring-destructive" : ""}
      ${className}
    `.trim();

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-semibold text-foreground select-none">
            {label}
          </label>
        )}
        <input ref={ref} type={type} className={inputStyles} {...props} />
        {error && (
          <p className="text-sm font-medium text-destructive mt-0.5 select-none">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
