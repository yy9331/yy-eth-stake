import React from "react";
import { cn } from "../../utils/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "xl" | "mobile";
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", loading = false, fullWidth = false, children, ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none";
    
    const variants = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80",
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70",
      ghost: "hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
      link: "text-primary underline-offset-4 hover:underline active:text-primary/80"
    };
    
    const sizes = {
      sm: "h-8 px-3 text-sm",
      default: "h-10 px-4 text-base",
      lg: "h-12 px-5 text-lg",
      xl: "h-14 px-6 text-xl",
      mobile: "h-12 px-4 text-base py-3 rounded-2xl"
    };
    
    const mobileClasses = "touch-manipulation transform-gpu active:scale-[0.98] transition-transform duration-150";
    
    return (
      <button
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          mobileClasses,
          fullWidth && "w-full",
          className
        )}
        ref={ref}
        {...props}
      >
        {loading && (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button; 