import { motion } from 'framer-motion';
import { ConnectButton as RainbowConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';

export const CustomConnectButton = () => {
  return (
    <RainbowConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === "authenticated");

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={openConnectModal}
                    type="button"
                    className="px-3 sm:px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm sm:text-base font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 whitespace-nowrap"
                  >
                    <span className="hidden sm:inline">Connect Wallet</span>
                    <span className="sm:hidden">Connect</span>
                  </motion.button>
                );
              }

              if (chain.unsupported) {
                return (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={openChainModal}
                    type="button"
                    className="px-3 sm:px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm sm:text-base font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 whitespace-nowrap"
                  >
                    <span className="hidden sm:inline">Wrong network</span>
                    <span className="sm:hidden">Network</span>
                  </motion.button>
                );
              }

              return (
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  {/* 网络选择按钮 - 移动端优化 */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={openChainModal}
                    className="flex items-center justify-center px-3 sm:px-4 py-2 bg-gray-700/80 text-white text-sm sm:text-base font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 whitespace-nowrap"
                  >
                    {chain.hasIcon && (
                      <div
                        className="w-3 h-3 sm:w-4 sm:h-4 rounded-full overflow-hidden mr-2"
                        style={{
                          background: chain.iconBackground,
                        }}
                      >
                        {chain.iconUrl && (
                          <Image
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                            width={16}
                            height={16}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    )}
                    <span className="hidden sm:inline">{chain.name}</span>
                    <span className="sm:hidden">Chain</span>
                  </motion.button>

                  {/* 账户按钮 - 移动端优化 */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={openAccountModal}
                    className="px-3 sm:px-4 py-2 bg-gray-700/80 text-white text-sm sm:text-base font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 whitespace-nowrap"
                  >
                    <span className="hidden sm:inline">
                      {account.displayName}
                      {account.displayBalance
                        ? ` (${account.displayBalance})`
                        : ""}
                    </span>
                    <span className="sm:hidden">
                      {account.displayName.length > 8 
                        ? `${account.displayName.slice(0, 6)}...` 
                        : account.displayName}
                    </span>
                  </motion.button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </RainbowConnectButton.Custom>
  );
};
