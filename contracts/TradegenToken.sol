// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

import "./openzeppelin-solidity/contracts/ERC20/ERC20.sol";

contract TradegenToken is ERC20 {
    address public immutable teamEscrow;
    address public immutable investorEscrow;
    address public immutable communityFund;
    address public immutable seedLiquiditySupplier;
    address public immutable liquidityMiningEscrow;
    address public immutable poolFarmingEscrow;

    // Total supply will be 1 billion.
    // 600 million TGEN are minted at token launch.
    // Remaining 400 million TGEN will be used as the native token on our custom blockchain for trading bots.
    // The native token can be traded in the Cosmos ecosystem, bridged to other chains, or used in the Cosmos version of our app in the future.
    constructor(address _teamEscrow,
                address _investorEscrow,
                address _communityFund,
                address _seedLiquiditySupplier,
                address _liquidityMiningEscrow,
                address _poolFarmingEscrow) ERC20('Tradegen', 'TGEN') {
        require(_teamEscrow != address(0), "TradegenToken: invalid address for team escrow.");
        require(_investorEscrow != address(0), "TradegenToken: invalid address for investor escrow.");
        require(_communityFund != address(0), "TradegenToken: invalid address for community fund.");
        require(_seedLiquiditySupplier != address(0), "TradegenToken: invalid address for seed liquidity supplier.");
        require(_liquidityMiningEscrow != address(0), "TradegenToken: invalid address for liquidity mining escrow.");
        require(_poolFarmingEscrow != address(0), "TradegenToken: invalid address for pool farming escrow.");

        _mint(_teamEscrow, 50 * 1e24);
        _mint(_investorEscrow, 50 * 1e24);
        _mint(_communityFund, 100 * 1e24);
        _mint(_seedLiquiditySupplier, 1 * 1e24);
        _mint(_liquidityMiningEscrow, 149 * 1e24);
        _mint(_poolFarmingEscrow, 250 * 1e24);

        teamEscrow = _teamEscrow;
        investorEscrow = _investorEscrow;
        communityFund = _communityFund;
        seedLiquiditySupplier = _seedLiquiditySupplier;
        liquidityMiningEscrow = _liquidityMiningEscrow;
        poolFarmingEscrow = _poolFarmingEscrow;
    }
}