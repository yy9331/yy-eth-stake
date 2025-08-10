# YY 代币质押合约

这是一个基于以太坊的 YY 代币质押合约项目，支持用户质押 ETH 获得 YY 代币奖励。

## 🚀 项目特性

- **多池子支持**: 支持多个质押池，每个池子可以有不同的权重和参数
- **ETH 质押**: 用户可以直接质押 ETH 获得 YY 代币奖励
- **可升级合约**: 使用 OpenZeppelin 的可升级代理模式
- **权限管理**: 基于角色的访问控制
- **暂停功能**: 支持暂停质押和领取功能
- **解质押机制**: 支持申请解质押和锁定期机制

## 📁 项目结构

```
stake-contract/
├── contracts/
│   ├── YY.sol              # YY 代币合约 (ERC20)
│   └── YYStake.sol         # 质押合约 (可升级)
├── scripts/
│   ├── deploy.js           # 部署脚本
│   ├── addPool.js          # 添加质押池脚本
│   └── YYStake.js          # 备用部署脚本
├── test/
│   ├── YYStake.test.js     # 基础功能测试
│   └── YYStakeAdvanced.test.js # 高级功能测试
├── ignition/
│   └── modules/
│       └── YY.js           # Ignition 部署模块
└── README.md
```

## 🛠️ 技术栈

- **Solidity**: 智能合约开发语言
- **Hardhat**: 以太坊开发环境
- **OpenZeppelin**: 安全合约库
- **Chai**: 测试框架
- **Ethers.js**: 以太坊交互库

## 📦 安装依赖

```bash
npm install
```

## 🧪 运行测试

```bash
# 运行所有测试
npx hardhat test

# 运行特定测试文件
npx hardhat test test/YYStake.test.js
npx hardhat test test/YYStakeAdvanced.test.js
```

## 🚀 部署合约

### 方法一：使用 deploy.js 脚本

```bash
# 部署到 Sepolia 测试网
npx hardhat run scripts/deploy.js --network sepolia

# 部署到本地网络
npx hardhat run scripts/deploy.js --network localhost
```

### 方法二：使用 Ignition 部署

```bash
# 部署 YY 代币
npx hardhat ignition deploy ./ignition/modules/YY.js

# 部署质押合约
npx hardhat run scripts/deploy.js --network sepolia
```

## ⚙️ 配置网络

在 `hardhat.config.js` 中配置你的网络：

```javascript
module.exports = {
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [PRIVATE_KEY]
    }
  }
}
```

## 🔧 添加质押池

部署合约后，需要添加质押池：

```bash
# 更新 scripts/addPool.js 中的合约地址
# 然后运行
npx hardhat run scripts/addPool.js --network sepolia
```

## 📋 合约功能

### YY 代币合约 (YY.sol)
- **ERC20 标准**: 完全兼容 ERC20 标准
- **初始供应量**: 10,000,000 YY 代币
- **精度**: 18 位小数

### 质押合约 (YYStake.sol)
- **质押功能**: 用户质押 ETH 获得 YY 奖励
- **奖励计算**: 基于区块时间和质押权重
- **解质押机制**: 支持申请解质押和锁定期
- **多池子**: 支持多个质押池
- **管理员功能**: 设置参数、暂停功能等

## 🎯 主要函数

### 用户函数
- `depositETH()`: 质押 ETH
- `claim(uint256 _pid)`: 领取 YY 奖励
- `unstake(uint256 _pid, uint256 _amount)`: 申请解质押
- `withdraw(uint256 _pid)`: 提取解质押的 ETH
- `pendingYY(uint256 _pid, address _user)`: 查询待领取奖励

### 管理员函数
- `addPool()`: 添加质押池
- `setYYPerBlock()`: 设置每区块奖励
- `pauseWithdraw()`: 暂停提取
- `unpauseWithdraw()`: 恢复提取
- `pauseClaim()`: 暂停领取
- `unpauseClaim()`: 恢复领取

## 🔒 安全特性

- **可升级合约**: 使用 UUPS 代理模式
- **权限控制**: 基于角色的访问控制
- **暂停机制**: 紧急情况下可暂停功能
- **输入验证**: 严格的参数验证
- **溢出保护**: 使用 SafeMath 防止溢出

## 🧪 测试覆盖

- ✅ 合约初始化测试
- ✅ 质押功能测试
- ✅ 奖励计算测试
- ✅ 解质押流程测试
- ✅ 管理员功能测试
- ✅ 多用户场景测试
- ✅ 边界情况测试
- ✅ 错误处理测试

## 🌐 前端集成

前端项目位于 `../stake-fe/` 目录，包含：

- **React + TypeScript**: 现代化前端框架
- **Wagmi**: 以太坊交互库
- **RainbowKit**: 钱包连接组件
- **Tailwind CSS**: 样式框架

## 📝 环境变量

创建 `.env` 文件：

```env
PRIVATE_KEY=你的私钥
INFURA_PROJECT_ID=你的 Infura 项目 ID
ETHERSCAN_API_KEY=你的 Etherscan API 密钥
```

## 🚨 注意事项

1. **私钥安全**: 永远不要将私钥提交到代码仓库
2. **测试网络**: 部署前先在测试网络验证
3. **合约升级**: 升级前仔细测试所有功能
4. **Gas 费用**: 确保账户有足够的 ETH 支付 Gas

## 📞 支持

如有问题，请检查：
1. 网络配置是否正确
2. 私钥是否有足够余额
3. 合约是否已正确部署
4. 质押池是否已添加

## 📄 许可证

MIT License