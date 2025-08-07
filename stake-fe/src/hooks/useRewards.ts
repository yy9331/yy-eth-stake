import { useCallback, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { formatUnits } from 'viem';
import { useStakeContract } from './useContract';
import { Pid } from '../utils';
import { addYYToMetaMask } from '../utils/metamask';
import { retryWithDelay } from '../utils/retry';

export type RewardsData = {
  pendingReward: string;
  stakedAmount: string;
  lastUpdate: number;
};

type UserData = [bigint, bigint, bigint]; // [stAmount, finishedYY, pendingYY]

type PoolData = [string, bigint, bigint, bigint, bigint, bigint, bigint]; // [stTokenAddress, poolWeight, lastRewardBlock, accYYPerST, stTokenAmount, minDepositAmount, unstakeLockedBlocks]

const useRewards = () => {
  const stakeContract = useStakeContract();
  const { address, isConnected } = useAccount();
  const [rewardsData, setRewardsData] = useState<RewardsData>({
    pendingReward: '0',
    stakedAmount: '0',
    lastUpdate: 0
  });
  const [loading, setLoading] = useState(false);

  const [poolData, setPoolData] = useState<Record<string, string>>({
    poolWeight: '0',
    lastRewardBlock: '0',
    accYYPerShare: '0'
  });

  const [yyAddress, setYYAddress] = useState<string>('');

  const fetchPoolData = useCallback(async () => {
    if (!stakeContract || !address || !isConnected) return;

    try {
      const pool = await retryWithDelay(() => 
        stakeContract.read.pool([Pid]) as Promise<PoolData>
      );

      console.log('poolInfo:::', pool);
      
      setPoolData({
        poolWeight: formatUnits(pool[1] as bigint || BigInt(0), 18),
        lastRewardBlock: formatUnits(pool[2] as bigint || BigInt(0), 18),
        accYYPerShare: formatUnits(pool[3] as bigint || BigInt(0), 18),
        stTokenAmount: formatUnits(pool[4] as bigint || BigInt(0), 18),
        minDepositAmount: formatUnits(pool[5] as bigint || BigInt(0), 18),
        unstakeLockedBlocks: formatUnits(pool[6] as bigint || BigInt(0), 18),
        stTokenAddress: pool[0] as string
      });
    } catch (error) {
      console.error('Failed to fetch pool data:', error);
    }
  }, [stakeContract, address, isConnected]);

  // 获取YY代币地址
  const fetchYYAddress = useCallback(async () => {
    if (!stakeContract) return;

    try {
      const address = await retryWithDelay(() => 
        stakeContract.read.YY() as Promise<string>
      );
      setYYAddress(address as string);
    } catch (error) {
      console.error('Failed to fetch YY address:', error);
    }
  }, [stakeContract]);

  const fetchRewardsData = useCallback(async () => {
    if (!stakeContract || !address || !isConnected) return;

    try {
      setLoading(true);
      
      // 获取用户数据
      const userData = await retryWithDelay(() => 
        stakeContract.read.user([Pid, address]) as Promise<UserData>
      );
      const stakedAmount = await retryWithDelay(() => 
        stakeContract.read.stakingBalance([Pid, address]) as Promise<bigint>
      );

      console.log('User data:', userData);
      console.log('Staked amount:', stakedAmount);

      setRewardsData({
        pendingReward: formatUnits(userData[2] || BigInt(0), 18),
        stakedAmount: formatUnits(stakedAmount as bigint || BigInt(0), 18),
        lastUpdate: Date.now()
      });
    } catch (error) {
      console.error('Failed to fetch rewards data:', error);
      // 设置默认值
      setRewardsData({
        pendingReward: '0',
        stakedAmount: '0',
        lastUpdate: Date.now()
      });
    } finally {
      setLoading(false);
    }
  }, [stakeContract, address, isConnected]);

  // 初始加载
  useEffect(() => {
    if (isConnected && address) {
      fetchRewardsData();
      fetchPoolData();
      fetchYYAddress();
    }
  }, [isConnected, address, fetchRewardsData, fetchPoolData, fetchYYAddress]);

  // 定期刷新数据（每60秒）
  useEffect(() => {
    if (!isConnected || !address) return;

    const interval = setInterval(() => {
      fetchRewardsData();
    }, 60000); // 60秒

    return () => clearInterval(interval);
  }, [isConnected, address, fetchRewardsData]);

  // 手动刷新
  const refresh = useCallback(() => {
    fetchRewardsData();
  }, [fetchRewardsData]);

  // 添加YY代币到MetaMask
  const addYYToWallet = useCallback(async () => {
    if (!yyAddress) {
      console.error('YY地址未获取到');
      return false;
    }

    try {
      return await addYYToMetaMask(yyAddress);
    } catch (error) {
      console.error('添加YY到钱包失败:', error);
      return false;
    }
  }, [yyAddress]);

  return {
    rewardsData,
    loading,
    poolData,
    yyAddress,
    refresh,
    addYYToWallet,
    canClaim: parseFloat(rewardsData.pendingReward) > 0
  };
};

export default useRewards; 