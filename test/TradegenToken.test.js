const { expect } = require("chai");
const { parseEther } = require("@ethersproject/units");
/*
describe("TradegenToken", () => {
  let deployer;
  let otherUser;

  let tradegenToken;
  let tradegenTokenAddress;
  let TradegenTokenFactory;

  let timelock;
  let timelockAddress1;
  let timelockAddress2;
  let timelockAddress3;
  let timelockAddress4;
  let timelockAddress5;
  let timelockAddress6;
  let TimelockFactory;
  
  before(async () => {
    const signers = await ethers.getSigners();
    deployer = signers[0];
    otherUser = signers[1];

    TradegenTokenFactory = await ethers.getContractFactory('TradegenToken');
    TimelockFactory = await ethers.getContractFactory('Timelock');

    timelock = await TimelockFactory.deploy(deployer.address, 86400 * 7);
    await timelock.deployed();
    timelockAddress1 = timelock.address;

    timelock = await TimelockFactory.deploy(deployer.address, 86400 * 7);
    await timelock.deployed();
    timelockAddress2 = timelock.address;

    timelock = await TimelockFactory.deploy(deployer.address, 86400 * 7);
    await timelock.deployed();
    timelockAddress3 = timelock.address;

    timelock = await TimelockFactory.deploy(deployer.address, 86400 * 7);
    await timelock.deployed();
    timelockAddress4 = timelock.address;

    timelock = await TimelockFactory.deploy(deployer.address, 86400 * 7);
    await timelock.deployed();
    timelockAddress5 = timelock.address;

    timelock = await TimelockFactory.deploy(deployer.address, 86400 * 7);
    await timelock.deployed();
    timelockAddress6 = timelock.address;

    tradegenToken = await TradegenTokenFactory.deploy(timelockAddress1, timelockAddress2, timelockAddress3, timelockAddress4, timelockAddress5, timelockAddress6);
    await tradegenToken.deployed();
    tradegenTokenAddress = tradegenToken.address;
  });
  
  describe("#deploy", () => {
    it("tokens distributed correctly", async () => {
        const balanceTeamEscrow = await tradegenToken.balanceOf(timelockAddress1);
        const balanceInvestorEscrow = await tradegenToken.balanceOf(timelockAddress2);
        const balanceCommunityFund = await tradegenToken.balanceOf(timelockAddress3);
        const balanceSeedLiquiditySupplier = await tradegenToken.balanceOf(timelockAddress4);
        const balanceLiquidityMiningEscrow = await tradegenToken.balanceOf(timelockAddress5);
        const balancePoolFarmingEscrow = await tradegenToken.balanceOf(timelockAddress6);
        const totalSupply = await tradegenToken.totalSupply();

        expect(balanceTeamEscrow).to.equal(parseEther("50000000")); // 50 million
        expect(balanceInvestorEscrow).to.equal(parseEther("50000000")); // 50 million
        expect(balanceCommunityFund).to.equal(parseEther("100000000")); // 100 million
        expect(balanceSeedLiquiditySupplier).to.equal(parseEther("1000000")); // 1 million
        expect(balanceLiquidityMiningEscrow).to.equal(parseEther("149000000")); // 149 million
        expect(balancePoolFarmingEscrow).to.equal(parseEther("250000000")); // 250 million
        expect(totalSupply).to.equal(parseEther("600000000")); // 600 million
    });
  });
});*/