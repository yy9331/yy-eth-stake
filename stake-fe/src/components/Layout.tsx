import { ReactNode } from "react";
import Header from "./Header";
import { motion } from "framer-motion";
import { FiGithub, FiTwitter } from 'react-icons/fi';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
        <div className="absolute inset-0 tech-grid" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-pink-500/10 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative flex flex-col flex-grow">
        <Header />
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-grow max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8"
        >
          {children}
        </motion.main>

        {/* Footer */}
        <footer className="relative bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border-t-2 border-pink-200/50 dark:border-gray-700/50 mt-auto">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-3 sm:space-y-4 md:space-y-0">
                              <div className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm md:text-base font-medium">
                  © {new Date().getFullYear()} YY Stake. All rights reserved. 💕
                </div>
              <div className="flex items-center space-x-4 sm:space-x-6">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-300 hover:text-pink-500 transition-colors duration-200"
                >
                  <FiTwitter className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-300 hover:text-pink-500 transition-colors duration-200"
                >
                  <FiGithub className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}