const { ethers } = require("hardhat");

async function main() {
  const MetaNodeStake = await ethers.getContractAt("MetaNodeStake", "0x9bEDe77211BA4FFc274385A695BCD4eb4cb2f65D");

  // 用于本地测试: 本地跑了 npx hardhat node, 
  // 接着运行了另一个终端跑了: npx hardhat run scripts/deploy.js --network localhost, 生成了部署在本地的合约0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
  // const MetaNodeStake = await ethers.getContractAt("MetaNodeStake", "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512");
  
  const pool = await MetaNodeStake.addPool(ethers.ZeroAddress, 500, 100, 20, false);
  console.log(pool);
}

main();