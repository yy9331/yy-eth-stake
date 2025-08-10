# YY Token Stake - DeFi Staking Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-blue.svg)](https://soliditylang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.4-blue.svg)](https://www.typescriptlang.org/)

English | [中文](README.md)

A decentralized staking platform based on Ethereum, supporting multiple token staking and reward distribution.

## 📖 Project Overview

YY Token Stake is a complete DeFi staking solution that includes smart contracts and frontend interface. Users can stake native tokens (ETH) or ERC20 tokens to earn YY Token rewards.

### 🌐 Project URL

[https://stake.zyzy.info/](https://stake.zyzy.info/) 

### 🌟 Core Features

- **Multi-Pool Staking**: Support for multiple staking pools, each configurable with different staking tokens and reward weights
- **Flexible Rewards**: Dynamic reward calculation based on staking amount and duration
- **Security Mechanisms**: Includes lock periods, minimum staking limits, and other security measures
- **Modern Frontend**: Built with Next.js + TypeScript + Tailwind CSS
- **Web3 Integration**: Support for mainstream wallets like MetaMask

## 🏗️ Technical Architecture

### Smart Contracts (stake-contract/)
- **Framework**: Hardhat + Solidity
- **Contracts**: YYStake.sol, YY.sol (reward token)
- **Network**: Sepolia Testnet
- **Security**: OpenZeppelin contract library

### Frontend Application (stake-fe/)
- **Framework**: Next.js 15 + React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Material-UI
- **Web3**: Viem + Wagmi + RainbowKit
- **State Management**: TanStack Query

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- MetaMask wallet
- Sepolia testnet ETH

### Install Dependencies

```bash
# Clone the project
git clone https://github.com/yy9331/yy-eth-stake.git
cd yy-eth-stake

# Install contract dependencies
cd stake-contract
npm install

# Install frontend dependencies
cd ../stake-fe
npm install
```

### Deploy Contracts

```bash
# In the stake-contract directory
# Configure environment variables
cp .env.example .env
# Edit .env file, add your private key and API key

# Compile contracts
npx hardhat compile

# Deploy to Sepolia
npx hardhat run scripts/deploy.js --network sepolia
```

### Start Frontend

```bash
# In the stake-fe directory
# Configure environment variables
cp .env.example .env
# Edit .env file, add contract addresses

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

## 📋 Feature Description

### Staking Function
- Select staking pool and enter staking amount
- System automatically calculates expected rewards
- Support for minimum staking limits

### Unstaking
- Submit unstaking request
- Wait for lock period to end
- Withdraw staked tokens

### Reward Claiming
- Real-time view of pending rewards
- One-click reward token claiming
- Automatic reward status updates

## 🔧 Development Guide

### Contract Development
```bash
cd stake-contract

# Run tests
npx hardhat test

# Local deployment
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

### Frontend Development
```bash
cd stake-fe

# Type checking
npm run type-check

# Build production version
npm run build
```

## 📊 Project Structure

```
yy-eth-stake/
├── stake-contract/          # Smart contracts
│   ├── contracts/          # Solidity contracts
│   ├── scripts/           # Deployment scripts
│   ├── test/              # Test files
│   └── hardhat.config.js  # Hardhat configuration
├── stake-fe/              # Frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page files
│   │   ├── hooks/         # Custom hooks
│   │   └── utils/         # Utility functions
│   └── public/            # Static assets
└── README.md
```

## 🔒 Security Features

- **Access Control**: Role-based permission management
- **Reentrancy Protection**: Protection against reentrancy attacks
- **Input Validation**: Strict parameter checking
- **Upgrade Mechanism**: Support for contract upgrades
- **Pause Functionality**: Emergency pause mechanism

## 🌐 Live Demo

- **Frontend Application**: [https://stake.zyzy.info/](https://stake.zyzy.info/)
- **Video Tutorial**: [https://k22zz.xetlk.com/s/1rt9AP](https://k22zz.xetlk.com/s/1rt9AP)

## 🤝 Contributing

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- Project Maintainer: [yy9331](https://github.com/yy9331)
- Project Link: [https://github.com/yy9331/yy-eth-stake](https://github.com/yy9331/yy-eth-stake)

---

⭐ If this project helps you, please give us a star!
