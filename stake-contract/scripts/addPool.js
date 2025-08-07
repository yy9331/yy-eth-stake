const { ethers } = require("hardhat");

async function main() {
  // 连接到已部署的 YYStake 合约
  // 注意：你需要替换为实际部署的合约地址
  const YYStake = await ethers.getContractAt("YYStake", "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0");

  // 添加 ETH 质押池
  // 参数说明：
  // - ethers.ZeroAddress: ETH 池（地址为 0x0）
  // - 500: 池子权重
  // - ethers.parseEther("0.1"): 最小质押金额（0.1 ETH）
  // - 20: 解质押锁定区块数
  // - true: 立即更新池子
  const pool = await YYStake.addPool(
    ethers.ZeroAddress, 
    500, 
    ethers.parseEther("0.1"), 
    20, 
    true
  );
  
  console.log("Pool added successfully!");
  console.log("Transaction hash:", pool.hash);
  
  // 等待交易确认
  await pool.wait();
  console.log("Transaction confirmed!");
  
  // 验证池子是否添加成功
  const poolLength = await YYStake.poolLength();
  console.log("Total pools:", poolLength.toString());
  
  // 获取池子信息
  const poolInfo = await YYStake.pool(0);
  console.log("Pool 0 info:", {
    stTokenAddress: poolInfo[0],
    poolWeight: poolInfo[1].toString(),
    minDepositAmount: ethers.formatEther(poolInfo[5]),
    unstakeLockedBlocks: poolInfo[6].toString()
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });