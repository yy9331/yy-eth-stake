import React from 'react';
import { motion } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../../contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="relative p-2 rounded-full bg-gradient-to-r from-red-100 to-orange-100 dark:from-gray-800 dark:to-gray-700 border-2 border-red-200 dark:border-gray-600 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <motion.div
        initial={false}
        animate={{ rotate: 0 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        {theme === 'light' ? (
          <FiSun className="w-5 h-5 text-yellow-500" />
        ) : (
          <FiMoon className="w-5 h-5 text-red-400" />
        )}
      </motion.div>
      
      {/* 科技感光效 */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-400/20 to-orange-400/20 dark:from-red-400/20 dark:to-yellow-400/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
    </motion.button>
  );
};
