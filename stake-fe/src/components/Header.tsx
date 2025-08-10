'use client'
import { motion } from 'framer-motion';
import { CustomConnectButton } from "./ui/CustomConnectButton";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiMenu, FiX } from 'react-icons/fi';
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
      className="sticky top-0 z-50 glass-morphism border-b-2 border-red-200/50 dark:border-gray-700/50"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo 和标题 - 移动端优化 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-2 sm:space-x-3"
          >
            <RiFireLine className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-red-500 animate-pulse-slow" />
            <Link href="/" className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-600 bg-clip-text text-transparent">
              <span className="hidden sm:inline">YY Stake</span>
              <span className="sm:hidden">YY</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {Links.map((link) => {
              const isActive = pathname === link.path || pathname === link.path + '/';
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  className={cn(
                    "relative text-base font-medium transition-all duration-300 group",
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

          {/* 右侧按钮组 - 移动端完全重新设计 */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* 桌面端按钮组 */}
            <div className="hidden md:flex items-center space-x-3">
              <ThemeToggle />
              <CustomConnectButton />
            </div>

            {/* 移动端按钮组 - 重新设计布局 */}
            <div className="md:hidden flex items-center space-x-2">
              {/* 主题切换按钮 */}
              <div className="scale-90">
                <ThemeToggle />
              </div>
              
              {/* 钱包连接按钮 - 移动端优化 */}
              <div className="min-w-[70px] scale-90">
                <CustomConnectButton />
              </div>
            </div>
            
            {/* 移动端菜单按钮 */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-red-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <FiX className="w-5 h-5" />
              ) : (
                <FiMenu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - 完全重新设计 */}
      <motion.div
        initial={false}
        animate={{ 
          height: isMobileMenuOpen ? "auto" : 0,
          opacity: isMobileMenuOpen ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="md:hidden overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-red-200/50 dark:border-gray-700/50"
      >
        <div className="px-4 py-4 space-y-2">
          {Links.map((link) => {
            const isActive = pathname === link.path || pathname === link.path + '/';
            return (
              <Link
                key={link.name}
                href={link.path}
                className={cn(
                  "block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-red-500/10 to-orange-500/10 text-red-600 dark:text-red-400 border border-red-200/50 dark:border-red-500/50"
                    : "text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-gray-800/50 hover:text-red-500"
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