const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const { ethers, upgrades } = require("hardhat");

module.exports = buildModule("YYTokenModule", (m) => {
  // 部署 YYToken 合约，传入初始持有者地址作为参数
  const YYToken = m.contract("YYToken");
  return { YYToken };
});
