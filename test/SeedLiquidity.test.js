const { expect } = require("chai");
const { parseEther } = require("@ethersproject/units");
/*
describe("SeedLiquidity", () => {
  let deployer;
  let otherUser;

  let tradegenToken;
  let tradegenTokenAddress;
  let mockCELO;
  let mockCELOAddress;
  let TradegenTokenFactory;

  let seedLiquidity;
  let seedLiquidityAddress;
  let SeedLiquidityFactory;

  let ubeswapFactory;
  let ubeswapFactoryAddress;
  let UbeswapFactoryFactory;

  let ubeswapRouter;
  let ubeswapRouterAddress;
  let UbeswapRouterFactory;

  let pairData;
  let pairDataAddress;
  let PairDataFactory;
  
  before(async () => {
    const signers = await ethers.getSigners();
    deployer = signers[0];
    otherUser = signers[1];

    TradegenTokenFactory = await ethers.getContractFactory('TradegenToken');
    SeedLiquidityFactory = await ethers.getContractFactory('SeedLiquidity');
    UbeswapFactoryFactory = await ethers.getContractFactory('UniswapV2Factory');
    UbeswapRouterFactory = await ethers.getContractFactory('UniswapV2Router02');
    PairDataFactory = await ethers.getContractFactory('PairData');

    tradegenToken = await TradegenTokenFactory.deploy(deployer.address, deployer.address, deployer.address, deployer.address, deployer.address, deployer.address, deployer.address, deployer.address, deployer.address);
    await tradegenToken.deployed();
    tradegenTokenAddress = tradegenToken.address;

    mockCELO = await TradegenTokenFactory.deploy(deployer.address, deployer.address, deployer.address, deployer.address, deployer.address, deployer.address, deployer.address, deployer.address, deployer.address);
    await mockCELO.deployed();
    mockCELOAddress = mockCELO.address;

    pairData = await PairDataFactory.deploy();
    await pairData.deployed();
    pairDataAddress = pairData.address;
  });

  beforeEach(async () => {
    const signers = await ethers.getSigners();
    deployer = signers[0];
    otherUser = signers[1];

    ubeswapFactory = await UbeswapFactoryFactory.deploy(deployer.address);
    await ubeswapFactory.deployed();
    ubeswapFactoryAddress = ubeswapFactory.address;

    ubeswapRouter = await UbeswapRouterFactory.deploy(ubeswapFactoryAddress);
    await ubeswapRouter.deployed();
    ubeswapRouterAddress = ubeswapRouter.address;

    seedLiquidity = await SeedLiquidityFactory.deploy(ubeswapRouterAddress, mockCELOAddress);
    await seedLiquidity.deployed();
    seedLiquidityAddress = seedLiquidity.address;

    let tx = await seedLiquidity.setTGEN(tradegenTokenAddress);
    await tx.wait();
  });
  
  describe("#supplySeedLiquidity", () => {
    it("not enough balance", async () => {
        let tx = seedLiquidity.supplySeedLiquidity();
        await expect(tx).to.be.reverted;
    });

    it("only owner", async () => {
        let tx = await tradegenToken.transfer(seedLiquidityAddress, parseEther("10"));
        await tx.wait();

        let tx2 = await mockCELO.transfer(seedLiquidityAddress, parseEther("10"));
        await tx2.wait();

        let tx3 = seedLiquidity.connect(otherUser).supplySeedLiquidity();
        await expect(tx3).to.be.reverted;
    });

    it("supply liquidity", async () => {
        let tx = await tradegenToken.transfer(seedLiquidityAddress, parseEther("10"));
        await tx.wait();

        let tx2 = await mockCELO.transfer(seedLiquidityAddress, parseEther("10"));
        await tx2.wait();

        let tx3 = await ubeswapFactory.createPair(tradegenTokenAddress, mockCELOAddress);
        await tx3.wait();

        let pair = await ubeswapFactory.getPair(tradegenTokenAddress, mockCELOAddress);
        console.log(pair);

        let tx4 = await seedLiquidity.supplySeedLiquidity();
        await tx4.wait();

        let totalSupply = await pairData.getTotalSupply(pair);
        expect(totalSupply).to.equal(parseEther("10"));
    });

    it("only can supply liquidity once", async () => {
        let tx = await tradegenToken.transfer(seedLiquidityAddress, parseEther("10"));
        await tx.wait();

        let tx2 = await mockCELO.transfer(seedLiquidityAddress, parseEther("10"));
        await tx2.wait();

        let tx3 = await ubeswapFactory.createPair(tradegenTokenAddress, mockCELOAddress);
        await tx3.wait();

        let pair = await ubeswapFactory.getPair(tradegenTokenAddress, mockCELOAddress);
        console.log(pair);

        let tx4 = await seedLiquidity.supplySeedLiquidity();
        await tx4.wait();

        let tx5 = await tradegenToken.transfer(seedLiquidityAddress, parseEther("10"));
        await tx5.wait();

        let tx6 = await mockCELO.transfer(seedLiquidityAddress, parseEther("10"));
        await tx6.wait();

        let tx7 = seedLiquidity.supplySeedLiquidity();
        await expect(tx7).to.be.reverted;

        let totalSupply = await pairData.getTotalSupply(pair);
        expect(totalSupply).to.equal(parseEther("10"));
    });
  });
});*/