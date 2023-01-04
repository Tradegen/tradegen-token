# Tradegen Token

## Purpose

Create a governance token, TGEN, for the Tradegen project.

## Disclaimer

These contracts have not been audited yet.

The contracts are available on testnet, but not on mainnet.

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
