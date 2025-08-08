'use client'
import { motion } from 'framer-motion';
import { useStakeContract } from "../../hooks/useContract";
import useRewards from "../../hooks/useRewards";
import { useCallback, useState } from "react";
import { Pid } from "../../utils";
import { useAccount, useWalletClient } from "wagmi";
import { CustomConnectButton } from "../../components/ui/CustomConnectButton";
import { waitForTransactionReceipt } from "viem/actions";
import { toast } from "react-toastify";
import { FiGift, FiInfo, FiTrendingUp, FiClock, FiHeart } from 'react-icons/fi';
import { RiFireLine } from "react-icons/ri";
import { cn } from '../../utils/cn';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import TechElements from '../../components/TechElements';

const Claim = () => {
  const stakeContract = useStakeContract();
  const { address, isConnected } = useAccount();
  const { rewardsData, canClaim, refresh } = useRewards();
  const [claimLoading, setClaimLoading] = useState(false);
  const { data } = useWalletClient();

  const handleClaim = useCallback(async () => {
    if (!stakeContract || !data) return;
    
    try {
      setClaimLoading(true);
      const tx = await stakeContract.write.claim([Pid]);
      console.log(tx, '===tx===');
      
      const res = await waitForTransactionReceipt(data, { hash: tx });
      
      if (res.status === 'success') {
        toast.success('Claim successful!');
        setClaimLoading(false);
        refresh(); // 刷新数据
        return;
      }
      toast.error('Claim failed!');
    } catch (error) {
      setClaimLoading(false);
      toast.error('Transaction failed. Please try again.');
      console.log(error, 'claim-error');
    }
  }, [stakeContract, data, refresh]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      {/* 科技元素背景 */}
      <TechElements className="z-0" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12 relative z-10"
      >
        <div className="inline-block mb-4">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              scale: { duration: 2, repeat: Infinity },
              rotate: { duration: 3, repeat: Infinity }
            }}
            className="w-24 h-24 rounded-full border-4 border-green-300/30 dark:border-green-500/50 flex items-center justify-center shadow-2xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 glow-effect rounded-full"
            style={{ 
              boxShadow: '0 0 60px 0 rgba(34,197,94,0.3)',
              filter: 'drop-shadow(0 0 30px rgba(34,197,94,0.5))'
            }}
          >
            <FiGift className="w-12 h-12 text-green-500 animate-pulse-slow" />
          </motion.div>
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent mb-4">
          Claim Rewards
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-xl font-medium">
          🎁 Claim your YY rewards 🎁
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        {/* Reward Stats Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="tech-card"
        >
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-green-400 mb-6">Reward Statistics</h2>
            
            {/* Pending Rewards */}
            <div className="glass-morphism border border-green-500/20 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FiGift className="w-6 h-6 text-green-400" />
                  <span className="text-gray-300 dark:text-gray-300 font-medium">Pending Rewards</span>
                </div>
                <span className="text-2xl font-bold text-green-400">
                  {parseFloat(rewardsData.pendingReward).toFixed(4)} YY
                </span>
              </div>
            </div>

            {/* Staked Amount */}
            <div className="glass-morphism border border-blue-500/20 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FiTrendingUp className="w-6 h-6 text-blue-400" />
                  <span className="text-gray-300 dark:text-gray-300 font-medium">Staked Amount</span>
                </div>
                <span className="text-2xl font-bold text-blue-400">
                  {parseFloat(rewardsData.stakedAmount).toFixed(4)} ETH
                </span>
              </div>
            </div>

            {/* Last Update */}
            <div className="glass-morphism border border-purple-500/20 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FiClock className="w-6 h-6 text-purple-400" />
                  <span className="text-gray-300 dark:text-gray-300 font-medium">Last Update</span>
                </div>
                <span className="text-sm font-medium text-purple-400">
                  {rewardsData.lastUpdate > 0 ? new Date(rewardsData.lastUpdate).toLocaleTimeString() : 'Never'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Claim Action Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="tech-card"
        >
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-green-400 mb-6">Claim Rewards</h2>
            
            {/* Info Section */}
            <div className="glass-morphism border-2 border-purple-200/50 dark:border-gray-600/50 rounded-2xl p-6">
              <div className="flex items-start space-x-3">
                <FiInfo className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <p className="font-medium mb-2 text-purple-600 dark:text-purple-400">How claiming works:</p>
                  <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                    <li>• Rewards accumulate continuously while you stake</li>
                    <li>• You can claim rewards anytime</li>
                    <li>• Claimed rewards are sent to your wallet</li>
                    <li>• No minimum claim amount required</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Claim Status */}
            <div className={cn(
              "rounded-2xl p-6 border-2 glass-morphism",
              canClaim 
                ? "border-green-300/50 dark:border-green-400/50" 
                : "border-gray-300/50 dark:border-gray-600/50"
            )}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FiHeart className={cn(
                    "w-5 h-5",
                    canClaim ? "text-green-500" : "text-gray-400"
                  )} />
                  <span className={cn(
                    "font-medium",
                    canClaim ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"
                  )}>
                    {canClaim ? "Ready to Claim" : "No Rewards Available"}
                  </span>
                </div>
                <div className={cn(
                  "w-3 h-3 rounded-full",
                  canClaim ? "bg-green-500" : "bg-gray-400"
                )} />
              </div>
            </div>

            {/* Claim Button */}
            <div className="pt-4">
              {!isConnected ? (
                <div className="flex justify-center">
                  <CustomConnectButton />
                </div>
              ) : (
                <Button
                  onClick={handleClaim}
                  disabled={claimLoading || !canClaim}
                  loading={claimLoading}
                  fullWidth
                  className="py-4 text-lg flame-button glow-effect"
                >
                  <FiGift className="w-6 h-6" />
                  <span>
                    {claimLoading ? 'Processing...' : canClaim ? '🎁 Claim Rewards 🎁' : 'No Rewards'}
                  </span>
                </Button>
              )}
            </div>

            {/* Additional Info */}
            {!canClaim && isConnected && (
              <div className="text-center text-gray-600 dark:text-gray-400 text-sm font-medium">
                <p>🔥 Start staking ETH to earn YY rewards! 🔥</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Reward History Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-12 relative z-10"
      >
        <div className="tech-card">
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-6">Reward History</h2>
          <div className="text-center text-gray-600 dark:text-gray-400 py-8">
            <FiClock className="w-12 h-12 mx-auto mb-4 text-purple-500" />
            <p className="font-medium">Reward history will be displayed here</p>
            <p className="text-sm mt-2 text-gray-500 dark:text-gray-500">Track your past claims and rewards</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Claim; 