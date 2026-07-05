import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "destructive" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", ...props }, ref) => {
    const baseStyle =
      "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 duration-100 cursor-pointer";
    
    const variants = {
      primary: "bg-primary text-primary-foreground hover:bg-primary/95 focus-visible:ring-primary",
      secondary: "bg-muted text-foreground hover:bg-muted/90 focus-visible:ring-border",
      success: "bg-success text-success-foreground hover:bg-success/95 focus-visible:ring-success",
      warning: "bg-warning text-warning-foreground hover:bg-warning/95 focus-visible:ring-warning",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/95 focus-visible:ring-destructive",
      outline: "border border-border bg-background hover:bg-muted text-foreground focus-visible:ring-primary",
      ghost: "hover:bg-muted hover:text-foreground text-foreground focus-visible:ring-primary",
    };

    const sizes = {
      sm: "h-9 px-3 text-sm gap-1",
      md: "h-11 px-5 text-base gap-2",
      lg: "h-12 px-6 text-lg gap-2",
    };

    const classNames = `${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`;

    return <button ref={ref} className={classNames} {...props} />;
  }
);
Button.displayName = "Button";
