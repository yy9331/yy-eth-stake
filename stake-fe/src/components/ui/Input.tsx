import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  rightElement?: React.ReactNode;
  size?: 'sm' | 'default' | 'lg' | 'mobile';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, fullWidth = true, rightElement, size = 'default', ...props }, ref) => {
    const sizes = {
      sm: "h-8 px-3 text-sm",
      default: "h-10 px-4 text-base",
      lg: "h-12 px-5 text-lg",
      mobile: "h-12 px-4 text-base py-3 rounded-2xl"
    };
    
    const mobileClasses = "touch-manipulation transform-gpu focus:scale-[1.02] transition-transform duration-200";
    
    return (
      <div className={cn("space-y-2", fullWidth && "w-full")}>
        {label && (
          <label className="block text-sm font-medium text-slate-200">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            className={cn(
              "flex w-full rounded-xl border border-slate-600 bg-slate-800/50 px-3 py-2 text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200",
              sizes[size],
              mobileClasses,
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
              className
            )}
            ref={ref}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-slate-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input"; 