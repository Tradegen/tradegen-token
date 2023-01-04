# Tradegen Token

## Purpose

Create a governance token, TGEN, for the Tradegen project.

## Overview

The Tradegen token, TGEN, is an ERC20 governance token launched on the Celo blockchain. TGEN will primarily be used for incentivizing users to actively engage with the platform. Some use cases include rewarding top-performing pools, voting on proposals to improve the platform, making payments on the platform's marketplace, voting for trading bots, and distributing grants.

## Disclaimer

These contracts have not been audited yet.

The contracts are available on testnet, but not on mainnet.

## Distribution

1,000,000,000 TGEN have been minted and distributed as follows: 

* Team - 50,000,000
* Investors - 50,000,000
* Development fund - 50,000,000
* Insurance fund - 50,000,000
* Community fund - 100,000,000
* Liquidity mining - 200,000,000
* Cross-chain liquidity/incentives - 200,000,000
* Farming for capped pools - 300,000,000

Tokens are distributed automatically when the contract is deployed. No new tokens will be minted.

TGEN allocated to investors and the core team are locked with an 18-month linear vest. Tokens allocated to cross-chain liquidity/incentives are held in escrow until Tradegen is ready to launch on other chains. All allocations other than team and investors are unlocked on a halvening release schedule.

## Smart Contracts

* SeedLiquidity - Supplies initial liquidity for TGEN when the token is deployed.
* Timelock - The treasury for multiple funds in the Tradegen project.
* TradegenStaking - Implements the reward program for staking TGEN.
* TradegenToken - The Tradegen token contract. Distributes tokens to each escrow contract automatically when the contract is deployed.
* Vesting - Handles token vesting for the team and investors.

## Repository Structure

```
.
├── abi  ## Generated ABIs that developers can use to interact with the system.
├── contract addresses  ## Address of each deployed contract, organized by network.
├── contracts  ## All source code.
│   ├── interfaces  ## Interfaces used for defining/calling contracts.
│   ├── openzeppelin-solidity  ## Helper contracts provided by OpenZeppelin.
│   ├── test  ## Mock contracts used for testing main contracts.
├── test ## Source code for testing code in //contracts.
```

## Documentation

To learn more about the Tradegen project, visit the docs at https://docs.tradegen.io.

To learn more about Celo, visit their home page: https://celo.org/.

## License

MIT
