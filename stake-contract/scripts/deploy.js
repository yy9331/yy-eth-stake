// scripts/deploy.js
const { ethers, upgrades } = require("hardhat");

async function main() {
  const [signer] = await ethers.getSigners()

    const YYToken = await ethers.getContractFactory('YYToken')
    const yyToken = await YYToken.deploy()

    await yyToken.waitForDeployment();
    const yyTokenAddress = await yyToken.getAddress();
    

  // 1. 获取合约工厂
  const YYStake = await ethers.getContractFactory("YYStake");

  // 2. 设置初始化参数（根据你的initialize函数）
  // 例如:
  // IERC20 _YY, uint256 _startBlock, uint256 _endBlock, uint256 _YYPerBlock
  // 你需要替换下面的参数为实际的YY代币地址和区块参数
  // const yyTokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // 替换为实际YY代币地址
  const startBlock = 1; // 替换为实际起始区块
  const endBlock = 999999999999; // 替换为实际结束区块
  const yyPerBlock = ethers.parseUnits("1", 18); // 每区块奖励1个YY（18位精度）

  // 3. 部署可升级代理合约
  const stake = await upgrades.deployProxy(
    YYStake,
    [yyTokenAddress, startBlock, endBlock, yyPerBlock],
    { initializer: "initialize" }
  );

  await stake.waitForDeployment();

  // todo
  const stakeAddress = await stake.getAddress()
  const tokenAmount = await yyToken.balanceOf(signer.address)
  let tx = await yyToken.connect(signer).transfer(stakeAddress, tokenAmount)
  await tx.wait()

  console.log("YYStake (proxy) deployed to:", await stake.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });