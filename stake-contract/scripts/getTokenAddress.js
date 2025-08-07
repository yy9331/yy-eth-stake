// scripts/getTokenAddress.js
const { ethers } = require("hardhat");

async function main() {
  // 从 YYStake 合约获取 YY token 地址
  const YYStake = await ethers.getContractAt("YYStake", "0xcbE2a64e27bf8b0fdd024e389CfC0B82751A9181");
  
  const yyTokenAddress = await YYStake.YY();
  
  console.log("YYToken 地址:", yyTokenAddress);
  console.log("YYStake 地址:", "0xcbE2a64e27bf8b0fdd024e389CfC0B82751A9181");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
