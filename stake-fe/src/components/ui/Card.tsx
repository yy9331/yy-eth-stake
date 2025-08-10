import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
  animate?: boolean;
  delay?: number;
  size?: 'sm' | 'default' | 'lg' | 'mobile';
  interactive?: boolean;
}

export const Card = ({ 
  children, 
  className, 
  animate = true, 
  delay = 0, 
  size = 'default',
  interactive = false 
}: CardProps) => {
  const sizes = {
    sm: "p-4 rounded-xl",
    default: "p-6 rounded-2xl",
    lg: "p-8 rounded-3xl",
    mobile: "p-4 sm:p-6 rounded-2xl sm:rounded-3xl"
  };
  
  const interactiveClasses = interactive ? "hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200 cursor-pointer" : "";
  const mobileClasses = "touch-manipulation transform-gpu";
  
  const content = (
    <div className={cn(
      "bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm",
      sizes[size],
      interactiveClasses,
      mobileClasses,
      className
    )}>
      {children}
    </div>
  );

  if (!animate) {
    return content;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: delay * 0.1,
        ease: "easeOut"
      }}
    >
      {content}
    </motion.div>
  );
}; 