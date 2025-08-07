const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("YYStake Advanced", function () {
    let stake, yyToken, owner, user1, user2, user3;

    beforeEach(async function () {
        [owner, user1, user2, user3] = await ethers.getSigners();

        // 部署 YYToken
        const YYToken = await ethers.getContractFactory("YYToken");
        yyToken = await YYToken.deploy();

        // 部署 YYStake
        const YYStake = await ethers.getContractFactory("YYStake");
        stake = await YYStake.deploy();

        // 初始化 YYStake
        await stake.initialize(
            yyToken.target,  // YY token address
            1,               // startBlock
            1000000,         // endBlock
            ethers.parseUnits("1", 18) // YYPerBlock (1 YY per block)
        );

        // 给质押合约一些 YY 代币
        const tokenBalance = await yyToken.balanceOf(owner.address);
        await yyToken.transfer(stake.target, tokenBalance);
    });

    // ========== 多用户质押测试 ==========
    describe("Multi-User Staking", function () {
        beforeEach(async function () {
            await stake.addPool(
                ethers.ZeroAddress,
                100,
                ethers.parseEther("1"),
                100,
                true
            );
        });

        it("Should handle multiple users staking", async function () {
            // 用户1质押
            await stake.connect(user1).depositETH({ value: ethers.parseEther("2") });

            // 推进区块
            await ethers.provider.send("evm_mine", []);
            await ethers.provider.send("evm_mine", []);
            await ethers.provider.send("evm_mine", []);

            // 用户2质押
            await stake.connect(user2).depositETH({ value: ethers.parseEther("3") });

            // 推进更多区块
            await ethers.provider.send("evm_mine", []);
            await ethers.provider.send("evm_mine", []);
            await ethers.provider.send("evm_mine", []);

            // 检查待领取的奖励
            const pendingYY1 = await stake.pendingYY(0, user1.address);
            const pendingYY2 = await stake.pendingYY(0, user2.address);

            expect(pendingYY1).to.be.gt(0);
            expect(pendingYY2).to.be.gt(0);

            // 用户1应该获得更多奖励（质押时间更长）
            expect(pendingYY1).to.be.gt(pendingYY2);
        });
    });

    // ========== 解质押和提取测试 ==========
    describe("Unstake and Withdraw", function () {
        beforeEach(async function () {
            await stake.addPool(
                ethers.ZeroAddress,
                100,
                ethers.parseEther("1"),
                5, // 较短的锁定时间
                true
            );
        });

        it("Should handle unstake and withdraw flow", async function () {
            // 用户质押
            await stake.connect(user1).depositETH({ value: ethers.parseEther("2") });

            // 申请解质押
            await stake.connect(user1).unstake(0, ethers.parseEther("1"));

            // 检查用户信息
            const userInfo = await stake.user(0, user1.address);
            expect(userInfo.stAmount).to.equal(ethers.parseEther("1"));

            // 推进区块超过锁定时间
            await ethers.provider.send("evm_mine", []);
            await ethers.provider.send("evm_mine", []);
            await ethers.provider.send("evm_mine", []);
            await ethers.provider.send("evm_mine", []);
            await ethers.provider.send("evm_mine", []);
            await ethers.provider.send("evm_mine", []);

            // 提取解质押的 ETH
            const balanceBefore = await ethers.provider.getBalance(user1.address);
            await stake.connect(user1).withdraw(0);
            const balanceAfter = await ethers.provider.getBalance(user1.address);

            expect(balanceAfter).to.be.gt(balanceBefore);
        });

        it("Should not allow withdrawal during lock period", async function () {
            // 注意：这个测试已经在 beforeEach 中添加了池子，所以不需要重复添加
            await stake.connect(user1).depositETH({ value: ethers.parseEther("2") });
            await stake.connect(user1).unstake(0, ethers.parseEther("1"));

            // 尝试立即提取（应该没有可提取的金额）
            const balanceBefore = await ethers.provider.getBalance(user1.address);
            await stake.connect(user1).withdraw(0);
            const balanceAfter = await ethers.provider.getBalance(user1.address);

            // 在锁定期间，应该没有提取到任何 ETH（考虑 gas 费用）
            expect(balanceAfter).to.be.lte(balanceBefore);
        });
    });

    // ========== 多池子测试 ==========
    describe("Multi-Pool Staking", function () {
        it("Should handle multiple pools", async function () {
            // 添加第一个池子（必须是 ETH 池）
            await stake.addPool(
                ethers.ZeroAddress,
                100,
                ethers.parseEther("1"),
                100,
                true
            );

            // 添加第二个池子（不能是 ETH 池）
            await stake.addPool(
                "0x1234567890123456789012345678901234567890", // 模拟代币地址
                200,
                ethers.parseEther("0.5"),
                50,
                true
            );

            // 在池子0中质押 ETH
            await stake.connect(user1).depositETH({ value: ethers.parseEther("2") });

            // 推进区块
            await ethers.provider.send("evm_mine", []);
            await ethers.provider.send("evm_mine", []);
            await ethers.provider.send("evm_mine", []);

            // 检查两个池子的待领取奖励
            const pendingYY0 = await stake.pendingYY(0, user1.address);
            const pendingYY1 = await stake.pendingYY(1, user1.address);

            expect(pendingYY0).to.be.gt(0);
            expect(pendingYY1).to.equal(0); // 池子1没有质押
        });
    });

    // ========== 管理员功能测试 ==========
    describe("Admin Functions", function () {
        it("Should handle pause and unpause", async function () {
            await stake.addPool(
                ethers.ZeroAddress,
                100,
                ethers.parseEther("1"),
                100,
                true
            );

            // 暂停提取
            await stake.pauseWithdraw();
            expect(await stake.withdrawPaused()).to.be.true;

            // 暂停领取
            await stake.pauseClaim();
            expect(await stake.claimPaused()).to.be.true;

            // 恢复功能
            await stake.unpauseWithdraw();
            expect(await stake.withdrawPaused()).to.be.false;

            await stake.unpauseClaim();
            expect(await stake.claimPaused()).to.be.false;
        });

        it("Should allow setting pool weight", async function () {
            await stake.addPool(
                ethers.ZeroAddress,
                100,
                ethers.parseEther("1"),
                100,
                true
            );

            // 设置新的池子权重
            await stake.setPoolWeight(0, 200, false);

            // 验证权重设置成功
            const poolInfo = await stake.pool(0);
            expect(poolInfo.poolWeight).to.equal(200);
        });
    });

    // ========== 边界情况测试 ==========
    describe("Edge Cases", function () {
        beforeEach(async function () {
            await stake.addPool(
                ethers.ZeroAddress,
                100,
                ethers.parseEther("1"),
                100,
                true
            );
        });

        it("Should handle zero deposit amount", async function () {
            await expect(
                stake.connect(user1).depositETH({ value: 0 })
            ).to.be.revertedWith("deposit amount is too small");
        });

        it("Should handle repeated claims", async function () {
            await stake.connect(user1).depositETH({ value: ethers.parseEther("2") });

            // 推进区块
            await ethers.provider.send("evm_mine", []);
            await ethers.provider.send("evm_mine", []);
            await ethers.provider.send("evm_mine", []);

            // 第一次领取
            const balanceBefore1 = await yyToken.balanceOf(user1.address);
            await stake.connect(user1).claim(0);
            const balanceAfter1 = await yyToken.balanceOf(user1.address);

            expect(balanceAfter1).to.be.gt(balanceBefore1);

            // 推进更多区块以获得新的奖励
            await ethers.provider.send("evm_mine", []);
            await ethers.provider.send("evm_mine", []);
            await ethers.provider.send("evm_mine", []);
            await ethers.provider.send("evm_mine", []);
            await ethers.provider.send("evm_mine", []);

            // 再次领取（应该有新的奖励）
            const balanceBefore2 = await yyToken.balanceOf(user1.address);
            await stake.connect(user1).claim(0);
            const balanceAfter2 = await yyToken.balanceOf(user1.address);

            expect(balanceAfter2).to.be.gt(balanceBefore2);
        });
    });

    // ========== 复杂场景测试 ==========
    describe("Complex Scenarios", function () {
        it("Should handle complex staking scenario", async function () {
            // 添加池子
            await stake.addPool(
                ethers.ZeroAddress,
                100,
                ethers.parseEther("1"),
                5, // 短锁定时间
                true
            );

            // 用户1质押
            await stake.connect(user1).depositETH({ value: ethers.parseEther("2") });

            // 推进区块
            await ethers.provider.send("evm_mine", []);
            await ethers.provider.send("evm_mine", []);
            await ethers.provider.send("evm_mine", []);

            // 用户2质押
            await stake.connect(user2).depositETH({ value: ethers.parseEther("3") });

            // 推进更多区块
            await ethers.provider.send("evm_mine", []);
            await ethers.provider.send("evm_mine", []);
            await ethers.provider.send("evm_mine", []);

            // 用户1申请解质押
            await stake.connect(user1).unstake(0, ethers.parseEther("1"));

            // 用户2领取奖励
            const balanceBefore = await yyToken.balanceOf(user2.address);
            await stake.connect(user2).claim(0);
            const balanceAfter = await yyToken.balanceOf(user2.address);

            // 验证用户2获得了奖励
            expect(balanceAfter).to.be.gt(balanceBefore);

            // 推进区块超过锁定时间
            await ethers.provider.send("evm_mine", []);
            await ethers.provider.send("evm_mine", []);
            await ethers.provider.send("evm_mine", []);
            await ethers.provider.send("evm_mine", []);
            await ethers.provider.send("evm_mine", []);
            await ethers.provider.send("evm_mine", []);

            // 用户1提取解质押的 ETH
            const ethBalanceBefore = await ethers.provider.getBalance(user1.address);
            await stake.connect(user1).withdraw(0);
            const ethBalanceAfter = await ethers.provider.getBalance(user1.address);

            expect(ethBalanceAfter).to.be.gt(ethBalanceBefore);
        });
    });

    // ========== 辅助函数测试 ==========
    describe("Helper Functions", function () {
        it("Should handle mass update pools", async function () {
            await stake.addPool(
                ethers.ZeroAddress,
                100,
                ethers.parseEther("1"),
                100,
                true
            );

            // 测试批量更新池子
            await stake.massUpdatePools();

            // 验证更新成功
            expect(await stake.poolLength()).to.equal(1);
        });

        it("Should handle update pool", async function () {
            await stake.addPool(
                ethers.ZeroAddress,
                100,
                ethers.parseEther("1"),
                100,
                true
            );

            // 更新池子信息
            await stake.updatePool(0, ethers.parseEther("2"), 200);

            // 验证更新成功
            const poolInfo = await stake.pool(0);
            expect(poolInfo.minDepositAmount).to.equal(ethers.parseEther("2"));
            expect(poolInfo.unstakeLockedBlocks).to.equal(200);
        });
    });
}); 