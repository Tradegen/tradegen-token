const { ethers } = require("hardhat");
const { parseEther } = require("@ethersproject/units");

const TGEN_ADDRESS_TESTNET = "0xa9e37D0DC17C8B8Ed457Ab7cCC40b5785d4d11C0";
const TGEN_ADDRESS_MAINNET = "";

// Testnet.
const TEAM_ESCROW = "0xD1D76EdDB0245542c39700b35B897f5E51761b05";
const INVESTOR_ESCROW = "0x888Cb833060Ce93F3f402691e7516EBdA6D03Dd0";
const INSURANCE_FUND = "0x1393e1130b6ac3965a979b1EA6f5Ac6cBc902A96";
const DEVELOPMENT_FUND = "0x7bE1aDcEBBB0f92FD6EC6e95cd21c96f9a8d844c";
const COMMUNITY_FUND = "0xb246bA35Ed1f34b5145008e8677fa67F70e5FC61";
const SEED_LIQUIDITY_SUPPLIER = "0x5C8e3CB2afBC34C0d24AC0efC43f5c4a5A2FF28e";
const CROSS_CHAIN_LIQUIDITY_ESCROW = "0x2298938Cf7fc466aC4571DFF868862142A9C8779";
const LIQUIDITY_MINING_ESCROW = "0xa0974069D0E8f9905C915eE243DD91Dd07CC3267";
const POOL_FARMING_ESCROW = "0x203a828D246C5b556FBC3E3D073A7f5620C2750C";

async function initializeVestingContracts() {
    const signers = await ethers.getSigners();
    deployer = signers[0];
    
    let VestingFactory = await ethers.getContractFactory('Vesting');
    let teamVesting = VestingFactory.attach(TEAM_ESCROW);
    let investorVesting = VestingFactory.attach(INVESTOR_ESCROW);
    
    let tx = await teamVesting.initialize(TGEN_ADDRESS_TESTNET, parseEther("50000000"));
    await tx.wait();

    let tx2 = await investorVesting.initialize(TGEN_ADDRESS_TESTNET, parseEther("50000000"));
    await tx2.wait();

    let teamTokensToDistribute = await teamVesting.totalTokensToDistribute();
    let investorTokensToDistribute = await investorVesting.totalTokensToDistribute();
    console.log(teamTokensToDistribute.toString());
    console.log(investorTokensToDistribute.toString());
}

async function initializeSeedLiquidityContract() {
    const signers = await ethers.getSigners();
    deployer = signers[0];
    
    let SeedLiquidityFactory = await ethers.getContractFactory('SeedLiquidity');
    let seedLiquidity = SeedLiquidityFactory.attach(SEED_LIQUIDITY_SUPPLIER);
    
    let tx = await seedLiquidity.setTGEN(TGEN_ADDRESS_TESTNET);
    await tx.wait();

    let tradegenTokenAddress = await seedLiquidity.TGEN();
    console.log(tradegenTokenAddress);
}

async function supplySeedLiquidity() {
    const signers = await ethers.getSigners();
    deployer = signers[0];
    
    let SeedLiquidityFactory = await ethers.getContractFactory('SeedLiquidity');
    let seedLiquidity = SeedLiquidityFactory.attach(SEED_LIQUIDITY_SUPPLIER);
    
    let tx = await seedLiquidity.supplySeedLiquidity();
    await tx.wait();

    let tradegenTokenAddress = await seedLiquidity.TGEN();
    console.log(tradegenTokenAddress);
}
/*
initializeVestingContracts()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })

initializeSeedLiquidityContract()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })*/

supplySeedLiquidity()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })