import { ReactNode } from "react";
import TechBackground from "./TechBackground";
import Sidebar from "./Sidebar";
import WalletConnectButton from "./WalletConnectButton";
import { motion } from "framer-motion";
import { FiGithub, FiTwitter } from 'react-icons/fi';
import { useAccount, useBalance } from "wagmi";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({
    address: address,
    query: {
      enabled: isConnected,
      refetchInterval: 10000,
      refetchIntervalInBackground: false,
    }
  });

  return (
    <TechBackground>
      <div className="min-h-screen flex flex-col">
        {/* 侧边栏 */}
        <Sidebar 
          isConnected={isConnected}
          address={address}
          balance={balance?.formatted}
        />
        
        {/* 钱包连接按钮 */}
        <WalletConnectButton />
        
        {/* Content */}
        <div className="relative flex flex-col flex-grow">
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-grow"
          >
            {children}
          </motion.main>

          {/* Footer */}
          <footer className="relative glass-morphism border-t-2 border-red-200/50 dark:border-gray-700/50 mt-auto">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-3 sm:space-y-4 md:space-y-0">
                <div className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm md:text-base font-medium">
                  © {new Date().getFullYear()} YY Stake. All rights reserved. 🔥✨
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
    </TechBackground>
  );
}