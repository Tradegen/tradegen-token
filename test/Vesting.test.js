const { expect } = require("chai");
const { parseEther } = require("@ethersproject/units");

describe("Vesting", () => {
  let deployer;
  let otherUser;

  let tradegenToken;
  let tradegenTokenAddress;
  let TradegenTokenFactory;

  let vesting;
  let vestingAddress;
  let VestingFactory;

  const ONE_WEEK = 86400 * 7;
  
  before(async () => {
    const signers = await ethers.getSigners();
    deployer = signers[0];
    otherUser = signers[1];

    TradegenTokenFactory = await ethers.getContractFactory('TradegenToken');
    VestingFactory = await ethers.getContractFactory('TestVesting');

    tradegenToken = await TradegenTokenFactory.deploy(deployer.address, deployer.address, deployer.address, deployer.address, deployer.address, deployer.address, deployer.address);
    await tradegenToken.deployed();
    tradegenTokenAddress = tradegenToken.address;
  });

  beforeEach(async () => {
    const signers = await ethers.getSigners();
    deployer = signers[0];
    otherUser = signers[1];

    vesting = await VestingFactory.deploy(tradegenTokenAddress);
    await vesting.deployed();
    vestingAddress = vesting.address;

    let tx = await tradegenToken.transfer(vestingAddress, parseEther("10000"));
    await tx.wait();

    let tx2 = await vesting.initialize(parseEther("10000"));
    await tx2.wait();
  });
  /*
  describe("#addBeneficiary", () => {
    it("no existing beneficiaries", async () => {
        let current = await vesting.getCurrentTime();

        let tx = await vesting.addBeneficiary(otherUser.address, Number(current) + ONE_WEEK, 12, parseEther("12"));
        expect(tx).to.emit(vesting, "AddedBeneficiary");
        await tx.wait();

        let totalTokensDistributed = await vesting.totalTokensDistributed();
        expect(totalTokensDistributed).to.equal(0);

        let tokensLeftToDistribute = await vesting.tokensLeftToDistribute();
        expect(tokensLeftToDistribute).to.equal(parseEther("9988"));

        let tokensVesting = await vesting.tokensVesting();
        expect(tokensVesting).to.equal(parseEther("12"));

        let claimedTokens = await vesting.claimedTokens(otherUser.address);
        expect(claimedTokens).to.equal(0);

        let beneficiaries = await vesting.getBeneficiaries();
        expect(beneficiaries.length).to.equal(1);
        expect(beneficiaries[0]).to.equal(otherUser.address);

        let schedule = await vesting.schedules(otherUser.address);
        expect(schedule.isActive).to.be.true;
        expect(schedule.startTime).to.equal(Number(current) + ONE_WEEK);
        expect(schedule.endTime).to.equal(Number(current) + (ONE_WEEK * 13));
        expect(schedule.lastClaimTime).to.equal(Number(current) + ONE_WEEK);
        expect(schedule.numberOfTokens).to.equal(parseEther("12"));
    });

    it("different beneficiary", async () => {
        let current = await vesting.getCurrentTime();

        let tx = await vesting.addBeneficiary(otherUser.address, Number(current) + ONE_WEEK, 12, parseEther("12"));
        expect(tx).to.emit(vesting, "AddedBeneficiary");
        await tx.wait();

        let tx2 = await vesting.addBeneficiary(deployer.address, Number(current) + ONE_WEEK, 4, parseEther("4"));
        await tx2.wait();

        let totalTokensDistributed = await vesting.totalTokensDistributed();
        expect(totalTokensDistributed).to.equal(0);

        let tokensLeftToDistribute = await vesting.tokensLeftToDistribute();
        expect(tokensLeftToDistribute).to.equal(parseEther("9984"));

        let tokensVesting = await vesting.tokensVesting();
        expect(tokensVesting).to.equal(parseEther("16"));

        let claimedTokensOther = await vesting.claimedTokens(otherUser.address);
        expect(claimedTokensOther).to.equal(0);

        let claimedTokensDeployer = await vesting.claimedTokens(deployer.address);
        expect(claimedTokensDeployer).to.equal(0);

        let beneficiaries = await vesting.getBeneficiaries();
        expect(beneficiaries.length).to.equal(2);
        expect(beneficiaries[0]).to.equal(otherUser.address);
        expect(beneficiaries[1]).to.equal(deployer.address);

        let scheduleOther = await vesting.schedules(otherUser.address);
        expect(scheduleOther.isActive).to.be.true;
        expect(scheduleOther.startTime).to.equal(Number(current) + ONE_WEEK);
        expect(scheduleOther.endTime).to.equal(Number(current) + (ONE_WEEK * 13));
        expect(scheduleOther.lastClaimTime).to.equal(Number(current) + ONE_WEEK);
        expect(scheduleOther.numberOfTokens).to.equal(parseEther("12"));

        let scheduleDeployer = await vesting.schedules(deployer.address);
        expect(scheduleDeployer.isActive).to.be.true;
        expect(scheduleDeployer.startTime).to.equal(Number(current) + ONE_WEEK);
        expect(scheduleDeployer.endTime).to.equal(Number(current) + (ONE_WEEK * 5));
        expect(scheduleDeployer.lastClaimTime).to.equal(Number(current) + ONE_WEEK);
        expect(scheduleDeployer.numberOfTokens).to.equal(parseEther("4"));
    });

    it("same beneficiary", async () => {
        let current = await vesting.getCurrentTime();

        let tx = await vesting.addBeneficiary(otherUser.address, Number(current) + ONE_WEEK, 12, parseEther("12"));
        expect(tx).to.emit(vesting, "AddedBeneficiary");
        await tx.wait();

        let tx2 = vesting.addBeneficiary(otherUser.address, Number(current) + ONE_WEEK, 4, parseEther("4"));
        await expect(tx2).to.be.reverted;

        let totalTokensDistributed = await vesting.totalTokensDistributed();
        expect(totalTokensDistributed).to.equal(0);

        let tokensLeftToDistribute = await vesting.tokensLeftToDistribute();
        expect(tokensLeftToDistribute).to.equal(parseEther("9988"));

        let tokensVesting = await vesting.tokensVesting();
        expect(tokensVesting).to.equal(parseEther("12"));

        let claimedTokensOther = await vesting.claimedTokens(otherUser.address);
        expect(claimedTokensOther).to.equal(0);

        let beneficiaries = await vesting.getBeneficiaries();
        expect(beneficiaries.length).to.equal(1);
        expect(beneficiaries[0]).to.equal(otherUser.address);

        let scheduleOther = await vesting.schedules(otherUser.address);
        expect(scheduleOther.isActive).to.be.true;
        expect(scheduleOther.startTime).to.equal(Number(current) + ONE_WEEK);
        expect(scheduleOther.endTime).to.equal(Number(current) + (ONE_WEEK * 13));
        expect(scheduleOther.lastClaimTime).to.equal(Number(current) + ONE_WEEK);
        expect(scheduleOther.numberOfTokens).to.equal(parseEther("12"));
    });

    it("same beneficiary and schedule finished without claiming", async () => {
        let current = await vesting.getCurrentTime();

        let tx = await vesting.addBeneficiary(otherUser.address, Number(current) + ONE_WEEK, 12, parseEther("12"));
        expect(tx).to.emit(vesting, "AddedBeneficiary");
        await tx.wait();

        // Simulate schedule finishing
        let tx2 = await vesting.setStartTime(otherUser.address, Number(current) - (ONE_WEEK * 12));
        await tx2.wait();

        let tx3 = vesting.addBeneficiary(otherUser.address, Number(current) + ONE_WEEK, 4, parseEther("4"));
        await expect(tx3).to.be.reverted;

        let totalTokensDistributed = await vesting.totalTokensDistributed();
        expect(totalTokensDistributed).to.equal(0);

        let tokensLeftToDistribute = await vesting.tokensLeftToDistribute();
        expect(tokensLeftToDistribute).to.equal(parseEther("9988"));

        let tokensVesting = await vesting.tokensVesting();
        expect(tokensVesting).to.equal(parseEther("12"));

        let claimedTokensOther = await vesting.claimedTokens(otherUser.address);
        expect(claimedTokensOther).to.equal(0);

        let beneficiaries = await vesting.getBeneficiaries();
        expect(beneficiaries.length).to.equal(1);
        expect(beneficiaries[0]).to.equal(otherUser.address);

        let scheduleOther = await vesting.schedules(otherUser.address);
        expect(scheduleOther.isActive).to.be.true;
        expect(scheduleOther.startTime).to.equal(Number(current) - (ONE_WEEK * 12));
        expect(scheduleOther.endTime).to.equal(Number(current) + (ONE_WEEK * 13));
        expect(scheduleOther.lastClaimTime).to.equal(Number(current) + ONE_WEEK);
        expect(scheduleOther.numberOfTokens).to.equal(parseEther("12"));
    });

    it("same beneficiary and schedule finished, rewards claimed", async () => {
        let current = await vesting.getCurrentTime();

        let tx = await vesting.addBeneficiary(otherUser.address, Number(current) + ONE_WEEK, 12, parseEther("12"));
        expect(tx).to.emit(vesting, "AddedBeneficiary");
        await tx.wait();

        // Simulate schedule finishing
        let tx2 = await vesting.setSchedule(otherUser.address, false, Number(current) - (ONE_WEEK * 12), Number(current) + ONE_WEEK, 12, parseEther("12"));
        await tx2.wait();

        let tx3 = await vesting.addBeneficiary(otherUser.address, Number(current) + ONE_WEEK, 4, parseEther("4"));
        await tx3.wait();

        let totalTokensDistributed = await vesting.totalTokensDistributed();
        expect(totalTokensDistributed).to.equal(0);

        let tokensLeftToDistribute = await vesting.tokensLeftToDistribute();
        expect(tokensLeftToDistribute).to.equal(parseEther("9984"));

        let tokensVesting = await vesting.tokensVesting();
        expect(tokensVesting).to.equal(parseEther("16"));

        let claimedTokensOther = await vesting.claimedTokens(otherUser.address);
        expect(claimedTokensOther).to.equal(0);

        let beneficiaries = await vesting.getBeneficiaries();
        expect(beneficiaries.length).to.equal(1);
        expect(beneficiaries[0]).to.equal(otherUser.address);

        let scheduleOther = await vesting.schedules(otherUser.address);
        expect(scheduleOther.isActive).to.be.true;
        expect(scheduleOther.startTime).to.equal(Number(current) + ONE_WEEK);
        expect(scheduleOther.endTime).to.equal(Number(current) + (ONE_WEEK * 5));
        expect(scheduleOther.lastClaimTime).to.equal(Number(current) + ONE_WEEK);
        expect(scheduleOther.numberOfTokens).to.equal(parseEther("4"));
    });
  });*/

  describe("#claimTokens", () => {/*
    it("try to claim tokens with no schedule", async () => {
        let tx = vesting.claimTokens();
        await expect(tx).to.be.reverted;

        let totalTokensDistributed = await vesting.totalTokensDistributed();
        expect(totalTokensDistributed).to.equal(0);

        let tokensLeftToDistribute = await vesting.tokensLeftToDistribute();
        expect(tokensLeftToDistribute).to.equal(parseEther("10000"));

        let tokensVesting = await vesting.tokensVesting();
        expect(tokensVesting).to.equal(parseEther("0"));

        let claimedTokens = await vesting.claimedTokens(otherUser.address);
        expect(claimedTokens).to.equal(0);

        let beneficiaries = await vesting.getBeneficiaries();
        expect(beneficiaries.length).to.equal(0);

        let schedule = await vesting.schedules(otherUser.address);
        expect(schedule.isActive).to.be.false;
        expect(schedule.startTime).to.equal(0);
        expect(schedule.endTime).to.equal(0);
        expect(schedule.lastClaimTime).to.equal(0);
        expect(schedule.numberOfTokens).to.equal(0);
    });

    it("try to claim tokens and schedule has not started", async () => {
        let current = await vesting.getCurrentTime();

        let tx = await vesting.addBeneficiary(otherUser.address, Number(current) + ONE_WEEK, 12, parseEther("12"));
        await tx.wait();

        let tx2 = vesting.claimTokens();
        await expect(tx2).to.be.reverted;

        let totalTokensDistributed = await vesting.totalTokensDistributed();
        expect(totalTokensDistributed).to.equal(0);

        let tokensLeftToDistribute = await vesting.tokensLeftToDistribute();
        expect(tokensLeftToDistribute).to.equal(parseEther("9988"));

        let tokensVesting = await vesting.tokensVesting();
        expect(tokensVesting).to.equal(parseEther("12"));

        let claimedTokens = await vesting.claimedTokens(otherUser.address);
        expect(claimedTokens).to.equal(0);

        let beneficiaries = await vesting.getBeneficiaries();
        expect(beneficiaries.length).to.equal(1);
        expect(beneficiaries[0]).to.equal(otherUser.address);

        let scheduleOther = await vesting.schedules(otherUser.address);
        expect(scheduleOther.isActive).to.be.true;
        expect(scheduleOther.startTime).to.equal(Number(current) + ONE_WEEK);
        expect(scheduleOther.endTime).to.equal(Number(current) + (ONE_WEEK * 13));
        expect(scheduleOther.lastClaimTime).to.equal(Number(current) + ONE_WEEK);
        expect(scheduleOther.numberOfTokens).to.equal(parseEther("12"));
    });

    it("schedule started; one beneficiary", async () => {
        let current = await vesting.getCurrentTime();

        let tx = await vesting.addBeneficiary(otherUser.address, Number(current) + ONE_WEEK, 12, parseEther("12"));
        await tx.wait();

        // Simulate 2 weeks elapsed
        let tx2 = await vesting.setSchedule(otherUser.address, true, Number(current) - (ONE_WEEK * 2), Number(current) + (ONE_WEEK * 10), Number(current) - (ONE_WEEK * 2), parseEther("12"));
        await tx2.wait();

        let tx3 = await vesting.connect(otherUser).claimTokens();
        await tx3.wait();

        let newBalance = await tradegenToken.balanceOf(otherUser.address);
        console.log(newBalance.toString());
        let expectedBalance = BigInt(newBalance) / BigInt(1e15);
        expect(expectedBalance.toString()).to.equal("2000");

        let totalTokensDistributed = await vesting.totalTokensDistributed();
        let expectedTokensDistributed = BigInt(totalTokensDistributed) / BigInt(1e15);
        expect(expectedTokensDistributed.toString()).to.equal("2000");

        let tokensLeftToDistribute = await vesting.tokensLeftToDistribute();
        expect(tokensLeftToDistribute).to.equal(parseEther("9988"));

        let tokensVesting = await vesting.tokensVesting();
        let expectedTokensVesting = BigInt(1) + (BigInt(tokensVesting) / BigInt(1e15));
        expect(expectedTokensVesting.toString()).to.equal("10000");

        let claimedTokens = await vesting.claimedTokens(otherUser.address);
        let expectedClaimedTokens = BigInt(claimedTokens) / BigInt(1e15);
        expect(expectedClaimedTokens.toString()).to.equal("2000");

        let beneficiaries = await vesting.getBeneficiaries();
        expect(beneficiaries.length).to.equal(1);
        expect(beneficiaries[0]).to.equal(otherUser.address);

        let scheduleOther = await vesting.schedules(otherUser.address);
        expect(scheduleOther.isActive).to.be.true;
        expect(scheduleOther.startTime).to.equal(Number(current) - (ONE_WEEK * 2));
        expect(scheduleOther.endTime).to.equal(Number(current) + (ONE_WEEK * 10));
        expect(scheduleOther.lastClaimTime).to.equal(Number(current) + 3);
        expect(scheduleOther.numberOfTokens).to.equal(parseEther("12"));
    });

    it("schedule ended; one beneficiary", async () => {
        let current = await vesting.getCurrentTime();

        let tx = await vesting.addBeneficiary(otherUser.address, Number(current) + ONE_WEEK, 12, parseEther("12"));
        await tx.wait();

        // Simulate 2 weeks elapsed
        let tx2 = await vesting.setSchedule(otherUser.address, true, Number(current) - (ONE_WEEK * 11), Number(current) - 100, Number(current) - (ONE_WEEK * 11), parseEther("12"));
        await tx2.wait();

        let tx3 = await vesting.connect(otherUser).claimTokens();
        expect(tx3).to.emit(vesting, "ClaimedTokens");
        await tx3.wait();

        let newBalance = await tradegenToken.balanceOf(otherUser.address);
        expect(newBalance).to.equal(parseEther("12"));

        let totalTokensDistributed = await vesting.totalTokensDistributed();
        expect(totalTokensDistributed).to.equal(parseEther("12"));

        let tokensLeftToDistribute = await vesting.tokensLeftToDistribute();
        expect(tokensLeftToDistribute).to.equal(parseEther("9988"));

        let tokensVesting = await vesting.tokensVesting();
        expect(tokensVesting).to.equal(0);

        let claimedTokens = await vesting.claimedTokens(otherUser.address);
        expect(claimedTokens).to.equal(parseEther("12"));

        let beneficiaries = await vesting.getBeneficiaries();
        expect(beneficiaries.length).to.equal(1);
        expect(beneficiaries[0]).to.equal(otherUser.address);

        let scheduleOther = await vesting.schedules(otherUser.address);
        expect(scheduleOther.isActive).to.be.false;
        expect(scheduleOther.startTime).to.equal(Number(current) - (ONE_WEEK * 11));
        expect(scheduleOther.endTime).to.equal(Number(current) - 100);
        expect(scheduleOther.lastClaimTime).to.equal(Number(current) + 3);
        expect(scheduleOther.numberOfTokens).to.equal(parseEther("12"));
    });*/

    it("schedule ended and try to claim again", async () => {
        let current = await vesting.getCurrentTime();

        let tx = await vesting.addBeneficiary(otherUser.address, Number(current) + ONE_WEEK, 12, parseEther("12"));
        await tx.wait();

        // Simulate 2 weeks elapsed
        let tx2 = await vesting.setSchedule(otherUser.address, true, Number(current) - (ONE_WEEK * 11), Number(current) - 100, Number(current) - (ONE_WEEK * 11), parseEther("12"));
        await tx2.wait();

        let tx3 = await vesting.connect(otherUser).claimTokens();
        expect(tx3).to.emit(vesting, "ClaimedTokens");
        await tx3.wait();

        let tx4 = vesting.claimTokens();
        await expect(tx4).to.be.reverted;

        let newBalance = await tradegenToken.balanceOf(otherUser.address);
        expect(newBalance).to.equal(parseEther("12"));

        let totalTokensDistributed = await vesting.totalTokensDistributed();
        expect(totalTokensDistributed).to.equal(parseEther("12"));

        let tokensLeftToDistribute = await vesting.tokensLeftToDistribute();
        expect(tokensLeftToDistribute).to.equal(parseEther("9988"));

        let tokensVesting = await vesting.tokensVesting();
        expect(tokensVesting).to.equal(0);

        let claimedTokens = await vesting.claimedTokens(otherUser.address);
        expect(claimedTokens).to.equal(parseEther("12"));

        let beneficiaries = await vesting.getBeneficiaries();
        expect(beneficiaries.length).to.equal(1);
        expect(beneficiaries[0]).to.equal(otherUser.address);

        let scheduleOther = await vesting.schedules(otherUser.address);
        expect(scheduleOther.isActive).to.be.false;
        expect(scheduleOther.startTime).to.equal(Number(current) - (ONE_WEEK * 11));
        expect(scheduleOther.endTime).to.equal(Number(current) - 100);
        expect(scheduleOther.lastClaimTime).to.equal(Number(current) + 3);
        expect(scheduleOther.numberOfTokens).to.equal(parseEther("12"));
    });
  });
});