const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("YYStake", function () {
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

    // ========== 初始化测试 ==========
    describe("Initialization", function () {
        it("Should initialize correctly", async function () {
            expect(await stake.YY()).to.equal(yyToken.target);
            expect(await stake.startBlock()).to.equal(1);
            expect(await stake.endBlock()).to.equal(1000000);
            expect(await stake.YYPerBlock()).to.equal(ethers.parseUnits("1", 18));
        });
    });

    // ========== 添加质押池测试 ==========
    describe("Add Pool", function () {
        it("Should add ETH pool correctly", async function () {
            await stake.addPool(
                ethers.ZeroAddress,  // ETH pool
                100,                  // pool weight
                ethers.parseEther("1"), // min deposit amount
                100,                  // withdraw locked blocks
                true                  // with update
            );

            expect(await stake.poolLength()).to.equal(1);
        });
    });

    // ========== ETH 质押测试 ==========
    describe("ETH Staking", function () {
        beforeEach(async function () {
            await stake.addPool(
                ethers.ZeroAddress,
                100,
                ethers.parseEther("1"),
                100,
                true
            );
        });

        it("Should allow users to stake ETH", async function () {
            const stakeAmount = ethers.parseEther("2");
            await stake.connect(user1).depositETH({ value: stakeAmount });

            // 验证用户质押信息
            const userInfo = await stake.user(0, user1.address);
            expect(userInfo.stAmount).to.equal(stakeAmount);
        });

        it("Should calculate pending YY correctly", async function () {
            await stake.connect(user1).depositETH({ value: ethers.parseEther("2") });

            // 推进区块以获得奖励
            await ethers.provider.send("evm_mine", []);
            await ethers.provider.send("evm_mine", []);
            await ethers.provider.send("evm_mine", []);

            const pendingYY = await stake.pendingYY(0, user1.address);
            expect(pendingYY).to.be.gt(0);
        });

        it("Should allow users to claim rewards", async function () {
            await stake.connect(user1).depositETH({ value: ethers.parseEther("2") });

            // 推进区块以获得奖励
            await ethers.provider.send("evm_mine", []);
            await ethers.provider.send("evm_mine", []);
            await ethers.provider.send("evm_mine", []);

            const balanceBefore = await yyToken.balanceOf(user1.address);
            await stake.connect(user1).claim(0);
            const balanceAfter = await yyToken.balanceOf(user1.address);

            expect(balanceAfter).to.be.gt(balanceBefore);
        });
    });

    // ========== 管理员功能测试 ==========
    describe("Admin Functions", function () {
        it("Should allow admin to set YY per block", async function () {
            const newYYPerBlock = ethers.parseUnits("2", 18);
            await stake.setYYPerBlock(newYYPerBlock);
            expect(await stake.YYPerBlock()).to.equal(newYYPerBlock);
        });

        it("Should allow admin to set start block", async function () {
            const newStartBlock = 200;
            await stake.setStartBlock(newStartBlock);
            expect(await stake.startBlock()).to.equal(newStartBlock);
        });

        it("Should allow admin to set end block", async function () {
            const newEndBlock = 2000000;
            await stake.setEndBlock(newEndBlock);
            expect(await stake.endBlock()).to.equal(newEndBlock);
        });

        it("Should not allow non-admin to set YY per block", async function () {
            const newYYPerBlock = ethers.parseUnits("2", 18);
            await expect(
                stake.connect(user1).setYYPerBlock(newYYPerBlock)
            ).to.be.reverted;
        });
    });

    // ========== 错误处理测试 ==========
    describe("Error Handling", function () {
        beforeEach(async function () {
            await stake.addPool(
                ethers.ZeroAddress,
                100,
                ethers.parseEther("1"),
                100,
                true
            );
        });

        it("Should revert when deposit amount is too small", async function () {
            await expect(
                stake.connect(user1).depositETH({ value: ethers.parseEther("0.5") })
            ).to.be.revertedWith("deposit amount is too small");
        });
    });

    // ========== 辅助函数测试 ==========
    describe("Helper Functions", function () {
        it("Should calculate multiplier correctly", async function () {
            const multiplier = await stake.getMultiplier(1, 10);
            expect(multiplier).to.be.gt(0);
        });

        it("Should return correct pool length", async function () {
            expect(await stake.poolLength()).to.equal(0);
            
            await stake.addPool(
                ethers.ZeroAddress,
                100,
                ethers.parseEther("1"),
                100,
                true
            );
            expect(await stake.poolLength()).to.equal(1);
        });
    });
}); 