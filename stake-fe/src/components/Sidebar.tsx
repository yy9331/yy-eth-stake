'use client'
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RiFireLine } from 'react-icons/ri';
import { FiHome, FiGift, FiLogOut, FiMenu, FiX } from 'react-icons/fi';

interface SidebarProps {
  isConnected: boolean;
  address?: string;
  balance?: string;
}

export default function Sidebar({ isConnected, address, balance }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { name: 'Stake', path: '/', icon: FiHome },
    { name: 'Withdrawal', path: '/withdraw', icon: FiLogOut },
    { name: 'Claim', path: '/claim', icon: FiGift },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* 侧边栏触发器 - 移动端优化 */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 sm:top-6 sm:left-6 z-50 p-2.5 sm:p-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <FiMenu className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </motion.button>

      {/* 侧边栏 */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 背景遮罩 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* 侧边栏内容 - 移动端优化 */}
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-72 sm:w-80 bg-gradient-to-b from-gray-900/95 to-gray-800/95 backdrop-blur-xl border-r border-gray-700/50 z-50"
            >
              {/* 关闭按钮 */}
              <div className="flex justify-end p-4 sm:p-6">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="p-2 bg-gray-700/50 rounded-full hover:bg-gray-600/50 transition-colors"
                >
                  <FiX className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
                </motion.button>
              </div>

              {/* Logo */}
              <div className="px-4 sm:px-6 mb-6 sm:mb-8">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                    <RiFireLine className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
                    YY Stake
                  </span>
                </div>
              </div>

              {/* 导航菜单 */}
              <nav className="px-4 sm:px-6 mb-6 sm:mb-8">
                <ul className="space-y-1 sm:space-y-2">
                  {menuItems.map((item) => (
                    <motion.li
                      key={item.path}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        href={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center space-x-2 sm:space-x-3 px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl transition-all duration-300 ${
                          isActive(item.path)
                            ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 text-red-400'
                            : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                        }`}
                      >
                        <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="font-medium text-sm sm:text-base">{item.name}</span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* 钱包信息 */}
              {isConnected && (
                <div className="px-4 sm:px-6 mb-6 sm:mb-8">
                  <div className="bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-gray-700/50">
                    <div className="flex items-center space-x-2 mb-2 sm:mb-3">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs sm:text-sm text-gray-400">Connected</span>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-300 mb-2">
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </div>
                    {balance && (
                      <div className="text-xs sm:text-sm text-gray-400">
                        Balance: {parseFloat(balance).toFixed(4)} ETH
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 网络信息 */}
              <div className="px-4 sm:px-6">
                <div className="bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-gray-700/50">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-xs sm:text-sm text-gray-400">Network</span>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-300">Sepolia Testnet</div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
