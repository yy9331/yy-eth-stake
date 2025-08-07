import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

export const Button = ({
  children,
  onClick,
  disabled = false,
  loading = false,
  className,
  type = 'button',
  variant = 'primary',
  fullWidth = false,
}: ButtonProps) => {
  const baseStyles = "flex items-center justify-center space-x-2 transition-all duration-300";

  const variants = {
    primary: "bg-gradient-to-r from-red-400 to-orange-500 hover:from-red-500 hover:to-orange-600 text-white rounded-2xl px-6 py-3 font-semibold transition-all duration-300 ease-in-out shadow-lg hover:shadow-red-500/30 border-2 border-white/20",
    secondary: "bg-gray-700 hover:bg-gray-600 text-white rounded-lg px-6 py-3",
    outline: "border-2 border-red-500 text-red-500 hover:bg-red-500/10 rounded-lg px-6 py-3",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      className={cn(
        baseStyles,
        variants[variant],
        fullWidth && "w-full",
        disabled && "opacity-70 cursor-not-allowed",
        className
      )}
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </motion.button>
  );
}; 