const { ethers } = require("hardhat");

const TGEN_ADDRESS_TESTNET = "0xa9e37D0DC17C8B8Ed457Ab7cCC40b5785d4d11C0";
const TGEN_ADDRESS_MAINNET = "";

const CELO_ADDRESS_TESTNET = "0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9";
const CELO_ADDRESS_MAINNET = "0x471EcE3750Da237f93B8E339c536989b8978a438";

const UBESWAP_ROUTER_ADDRESS_TESTNET = "0xe3d8bd6aed4f159bc8000a9cd47cffdb95f96121";
const UBESWAP_ROUTER_ADDRESS_MAINNET = "0xe3d8bd6aed4f159bc8000a9cd47cffdb95f96121";

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

async function deployVestingContract() {
    const signers = await ethers.getSigners();
    deployer = signers[0];
    
    let VestingFactory = await ethers.getContractFactory('Vesting');
    
    let vesting = await VestingFactory.deploy();
    await vesting.deployed();
    let vestingAddress = vesting.address;
    console.log("Vesting: " + vestingAddress);
}

async function deployStakingContract() {
    const signers = await ethers.getSigners();
    deployer = signers[0];
    
    let StakingFactory = await ethers.getContractFactory('TradegenStaking');
    
    let staking = await StakingFactory.deploy(TGEN_ADDRESS_TESTNET);
    await staking.deployed();
    let stakingAddress = staking.address;
    console.log("TradegenStaking: " + stakingAddress);
}

async function deploySeedLiquidityContract() {
    const signers = await ethers.getSigners();
    deployer = signers[0];
    
    let SeedLiquidityFactory = await ethers.getContractFactory('SeedLiquidity');
    
    let seedLiquidity = await SeedLiquidityFactory.deploy(UBESWAP_ROUTER_ADDRESS_TESTNET, CELO_ADDRESS_TESTNET);
    await seedLiquidity.deployed();
    let seedLiquidityAddress = seedLiquidity.address;
    console.log("SeedLiquidity: " + seedLiquidityAddress);
}

async function deployTimelockContract() {
    const signers = await ethers.getSigners();
    deployer = signers[0];
    
    let TimelockFactory = await ethers.getContractFactory('Timelock');

    // Number of seconds in 2 days.
    let delay = 60 * 60 * 24 * 2;
    
    let timelock = await TimelockFactory.deploy(deployer.address, delay);
    await timelock.deployed();
    let timelockAddress = timelock.address;
    console.log("Timelock: " + timelockAddress);
}

async function deployTradegenTokenContract() {
    const signers = await ethers.getSigners();
    deployer = signers[0];
    
    let TradegenTokenFactory = await ethers.getContractFactory('TradegenToken');
    
    let tradegenToken = await TradegenTokenFactory.deploy(TEAM_ESCROW, INVESTOR_ESCROW, INSURANCE_FUND, DEVELOPMENT_FUND, COMMUNITY_FUND, SEED_LIQUIDITY_SUPPLIER, CROSS_CHAIN_LIQUIDITY_ESCROW, LIQUIDITY_MINING_ESCROW, POOL_FARMING_ESCROW);
    await tradegenToken.deployed();
    let tradegenTokenAddress = tradegenToken.address;
    console.log("TradegenToken: " + tradegenTokenAddress);
}
/*
deployVestingContract()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })*/

deployStakingContract()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
/*
deploySeedLiquidityContract()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })

deployTimelockContract()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })

deployTradegenTokenContract()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })*/