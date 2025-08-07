'use client'
import { motion } from 'framer-motion';
import { useStakeContract } from "../../hooks/useContract";
import useRewards from "../../hooks/useRewards";
import { useCallback, useState, useEffect } from "react";
import { Pid } from "../../utils";
import { useAccount, useWalletClient, useBalance } from "wagmi";
import { parseUnits } from "viem";
import { CustomConnectButton } from "../../components/ui/CustomConnectButton";
import { toast } from "react-toastify";
import { waitForTransactionReceipt } from "viem/actions";
import { FiArrowDown, FiInfo, FiTrendingUp, FiGift, FiStar } from 'react-icons/fi';
import { RiFireLine } from "react-icons/ri";
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';

const Home = () => {
  const stakeContract = useStakeContract();
  const { address, isConnected } = useAccount();
  const { rewardsData, poolData, canClaim, refresh } = useRewards();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);
  const { data } = useWalletClient();
  const { data: balance } = useBalance({
    address: address,
    query: {
      enabled: isConnected,
      refetchInterval: 10000,
      refetchIntervalInBackground: false,
    }
  });

  // 检查合约状态
  useEffect(() => {
    if (stakeContract && isConnected) {
      console.log('Contract address:', stakeContract.address);
      console.log('Wallet connected:', address);
      console.log('Pool data:', poolData);
    }
  }, [stakeContract, isConnected, address, poolData]);

  const handleStake = async () => {
    if (!stakeContract || !data) {
      console.error('Contract or wallet not available');
      toast.error('Contract or wallet not available');
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
      
      const res = await waitForTransactionReceipt(data, { hash: tx });
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
    if (!stakeContract || !data) return;
    
    try {
      setClaimLoading(true);
      const tx = await stakeContract.write.claim([Pid]);
      const res = await waitForTransactionReceipt(data, { hash: tx });
      
      if (res.status === 'success') {
        toast.success('Claim successful!');
        setClaimLoading(false);
        refresh(); // 刷新奖励数据
        return;
      }
      toast.error('Claim failed!');
    } catch (error) {
      setClaimLoading(false);
      toast.error('Transaction failed. Please try again.');
      console.log(error, 'claim-error');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6"
      >
        <div className="inline-block mb-4">
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
            className="w-28 h-28 rounded-full border-4 border-red-300/30 dark:border-red-500/50 flex items-center justify-center shadow-2xl bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/50 dark:to-orange-900/50"
            style={{ 
              boxShadow: '0 0 80px 0 rgba(239,68,68,0.3)',
              filter: 'drop-shadow(0 0 40px rgba(239,68,68,0.5))'
            }}
          >
                          <RiFireLine className="w-14 h-14 text-red-500 animate-pulse-slow" />
          </motion.div>
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-red-400 via-orange-500 to-yellow-500 bg-clip-text text-transparent mb-3">
          YY Stake
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-xl font-medium">
          🔥✨ Stake ETH to earn tokens 🔥✨
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Stake Card */}
        <Card className="min-h-[420px] p-4 sm:p-8 md:p-12 cute-card">
          <div className="space-y-8 sm:space-y-12">
            {/* Staked Amount Display */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 p-4 sm:p-8 bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl border-2 border-red-200/50 dark:border-gray-600/50 group-hover:border-red-300/70 dark:group-hover:border-gray-500/70 transition-all duration-300 shadow-lg hover:shadow-xl">
              <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-br from-red-200 to-orange-200 dark:from-gray-600 dark:to-gray-700 rounded-full animate-pulse-slow">
                <FiStar className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
              </div>
              <div className="flex flex-col justify-center flex-1 min-w-0 items-center sm:items-start">
                <span className="text-gray-600 dark:text-gray-300 text-base sm:text-lg mb-1 font-medium">Staked Amount</span>
                <span className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-red-500 to-orange-600 bg-clip-text text-transparent leading-tight break-all">
                  {parseFloat(poolData.stTokenAmount || '0').toFixed(4)} ETH
                </span>
              </div>
            </div>

            {/* Input Field */}
            <div className="space-y-4 sm:space-y-6">
              <Input
                label="Amount to Stake"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
                rightElement={<span className="text-gray-500">ETH</span>}
                helperText={balance ? `Available: ${parseFloat(balance.formatted).toFixed(4)} ETH` : undefined}
                className="text-lg sm:text-xl py-3 sm:py-5"
              />
            </div>

            {/* Stake Button */}
            <div className="pt-4 sm:pt-8">
              {!isConnected ? (
                <div className="flex justify-center">
                  <CustomConnectButton />
                </div>
              ) : (
                <Button
                  onClick={handleStake}
                  disabled={loading || !amount}
                  loading={loading}
                  fullWidth
                  className="py-3 sm:py-5 text-lg sm:text-xl bg-gradient-to-r from-red-400 to-orange-500 hover:from-red-500 hover:to-orange-600 cute-button"
                >
                  <FiArrowDown className="w-6 h-6 sm:w-7 sm:h-7" />
                  <span>🔥✨ Stake ETH 🔥✨</span>
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Claim Card */}
        <Card className="min-h-[420px] p-4 sm:p-8 md:p-12 cute-card">
          <div className="space-y-8 sm:space-y-12">
            {/* Pending Reward Display */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 p-4 sm:p-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl border-2 border-green-200/50 dark:border-gray-600/50 group-hover:border-green-300/70 dark:group-hover:border-gray-500/70 transition-all duration-300 shadow-lg hover:shadow-xl">
              <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-br from-green-200 to-emerald-200 dark:from-gray-600 dark:to-gray-700 rounded-full animate-pulse-slow">
                <FiGift className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
              </div>
              <div className="flex flex-col justify-center flex-1 min-w-0 items-center sm:items-start">
                <span className="text-gray-600 dark:text-gray-300 text-base sm:text-lg mb-1 font-medium">Pending Rewards</span>
                <span className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent leading-tight break-all">
                  {parseFloat(rewardsData.pendingReward).toFixed(4)} YY
                </span>
              </div>
            </div>

            {/* Info Section */}
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200/50 rounded-2xl p-4 sm:p-6">
                <div className="flex items-start space-x-3">
                  <FiInfo className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                                      <div className="text-sm text-gray-700 dark:text-gray-300">
                      <p className="font-medium mb-1 text-purple-600 dark:text-purple-400">How rewards work:</p>
                      <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                      <li>• Rewards accumulate based on your staked amount and time</li>
                      <li>• You can claim rewards anytime</li>
                      <li>• Rewards are paid in YY tokens</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Claim Button */}
            <div className="pt-4 sm:pt-8">
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
                  className="py-3 sm:py-5 text-lg sm:text-xl bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 cute-button"
                >
                  <FiGift className="w-6 h-6 sm:w-7 sm:h-7" />
                  <span>🎁 Claim Rewards 🎁</span>
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Home;