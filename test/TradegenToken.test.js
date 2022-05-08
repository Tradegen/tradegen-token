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
  let timelockAddress7;
  let timelockAddress8;
  let timelockAddress9;
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

    timelock = await TimelockFactory.deploy(deployer.address, 86400 * 7);
    await timelock.deployed();
    timelockAddress7 = timelock.address;

    timelock = await TimelockFactory.deploy(deployer.address, 86400 * 7);
    await timelock.deployed();
    timelockAddress8 = timelock.address;

    timelock = await TimelockFactory.deploy(deployer.address, 86400 * 7);
    await timelock.deployed();
    timelockAddress9 = timelock.address;

    tradegenToken = await TradegenTokenFactory.deploy(timelockAddress1, timelockAddress2, timelockAddress3, timelockAddress4, timelockAddress5, timelockAddress6, timelockAddress7, timelockAddress8, timelockAddress9);
    await tradegenToken.deployed();
    tradegenTokenAddress = tradegenToken.address;
  });
  
  describe("#deploy", () => {
    it("tokens distributed correctly", async () => {
        const balanceTeamEscrow = await tradegenToken.balanceOf(timelockAddress1);
        const balanceInvestorEscrow = await tradegenToken.balanceOf(timelockAddress2);
        const balanceInsuranceFund = await tradegenToken.balanceOf(timelockAddress3);
        const balanceDevelopmentFund = await tradegenToken.balanceOf(timelockAddress4);
        const balanceCommunityFund = await tradegenToken.balanceOf(timelockAddress5);
        const balanceSeedLiquiditySupplier = await tradegenToken.balanceOf(timelockAddress6);
        const balanceCrossChainLiquidityEscrow = await tradegenToken.balanceOf(timelockAddress7);
        const balanceLiquidityMiningEscrow = await tradegenToken.balanceOf(timelockAddress8);
        const balancePoolFarmingEscrow = await tradegenToken.balanceOf(timelockAddress9);
        const totalSupply = await tradegenToken.totalSupply();

        expect(balanceTeamEscrow).to.equal(parseEther("50000000")); // 50 million
        expect(balanceInvestorEscrow).to.equal(parseEther("50000000")); // 50 million
        expect(balanceInsuranceFund).to.equal(parseEther("50000000")); // 50 million
        expect(balanceDevelopmentFund).to.equal(parseEther("50000000")); // 50 million
        expect(balanceCommunityFund).to.equal(parseEther("100000000")); // 100 million
        expect(balanceSeedLiquiditySupplier).to.equal(parseEther("1000000")); // 1 million
        expect(balanceLiquidityMiningEscrow).to.equal(parseEther("199000000")); // 199 million
        expect(balanceCrossChainLiquidityEscrow).to.equal(parseEther("200000000")); // 200 million
        expect(balancePoolFarmingEscrow).to.equal(parseEther("300000000")); // 300 million
        expect(totalSupply).to.equal(parseEther("1000000000")); // 1 billion
    });
  });
});*/