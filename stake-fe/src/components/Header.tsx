'use client'
import { motion } from 'framer-motion';
import { CustomConnectButton } from "./ui/CustomConnectButton";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiMenu } from 'react-icons/fi';
import { RiFireLine } from "react-icons/ri";
import { useState } from 'react';
import { cn } from '../utils/cn';
import { ThemeToggle } from './ui/ThemeToggle';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const Links = [
    {
      name: 'Stake',
      path: '/'
    },
    {
      name: 'Withdrawal',
      path: '/withdraw'
    },
    {
      name: 'Claim',
      path: '/claim'
    },
  ];

  const pathname = usePathname();

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b-2 border-red-200/50 dark:border-gray-700/50"
    >
      <div className="absolute inset-0 tech-grid pointer-events-none" />
      <div className="relative z-10 max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex flex-wrap md:flex-nowrap justify-between items-center h-auto min-h-[56px] sm:min-h-[64px] py-2 gap-2 md:gap-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col md:flex-row items-center md:space-x-2 text-center md:text-left"
          >
            <RiFireLine className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 animate-pulse-slow mb-1 md:mb-0" />
            <Link href="/" className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-600 bg-clip-text text-transparent leading-tight">
              <span className="block md:inline">YY</span>
              <span className="block md:inline"> Stake</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {Links.map((link) => {
              const isActive = pathname === link.path || pathname === link.path + '/';
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  className={cn(
                    "relative text-base lg:text-lg font-medium transition-all duration-300 group",
                    isActive ? "text-red-500" : "text-gray-600 dark:text-gray-300 hover:text-red-500"
                  )}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-[1.5px] left-0 right-0 h-0.5 bg-gradient-to-r from-red-400 to-orange-600"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-400 group-hover:w-full transition-all duration-300" />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 md:gap-4 mt-2 md:mt-0">
                          <ThemeToggle />
              <div className="min-w-[100px] sm:min-w-[120px]">
                <CustomConnectButton />
              </div>
            {/* Mobile menu button */}
            <button
              className="md:hidden p-1.5 sm:p-2 ml-1 rounded-lg hover:bg-red-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <FiMenu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <motion.div
        initial={false}
        animate={{ height: isMobileMenuOpen ? "auto" : 0 }}
        className="md:hidden overflow-hidden"
      >
        <div className="px-3 sm:px-4 py-2 space-y-1 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t-2 border-red-200/50 dark:border-gray-700/50">
          {Links.map((link) => {
            const isActive = pathname === link.path || pathname === link.path + '/';
            return (
              <Link
                key={link.name}
                href={link.path}
                                  className={cn(
                    "block px-3 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors duration-200",
                    isActive
                      ? "bg-red-500/10 text-red-500"
                      : "text-gray-600 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-gray-800 hover:text-red-500"
                  )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      </motion.div>
    </motion.header>
  );
};

export default Header;