'use client'
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAccount, useBalance, usePublicClient } from "wagmi";
import { parseUnits } from "viem";
import Button from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import TechElements from "../components/TechElements";
import { Pid } from "../utils";
import useRewards from "../hooks/useRewards";
import { useStakeContract } from "../hooks/useContract";
import { toast } from "react-toastify";
import { waitForTransactionReceipt } from "viem/actions";
import { FiArrowDown, FiInfo, FiTrendingUp, FiGift, FiStar, FiZap, FiUsers } from 'react-icons/fi';
import { RiFireLine } from "react-icons/ri";
import { CustomConnectButton } from "../components/ui/CustomConnectButton";

const Index = () => {
  const { isConnected, address } = useAccount();
  const publicClient = usePublicClient();
  const { data: balance } = useBalance({ address });
  const { rewardsData, poolData, canClaim, refresh } = useRewards();
  const stakeContract = useStakeContract();
  
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);

  // 检查合约状态
  useEffect(() => {
    if (stakeContract && isConnected) {
      console.log('Contract address:', stakeContract.address);
      console.log('Wallet connected:', address);
      console.log('Pool data:', poolData);
    }
  }, [stakeContract, isConnected, address, poolData]);

  const handleStake = async () => {
    if (!stakeContract || !publicClient) {
      console.error('Contract or public client not available');
      toast.error('Contract or public client not available');
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (parseFloat(amount) > parseFloat(balance!.formatted)) {
      toast.error('Amount cannot be greater than current balance');
      return;
    }

    // 检查最小质押金额
    const minDepositAmount = parseFloat(poolData.minDepositAmount || '0');
    if (parseFloat(amount) < minDepositAmount) {
      toast.error(`Minimum deposit amount is ${minDepositAmount} ETH`);
      return;
    }

    try {
      setLoading(true);
      console.log('Staking amount:', amount, 'ETH');
      console.log('Contract address:', stakeContract.address);
      console.log('Wallet address:', address);
      
      const tx = await stakeContract.write.depositETH([], { value: parseUnits(amount, 18) });
      console.log('Transaction hash:', tx);
      
      const res = await waitForTransactionReceipt(publicClient, { hash: tx });
      console.log('Transaction receipt:', res);
      
      if (res.status === 'success') {
        toast.success('Stake successful!');
        setAmount('');
        setLoading(false);
        refresh(); // 刷新奖励数据
        return;
      }
      toast.error('Stake failed!');
    } catch (error) {
      setLoading(false);
      console.error('Stake error details:', error);
      toast.error(`Transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleClaim = async () => {
    if (!stakeContract || !publicClient) return;
    
    try {
      setClaimLoading(true);
      console.log('Claiming rewards...');
      console.log('Contract address:', stakeContract.address);
      console.log('Wallet address:', address);
      
      const tx = await stakeContract.write.claim([Pid]);
      console.log('Claim transaction hash:', tx);
      
      const res = await waitForTransactionReceipt(publicClient, { hash: tx });
      console.log('Claim transaction receipt:', res);
      
      if (res.status === 'success') {
        toast.success('Claim successful!');
        setClaimLoading(false);
        refresh(); // 刷新奖励数据
        return;
      }
      toast.error('Claim failed!');
    } catch (error) {
      setClaimLoading(false);
      console.log(error, 'claim-error');
      toast.error('Transaction failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 科技元素背景 */}
      <TechElements className="z-0" />
      
      {/* 主要内容区域 */}
      <div className="relative z-10">
        {/* 顶部英雄区域 */}
        <section className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Logo 和标题 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-8 sm:mb-12"
            >
              <div className="inline-block mb-6 sm:mb-8">
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.1, 1],
                    y: [0, -10, 0]
                  }}
                  transition={{ 
                    rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                    y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full border-4 border-red-300/30 dark:border-red-500/50 flex items-center justify-center shadow-2xl bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/50 dark:to-orange-900/50 glow-effect rounded-full"
                  style={{ 
                    boxShadow: '0 0 120px 0 rgba(239,68,68,0.4)',
                    filter: 'drop-shadow(0 0 60px rgba(239,68,68,0.6))'
                  }}
                >
                  <RiFireLine className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-red-500 animate-pulse-slow" />
                </motion.div>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-red-400 via-orange-500 to-yellow-500 bg-clip-text text-transparent mb-4 sm:mb-6">
                YY Stake
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-medium max-w-3xl mx-auto leading-relaxed px-4">
                🔥✨ Stake ETH to earn tokens ✨🔥
              </p>
            </motion.div>

            {/* 统计卡片区域 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
            >
              {/* 总质押量 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="glass-morphism rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-center hover:scale-105 transition-transform duration-300"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-3 sm:mb-4">
                  <FiTrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-600 bg-clip-text text-transparent mb-2">
                  {parseFloat(poolData.totalStaked || '0').toFixed(2)} ETH
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium">Total Staked</div>
              </motion.div>

              {/* 总用户数 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="glass-morphism rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-center hover:scale-105 transition-transform duration-300"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-3 sm:mb-4">
                  <FiUsers className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent mb-2">
                  {poolData.totalUsers || '0'}
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium">Total Users</div>
              </motion.div>

              {/* 待领取奖励 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="glass-morphism rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-center hover:scale-105 transition-transform duration-300 sm:col-span-2 lg:col-span-1"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-3 sm:mb-4">
                  <FiGift className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent mb-2">
                  {parseFloat(rewardsData.pendingReward).toFixed(2)} YY
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium">Total Rewards</div>
              </motion.div>

              {/* APY */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="glass-morphism rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-center hover:scale-105 transition-transform duration-300"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-3 sm:mb-4">
                  <FiZap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent mb-2">
                  12.5%
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium">APY</div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* 主要操作区域 */}
        <section className="px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 xl:gap-16">
              {/* 质押区域 */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="tech-card"
              >
                <div className="space-y-6 sm:space-y-8">
                  {/* 当前质押状态 */}
                  <div className="text-center mb-6 sm:mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-red-200 to-orange-200 dark:from-gray-600 dark:to-gray-700 rounded-full mb-4 sm:mb-6">
                      <FiStar className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-3">Your Staked Amount</h2>
                    <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-500 to-orange-600 bg-clip-text text-transparent">
                      {parseFloat(poolData.stTokenAmount || '0').toFixed(4)} ETH
                    </div>
                  </div>

                  {/* 质押输入 */}
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <label className="block text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Amount to Stake
                      </label>
                      <div className="relative">
                        <Input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="0.0"
                          className="text-lg sm:text-xl py-4 sm:py-5 pr-20 tech-input"
                        />
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium text-base sm:text-lg">
                          ETH
                        </div>
                      </div>
                      {balance && (
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-3">
                          Available: {parseFloat(balance.formatted).toFixed(4)} ETH
                        </p>
                      )}
                    </div>

                    {/* 质押按钮 */}
                    <div className="pt-4 sm:pt-6">
                      {!isConnected ? (
                        <div className="flex justify-center">
                          <CustomConnectButton />
                        </div>
                      ) : (
                        <Button
                          onClick={handleStake}
                          disabled={loading || !amount}
                          loading={loading}
                          className="w-full py-4 sm:py-5 text-lg sm:text-xl flame-button glow-effect"
                        >
                          <FiArrowDown className="w-6 h-6 sm:w-7 sm:h-7" />
                          <span>🔥 Stake ETH 🔥</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* 奖励区域 */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="tech-card"
              >
                <div className="space-y-6 sm:space-y-8">
                  {/* 当前奖励状态 */}
                  <div className="text-center mb-6 sm:mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-200 to-emerald-200 dark:from-gray-600 dark:to-gray-700 rounded-full mb-4 sm:mb-6">
                      <FiGift className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-3">Pending Rewards</h2>
                    <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                      {parseFloat(rewardsData.pendingReward).toFixed(4)} YY
                    </div>
                  </div>

                  {/* 奖励信息 */}
                  <div className="glass-morphism border-2 border-purple-200/50 dark:border-gray-600/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <FiInfo className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500 mt-1 flex-shrink-0" />
                      <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                        <p className="font-medium mb-3 text-purple-600 dark:text-purple-400 text-sm sm:text-base">How rewards work:</p>
                        <ul className="space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          <li className="flex items-start">
                            <span className="text-purple-500 mr-2">•</span>
                            Rewards accumulate based on your staked amount and time
                          </li>
                          <li className="flex items-start">
                            <span className="text-purple-500 mr-2">•</span>
                            You can claim rewards anytime
                          </li>
                          <li className="flex items-start">
                            <span className="text-purple-500 mr-2">•</span>
                            Rewards are paid in YY tokens
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* 领取按钮 */}
                  <div className="pt-4 sm:pt-6">
                    {!isConnected ? (
                      <div className="flex justify-center">
                        <CustomConnectButton />
                      </div>
                    ) : (
                      <Button
                        onClick={handleClaim}
                        disabled={claimLoading || !canClaim}
                        loading={claimLoading}
                        className="w-full py-4 sm:py-5 text-lg sm:text-xl flame-button glow-effect"
                      >
                        <FiGift className="w-6 h-6 sm:w-7 sm:h-7" />
                        <span>🎁 Claim Rewards 🎁</span>
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
