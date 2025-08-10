# YY Token Stake - DeFi 质押平台

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-blue.svg)](https://soliditylang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.4-blue.svg)](https://www.typescriptlang.org/)

[English](README_EN.md) | 中文

一个基于以太坊的去中心化质押平台，支持多种代币质押和奖励分配。

## 📖 项目概述

YY Token Stake 是一个完整的 DeFi 质押解决方案，包含智能合约和前端界面。用户可以通过质押原生代币（ETH）或 ERC20 代币来获得 YY Token 奖励。

### 🌐 项目地址

[https://stake.zyzy.info/](https://stake.zyzy.info/) 

### 🌟 核心特性

- **多池质押**: 支持多个质押池，每个池可配置不同的质押代币和奖励权重
- **灵活奖励**: 基于质押数量和时间长度动态计算奖励
- **安全机制**: 包含锁定期、最小质押限制等安全措施
- **现代化前端**: 使用 Next.js + TypeScript + Tailwind CSS 构建
- **Web3 集成**: 支持 MetaMask 等主流钱包

## 🏗️ 技术架构

### 智能合约 (stake-contract/)
- **框架**: Hardhat + Solidity
- **合约**: YYStake.sol, YY.sol (奖励代币)
- **网络**: Sepolia 测试网
- **安全**: OpenZeppelin 合约库

### 前端应用 (stake-fe/)
- **框架**: Next.js 15 + React 19
- **语言**: TypeScript
- **样式**: Tailwind CSS + Material-UI
- **Web3**: Viem + Wagmi + RainbowKit
- **状态管理**: TanStack Query

## 🚀 快速开始

### 前置要求

- Node.js 18+ 
- npm 或 yarn
- MetaMask 钱包
- Sepolia 测试网 ETH

### 安装依赖

```bash
# 克隆项目
git clone https://github.com/yy9331/yy-eth-stake.git
cd yy-eth-stake

# 安装合约依赖
cd stake-contract
npm install

# 安装前端依赖
cd ../stake-fe
npm install
```

### 部署合约

```bash
# 在 stake-contract 目录下
# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，添加你的私钥和 API 密钥

# 编译合约
npx hardhat compile

# 部署到 Sepolia
npx hardhat run scripts/deploy.js --network sepolia
```

### 启动前端

```bash
# 在 stake-fe 目录下
# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，添加合约地址

# 启动开发服务器
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📋 功能说明

### 质押功能
- 选择质押池并输入质押数量
- 系统自动计算预期奖励
- 支持最小质押限制

### 解除质押
- 提交解除质押请求
- 等待锁定期结束
- 提取质押代币

### 奖励领取
- 实时查看待领取奖励
- 一键领取奖励代币
- 自动更新奖励状态

## 🔧 开发指南

### 合约开发
```bash
cd stake-contract

# 运行测试
npx hardhat test

# 本地部署
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

### 前端开发
```bash
cd stake-fe

# 类型检查
npm run type-check

# 构建生产版本
npm run build
```

## 📊 项目结构

```
yy-eth-stake/
├── stake-contract/          # 智能合约
│   ├── contracts/          # Solidity 合约
│   ├── scripts/           # 部署脚本
│   ├── test/              # 测试文件
│   └── hardhat.config.js  # Hardhat 配置
├── stake-fe/              # 前端应用
│   ├── src/
│   │   ├── components/    # React 组件
│   │   ├── pages/         # 页面文件
│   │   ├── hooks/         # 自定义 Hooks
│   │   └── utils/         # 工具函数
│   └── public/            # 静态资源
└── README.md
```

## 🔒 安全特性

- **访问控制**: 基于角色的权限管理
- **重入保护**: 防止重入攻击
- **输入验证**: 严格的参数检查
- **升级机制**: 支持合约升级
- **暂停功能**: 紧急情况下的暂停机制

## 🌐 在线演示

- **前端应用**: [https://stake.zyzy.info/](https://stake.zyzy.info/)
- **视频教程**: [https://k22zz.xetlk.com/s/1rt9AP](https://k22zz.xetlk.com/s/1rt9AP)

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📝 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系方式

- 项目维护者: [yy9331](https://github.com/yy9331)
- 项目链接: [https://github.com/yy9331/yy-eth-stake](https://github.com/yy9331/yy-eth-stake)

---

⭐ 如果这个项目对你有帮助，请给我们一个星标！
