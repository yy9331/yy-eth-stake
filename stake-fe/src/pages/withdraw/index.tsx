'use client'
import { motion } from 'framer-motion';
import { useStakeContract } from "../../hooks/useContract";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pid } from "../../utils";
import { useAccount, useWalletClient } from "wagmi";
import { formatUnits, parseUnits } from "viem";
import { CustomConnectButton } from "../../components/ui/CustomConnectButton";
import { waitForTransactionReceipt } from "viem/actions";
import { toast } from "react-toastify";
import { FiArrowUp, FiClock, FiInfo } from 'react-icons/fi';
import { cn } from '../../utils/cn';
import { retryWithDelay } from '../../utils/retry';
import TechElements from '../../components/TechElements';

export type UserStakeData = {
  staked: string;
  withdrawPending: string;
  withdrawable: string;
};

const InitData: UserStakeData = {
  staked: '0',
  withdrawable: '0',
  withdrawPending: '0'
};

const Withdraw = () => {
  const stakeContract = useStakeContract();
  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState('');
  const [unstakeLoading, setUnstakeLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const { data } = useWalletClient();
  const [userData, setUserData] = useState<UserStakeData>(InitData);

  const isWithdrawable = useMemo(() => Number(userData.withdrawable) > 0 && isConnected, [userData, isConnected]);

  const getUserData = useCallback(async () => {
    if (!stakeContract || !address) return;
    
    try {
      const staked = await retryWithDelay(() => 
        stakeContract.read.stakingBalance([Pid, address])
      );
      
      // @ts-ignore
      const [requestAmount, pendingWithdrawAmount] = await retryWithDelay(() => 
        stakeContract.read.withdrawAmount([Pid, address])
      );
      
      const ava = Number(formatUnits(pendingWithdrawAmount, 18));
      const total = Number(formatUnits(requestAmount, 18));
      setUserData({
        staked: formatUnits(staked as bigint, 18),
        withdrawPending: (total - ava).toFixed(4),
        withdrawable: ava.toString()
      });
    } catch (error) {
      console.error('获取用户数据失败:', error);
      toast.error('获取数据失败，请稍后重试');
    }
  }, [stakeContract, address]);

  useEffect(() => {
    if (stakeContract && address) {
      getUserData();
    }
  }, [address, stakeContract, getUserData]);

  const handleUnStake = useCallback(async () => {
    if (!stakeContract || !data) return;
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (parseFloat(amount) > parseFloat(userData.staked)) {
      toast.error('Amount cannot be greater than staked amount');
      return;
    }
    try {
      setUnstakeLoading(true);
      const tx = await stakeContract.write.unstake([Pid, parseUnits(amount, 18)]);
      console.log('stakeContract', stakeContract)
      console.log('Pid', Pid)
      await waitForTransactionReceipt(data, { hash: tx });
      toast.success('Unstake successful!');
      setAmount('');
      setUnstakeLoading(false);
      getUserData();
    } catch (error) {
      setUnstakeLoading(false);
      toast.error('Transaction failed. Please try again.');
      console.log(error, 'stake-error');
    }
  }, [stakeContract, data, amount, userData.staked, getUserData]);

  const handleWithdraw = useCallback(async () => {
    if (!stakeContract || !data) return;
    try {
      setWithdrawLoading(true);
      const tx = await stakeContract.write.withdraw([Pid]);
      await waitForTransactionReceipt(data, { hash: tx });
      toast.success('Withdraw successful!');
      setWithdrawLoading(false);
      getUserData();
    } catch (error) {
      setWithdrawLoading(false);
      toast.error('Transaction failed. Please try again.');
      console.log(error, 'stake-error');
    }
  }, [stakeContract, data, getUserData]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d*(\.\d*)?$/.test(val)) {
      setAmount(val);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto relative">
      {/* 科技元素背景 */}
      <TechElements className="z-0" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12 relative z-10"
      >
        <h1 className="text-5xl font-bold bg-gradient-to-r from-red-500 to-orange-600 bg-clip-text text-transparent mb-4">
          Withdraw
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
          🔥✨ Unstake and withdraw your ETH 🔥✨
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="tech-card relative z-10"
      >
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard label="Staked Amount" value={`${parseFloat(userData.staked).toFixed(4)} ETH`} />
          <StatCard label="Available to Withdraw" value={`${parseFloat(userData.withdrawable).toFixed(4)} ETH`} />
          <StatCard label="Pending Withdraw" value={`${parseFloat(userData.withdrawPending).toFixed(4)} ETH`} />
        </div>

        {/* Unstake Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Unstake</h2>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Amount to Unstake
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.0"
                className={cn(
                  "tech-input pr-12",
                  "focus:ring-primary-500 focus:border-primary-500"
                )}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                ETH
              </span>
            </div>
          </div>

          <div className="pt-4">
            {!isConnected ? (
              <div className="flex justify-center">
                <CustomConnectButton />
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleUnStake}
                disabled={unstakeLoading || !amount}
                className={cn(
                  "w-full flex items-center justify-center space-x-2 flame-button glow-effect",
                  unstakeLoading && "opacity-70 cursor-not-allowed"
                )}
              >
                {unstakeLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <FiArrowUp className="w-5 h-5" />
                    <span>Unstake ETH</span>
                  </>
                )}
              </motion.button>
            )}
          </div>
        </div>

        {/* Withdraw Section */}
        <div className="mt-12 space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Withdraw</h2>

          <div className="glass-morphism rounded-2xl p-4 border-2 border-red-200/50 dark:border-gray-600/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">Ready to Withdraw</div>
                <div className="text-2xl font-semibold bg-gradient-to-r from-red-500 to-orange-600 bg-clip-text text-transparent">
                  {parseFloat(userData.withdrawable).toFixed(4)} ETH
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <FiClock className="mr-1" />
                <span>20 min cooldown</span>
              </div>
            </div>
          </div>

          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <FiInfo className="mr-1" />
            <span>After unstaking, you need to wait 20 minutes to withdraw.</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleWithdraw}
            disabled={!isWithdrawable || withdrawLoading}
            className={cn(
              "w-full flex items-center justify-center space-x-2 flame-button glow-effect",
              (!isWithdrawable || withdrawLoading) && "opacity-70 cursor-not-allowed"
            )}
          >
            {withdrawLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <FiArrowUp className="w-5 h-5" />
                <span>Withdraw ETH</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass-morphism rounded-2xl p-4 border-2 border-red-200/50 dark:border-gray-600/50">
      <div className="text-sm text-gray-600 dark:text-gray-300 mb-1 font-medium">{label}</div>
      <div className="text-2xl font-semibold bg-gradient-to-r from-red-500 to-orange-600 bg-clip-text text-transparent">{value}</div>
    </div>
  );
}

export default Withdraw;