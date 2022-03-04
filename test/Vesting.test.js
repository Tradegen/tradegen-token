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

    let tx = await tradegenToken.transfer()

    vesting = await VestingFactory.deploy(tradegenTokenAddress);
    await vesting.deployed();
    vestingAddress = vesting.address;
  });

  describe("#addBeneficiary", () => {
    it("no existing beneficiaries", async () => {
        let initialBalance = await tradegenToken.balanceOf(deployer.address);

        let tx = await tradegenToken.approve(tradegenStakingAddress, parseEther("10"));
        await tx.wait();

        let tx2 = await tradegenStaking.stake(parseEther("10"));
        await tx2.wait();

        let tx3 = await tradegenStaking.exit();
        await tx3.wait();

        let newBalance = await tradegenToken.balanceOf(deployer.address);
        expect(newBalance).to.equal(initialBalance);

        let balance = await tradegenStaking.balanceOf(deployer.address);
        expect(balance).to.equal(0);

        let totalSupply = await tradegenStaking.totalSupply();
        expect(totalSupply).to.equal(0);

        let sharePrice = await tradegenStaking.getSharePrice();
        expect(sharePrice).to.equal(parseEther("1"));

        let tx4 = await tradegenToken.approve(tradegenStakingAddress, parseEther("20"));
        await tx4.wait();

        let tx5 = await tradegenStaking.stake(parseEther("20"));
        await tx5.wait();

        balance = await tradegenStaking.balanceOf(deployer.address);
        expect(balance).to.equal(parseEther("20"));

        totalSupply = await tradegenStaking.totalSupply();
        expect(totalSupply).to.equal(parseEther("20"));

        sharePrice = await tradegenStaking.getSharePrice();
        expect(sharePrice).to.equal(parseEther("1"));
    });
  });
});