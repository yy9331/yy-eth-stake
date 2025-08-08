'use client'
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount, useDisconnect } from 'wagmi';
import { FiLogOut, FiChevronDown, FiX } from 'react-icons/fi';
import { RiWallet3Line } from 'react-icons/ri';
import { CustomConnectButton } from './ui/CustomConnectButton';
import { ThemeToggle } from './ui/ThemeToggle';

export default function WalletConnectButton() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const handleDisconnect = () => {
    disconnect();
    setIsDropdownOpen(false);
  };



  if (!isConnected) {
    return (
      <div className="fixed top-6 right-6 z-50 flex items-center space-x-3">
        {/* 网络显示 */}
        <div className="flex items-center space-x-2 px-3 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full border-2 border-gray-300/50 dark:border-gray-600/50 shadow-lg">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Sepolia</span>
        </div>
        <CustomConnectButton />
        <ThemeToggle />
      </div>
    );
  }

  return (
    <div className="fixed top-6 right-6 z-50 flex items-center space-x-3">
      {/* 网络显示 */}
      <div className="flex items-center space-x-2 px-3 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full border-2 border-gray-300/50 dark:border-gray-600/50 shadow-lg">
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Sepolia</span>
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-full text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <RiWallet3Line className="w-4 h-4" />
        <span className="text-sm max-w-[120px] truncate">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
        <FiChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
      </motion.button>
      <ThemeToggle />

      <AnimatePresence>
        {isDropdownOpen && (
          <>
            {/* 背景遮罩 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDropdownOpen(false)}
              className="fixed inset-0 z-40"
            />

            {/* 下拉菜单 */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-12 w-64 bg-gradient-to-b from-gray-900/95 to-gray-800/95 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-2xl z-50"
            >
              {/* 钱包信息 */}
              <div className="p-4 border-b border-gray-700/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Connected Wallet</span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsDropdownOpen(false)}
                    className="p-1 hover:bg-gray-700/50 rounded-full transition-colors"
                  >
                    <FiX className="w-4 h-4 text-gray-400" />
                  </motion.button>
                </div>
                <div className="text-sm text-gray-300 font-mono break-all">
                  {address}
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="p-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDisconnect}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <FiLogOut className="w-4 h-4" />
                  <span>Disconnect</span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
