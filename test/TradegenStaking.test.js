const { expect } = require("chai");
const { parseEther } = require("@ethersproject/units");

describe("TradegenStaking", () => {
  let deployer;
  let otherUser;

  let tradegenToken;
  let tradegenTokenAddress;
  let TradegenTokenFactory;

  let tradegenStaking;
  let tradegenStakingAddress;
  let TradegenStakingFactory;
  
  before(async () => {
    const signers = await ethers.getSigners();
    deployer = signers[0];
    otherUser = signers[1];

    TradegenTokenFactory = await ethers.getContractFactory('TradegenToken');
    TradegenStakingFactory = await ethers.getContractFactory('TradegenStaking');

    tradegenToken = await TradegenTokenFactory.deploy(deployer.address, deployer.address, deployer.address, deployer.address, deployer.address, deployer.address, deployer.address);
    await tradegenToken.deployed();
    tradegenTokenAddress = tradegenToken.address;
  });

  beforeEach(async () => {
    const signers = await ethers.getSigners();
    deployer = signers[0];
    otherUser = signers[1];

    tradegenStaking = await TradegenStakingFactory.deploy(tradegenTokenAddress);
    await tradegenStaking.deployed();
    tradegenStakingAddress = tradegenStaking.address;
  });
  /*
  describe("#getSharePrice", () => {
    it("nothing staked and no TGEN", async () => {
        const sharePrice = await tradegenStaking.getSharePrice();
        expect(sharePrice).to.equal(parseEther("1"));
    });

    it("nothing staked and TGEN deposited", async () => {
        let tx = await tradegenToken.transfer(tradegenStakingAddress, parseEther("10"));
        await tx.wait();

        const sharePrice = await tradegenStaking.getSharePrice();
        expect(sharePrice).to.equal(parseEther("1"));
    });
  });

  describe("#stake", () => {
    it("stake with no TGEN prior; one investor", async () => {
        let tx = await tradegenToken.approve(tradegenStakingAddress, parseEther("10"));
        await tx.wait();

        let tx2 = await tradegenStaking.stake(parseEther("10"));
        expect(tx2).to.emit(tradegenStaking, "Stake");
        await tx2.wait();

        const balance = await tradegenStaking.balanceOf(deployer.address);
        expect(balance).to.equal(parseEther("10"));

        const totalSupply = await tradegenStaking.totalSupply();
        expect(totalSupply).to.equal(parseEther("10"));

        const sharePrice = await tradegenStaking.getSharePrice();
        expect(sharePrice).to.equal(parseEther("1"));
    });

    it("stake with no TGEN prior; multiple investors", async () => {
        let tx = await tradegenToken.approve(tradegenStakingAddress, parseEther("10"));
        await tx.wait();

        let tx2 = await tradegenStaking.stake(parseEther("10"));
        expect(tx2).to.emit(tradegenStaking, "Stake");
        await tx2.wait();

        let tx3 = await tradegenToken.transfer(otherUser.address, parseEther("5"));
        await tx3.wait();

        let tx4 = await tradegenToken.connect(otherUser).approve(tradegenStakingAddress, parseEther("5"));
        await tx4.wait();

        let tx5 = await tradegenStaking.connect(otherUser).stake(parseEther("5"));
        await tx5.wait();

        const balanceDeployer = await tradegenStaking.balanceOf(deployer.address);
        expect(balanceDeployer).to.equal(parseEther("10"));

        const balanceOther = await tradegenStaking.balanceOf(otherUser.address);
        expect(balanceOther).to.equal(parseEther("5"));

        const totalSupply = await tradegenStaking.totalSupply();
        expect(totalSupply).to.equal(parseEther("15"));

        const sharePrice = await tradegenStaking.getSharePrice();
        expect(sharePrice).to.equal(parseEther("1"));
    });

    it("stake with TGEN prior; one investor", async () => {
        let tx = await tradegenToken.transfer(tradegenStakingAddress, parseEther("10"));
        await tx.wait();

        let tx2 = await tradegenToken.approve(tradegenStakingAddress, parseEther("10"));
        await tx2.wait();

        let tx3 = await tradegenStaking.stake(parseEther("10"));
        expect(tx3).to.emit(tradegenStaking, "Stake");
        await tx3.wait();

        const balance = await tradegenStaking.balanceOf(deployer.address);
        expect(balance).to.equal(parseEther("10"));

        const totalSupply = await tradegenStaking.totalSupply();
        expect(totalSupply).to.equal(parseEther("10"));

        const sharePrice = await tradegenStaking.getSharePrice();
        expect(sharePrice).to.equal(parseEther("2"));
    });

    it("stake with TGEN prior; multiple investors", async () => {
        let tx = await tradegenToken.transfer(tradegenStakingAddress, parseEther("15"));
        await tx.wait();

        let tx2 = await tradegenToken.approve(tradegenStakingAddress, parseEther("10"));
        await tx2.wait();

        let tx3 = await tradegenStaking.stake(parseEther("10"));
        expect(tx3).to.emit(tradegenStaking, "Stake");
        await tx3.wait();

        let tx4 = await tradegenToken.transfer(otherUser.address, parseEther("5"));
        await tx4.wait();

        let tx5 = await tradegenToken.connect(otherUser).approve(tradegenStakingAddress, parseEther("5"));
        await tx5.wait();

        let tx6 = await tradegenStaking.connect(otherUser).stake(parseEther("5"));
        await tx6.wait();

        const balanceDeployer = await tradegenStaking.balanceOf(deployer.address);
        expect(balanceDeployer).to.equal(parseEther("10"));

        const balanceOther = await tradegenStaking.balanceOf(otherUser.address);
        expect(balanceOther).to.equal(parseEther("2"));

        const totalSupply = await tradegenStaking.totalSupply();
        expect(totalSupply).to.equal(parseEther("12"));

        const sharePrice = await tradegenStaking.getSharePrice();
        expect(sharePrice).to.equal(parseEther("2.5"));
    });

    it("stake with no TGEN prior, add TGEN after; one investor", async () => {
        let tx = await tradegenToken.approve(tradegenStakingAddress, parseEther("10"));
        await tx.wait();

        let tx2 = await tradegenStaking.stake(parseEther("10"));
        expect(tx2).to.emit(tradegenStaking, "Stake");
        await tx2.wait();

        let tx3 = await tradegenToken.transfer(tradegenStakingAddress, parseEther("10"));
        await tx3.wait();

        const balance = await tradegenStaking.balanceOf(deployer.address);
        expect(balance).to.equal(parseEther("10"));

        const totalSupply = await tradegenStaking.totalSupply();
        expect(totalSupply).to.equal(parseEther("10"));

        const sharePrice = await tradegenStaking.getSharePrice();
        expect(sharePrice).to.equal(parseEther("2"));
    });

    it("stake with no TGEN prior, add TGEN after; multiple investors", async () => {
        let tx = await tradegenToken.approve(tradegenStakingAddress, parseEther("10"));
        await tx.wait();

        let tx2 = await tradegenStaking.stake(parseEther("10"));
        expect(tx2).to.emit(tradegenStaking, "Stake");
        await tx2.wait();

        let tx3 = await tradegenToken.transfer(otherUser.address, parseEther("5"));
        await tx3.wait();

        let tx4 = await tradegenToken.connect(otherUser).approve(tradegenStakingAddress, parseEther("5"));
        await tx4.wait();

        let tx5 = await tradegenStaking.connect(otherUser).stake(parseEther("5"));
        await tx5.wait();

        let tx6 = await tradegenToken.transfer(tradegenStakingAddress, parseEther("15"));
        await tx6.wait();

        const balanceDeployer = await tradegenStaking.balanceOf(deployer.address);
        expect(balanceDeployer).to.equal(parseEther("10"));

        const balanceOther = await tradegenStaking.balanceOf(otherUser.address);
        expect(balanceOther).to.equal(parseEther("5"));

        const totalSupply = await tradegenStaking.totalSupply();
        expect(totalSupply).to.equal(parseEther("15"));

        const sharePrice = await tradegenStaking.getSharePrice();
        expect(sharePrice).to.equal(parseEther("2"));
    });

    it("stake with no TGEN prior, add TGEN after, and stake again; one investor", async () => {
        let tx = await tradegenToken.approve(tradegenStakingAddress, parseEther("10"));
        await tx.wait();

        let tx2 = await tradegenStaking.stake(parseEther("10"));
        expect(tx2).to.emit(tradegenStaking, "Stake");
        await tx2.wait();

        let tx3 = await tradegenToken.transfer(tradegenStakingAddress, parseEther("10"));
        await tx3.wait();

        let tx4 = await tradegenToken.approve(tradegenStakingAddress, parseEther("10"));
        await tx4.wait();

        let tx5 = await tradegenStaking.stake(parseEther("10"));
        await tx5.wait();

        const balance = await tradegenStaking.balanceOf(deployer.address);
        expect(balance).to.equal(parseEther("15"));

        const totalSupply = await tradegenStaking.totalSupply();
        expect(totalSupply).to.equal(parseEther("15"));

        const sharePrice = await tradegenStaking.getSharePrice();
        expect(sharePrice).to.equal(parseEther("2"));
    });

    it("stake with no TGEN prior, add TGEN after, and stake again; multiple investors", async () => {
        let tx = await tradegenToken.approve(tradegenStakingAddress, parseEther("10"));
        await tx.wait();

        let tx2 = await tradegenStaking.stake(parseEther("10"));
        expect(tx2).to.emit(tradegenStaking, "Stake");
        await tx2.wait();

        let tx3 = await tradegenToken.transfer(otherUser.address, parseEther("5"));
        await tx3.wait();

        let tx4 = await tradegenToken.connect(otherUser).approve(tradegenStakingAddress, parseEther("5"));
        await tx4.wait();

        let tx5 = await tradegenStaking.connect(otherUser).stake(parseEther("5"));
        await tx5.wait();

        let tx6 = await tradegenToken.transfer(tradegenStakingAddress, parseEther("15"));
        await tx6.wait();

        let tx7 = await tradegenToken.approve(tradegenStakingAddress, parseEther("10"));
        await tx7.wait();

        let tx8 = await tradegenStaking.stake(parseEther("10"));
        await tx8.wait();

        let tx9 = await tradegenToken.transfer(otherUser.address, parseEther("5"));
        await tx9.wait();

        let tx10 = await tradegenToken.connect(otherUser).approve(tradegenStakingAddress, parseEther("5"));
        await tx10.wait();

        let tx11 = await tradegenStaking.connect(otherUser).stake(parseEther("5"));
        await tx11.wait();

        const balanceDeployer = await tradegenStaking.balanceOf(deployer.address);
        expect(balanceDeployer).to.equal(parseEther("15"));

        const balanceOther = await tradegenStaking.balanceOf(otherUser.address);
        expect(balanceOther).to.equal(parseEther("7.5"));

        const totalSupply = await tradegenStaking.totalSupply();
        expect(totalSupply).to.equal(parseEther("22.5"));

        const sharePrice = await tradegenStaking.getSharePrice();
        expect(sharePrice).to.equal(parseEther("2"));
    });
  });*/

  describe("#withdraw", () => {/*
    it("withdraw with no TGEN prior", async () => {
        let tx = tradegenStaking.withdraw(parseEther("10"));
        await expect(tx).to.be.reverted;

        const balance = await tradegenStaking.balanceOf(deployer.address);
        expect(balance).to.equal(0);

        const totalSupply = await tradegenStaking.totalSupply();
        expect(totalSupply).to.equal(0);

        const sharePrice = await tradegenStaking.getSharePrice();
        expect(sharePrice).to.equal(parseEther("1"));
    });

    it("withdraw with TGEN prior; no added TGEN", async () => {
        let initialBalance = await tradegenToken.balanceOf(deployer.address);

        let tx = await tradegenToken.approve(tradegenStakingAddress, parseEther("10"));
        await tx.wait();

        let tx2 = await tradegenStaking.stake(parseEther("10"));
        await tx2.wait();

        let tx3 = await tradegenStaking.withdraw(parseEther("5"));
        await tx3.wait();

        let newBalance = await tradegenToken.balanceOf(deployer.address);
        let expectedTokenBalance = BigInt(initialBalance.toString()) - BigInt(5e18);

        expect(newBalance.toString()).to.equal(expectedTokenBalance.toString());

        const balance = await tradegenStaking.balanceOf(deployer.address);
        expect(balance).to.equal(parseEther("5"));

        const totalSupply = await tradegenStaking.totalSupply();
        expect(totalSupply).to.equal(parseEther("5"));

        const sharePrice = await tradegenStaking.getSharePrice();
        expect(sharePrice).to.equal(parseEther("1"));
    });

    it("withdraw with TGEN prior; added TGEN before withdrawing; one investor", async () => {
        let initialBalance = await tradegenToken.balanceOf(deployer.address);

        let tx = await tradegenToken.approve(tradegenStakingAddress, parseEther("10"));
        await tx.wait();

        let tx2 = await tradegenStaking.stake(parseEther("10"));
        await tx2.wait();

        let tx3 = await tradegenToken.transfer(tradegenStakingAddress, parseEther("10"));
        await tx3.wait();

        let tx4 = await tradegenStaking.withdraw(parseEther("5"));
        await tx4.wait();

        let newBalance = await tradegenToken.balanceOf(deployer.address);
        let expectedTokenBalance = BigInt(initialBalance.toString()) - BigInt(1e19);

        expect(newBalance.toString()).to.equal(expectedTokenBalance.toString());

        const balance = await tradegenStaking.balanceOf(deployer.address);
        expect(balance).to.equal(parseEther("5"));

        const totalSupply = await tradegenStaking.totalSupply();
        expect(totalSupply).to.equal(parseEther("5"));

        const sharePrice = await tradegenStaking.getSharePrice();
        expect(sharePrice).to.equal(parseEther("2"));
    });

    it("withdraw with TGEN prior; added TGEN after withdrawing; one investor", async () => {
        let initialBalance = await tradegenToken.balanceOf(deployer.address);

        let tx = await tradegenToken.approve(tradegenStakingAddress, parseEther("10"));
        await tx.wait();

        let tx2 = await tradegenStaking.stake(parseEther("10"));
        await tx2.wait();

        let tx3 = await tradegenStaking.withdraw(parseEther("5"));
        await tx3.wait();

        let tx4 = await tradegenToken.transfer(tradegenStakingAddress, parseEther("10"));
        await tx4.wait();

        let newBalance = await tradegenToken.balanceOf(deployer.address);
        let expectedTokenBalance = BigInt(initialBalance.toString()) - BigInt(15e18);

        expect(newBalance.toString()).to.equal(expectedTokenBalance.toString());

        const balance = await tradegenStaking.balanceOf(deployer.address);
        expect(balance).to.equal(parseEther("5"));

        const totalSupply = await tradegenStaking.totalSupply();
        expect(totalSupply).to.equal(parseEther("5"));

        const sharePrice = await tradegenStaking.getSharePrice();
        expect(sharePrice).to.equal(parseEther("3"));
    });*/
  });

  describe("#exit", () => {
    it("exit and stake again; one investor", async () => {
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