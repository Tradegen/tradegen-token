// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

//Interfaces
import './interfaces/IUniswapV2Router02.sol';

//OpenZeppelin
import "./openzeppelin-solidity/contracts/ERC20/SafeERC20.sol";
import "./openzeppelin-solidity/contracts/ERC20/IERC20.sol";
import "./openzeppelin-solidity/contracts/Ownable.sol";

contract SeedLiquidity is Ownable {
    using SafeERC20 for IERC20;

    IUniswapV2Router02 public immutable ubeswapRouter;
    IERC20 public immutable CELO;
    IERC20 public TGEN;

    constructor(address _ubeswapRouter, address _CELO) Ownable() {
        require(_ubeswapRouter != address(0), "SeedLiquidity: Invalid address for Ubeswap router.");
        require(_CELO != address(0), "SeedLiquidity: Invalid address for CELO.");

        ubeswapRouter = IUniswapV2Router02(_ubeswapRouter);
        CELO = IERC20(_CELO);
    }

    /* ========== MUTATIVE FUNCTIONS ========== */

    /**
    * @notice Sets the address of TGEN.
    * @dev The TGEN address is initialized outside of the constructor because the TradegenToken contract
    *      expects this contract to already be deployed.
    */
    function setTGEN(address _TGEN) external onlyOwner {
        require(address(TGEN) == address(0), "SeedLiquidity: Already set TGEN.");

        TGEN = IERC20(_TGEN);

        emit SetTGEN(_TGEN);
    }

    /**
    * @notice Supplies TGEN-CELO seed liquidity with the contract's available TGEN and CELO.
    */
    function supplySeedLiquidity() external onlyOwner {
        require(address(TGEN) != address(0), "SeedLiquidity: TGEN is not set.");
        require(TGEN.balanceOf(address(this)) > 0, "SeedLiquidity: Not enough TGEN.");
        require(CELO.balanceOf(address(this)) > 0, "SeedLiquidity: Not enough CELO.");

        TGEN.approve(address(ubeswapRouter), TGEN.balanceOf(address(this)));
        CELO.approve(address(ubeswapRouter), CELO.balanceOf(address(this)));

        (uint256 amountOfTGEN, uint256 amountOfCELO, uint256 numberOfLPTokens) = ubeswapRouter.addLiquidity(address(TGEN),
                                                                                                            address(CELO),
                                                                                                            TGEN.balanceOf(address(this)),
                                                                                                            CELO.balanceOf(address(this)),
                                                                                                            0,
                                                                                                            0,
                                                                                                            address(this),
                                                                                                            block.timestamp + 10000);

        renounceOwnership();

        emit SuppliedLiquidity(amountOfTGEN, amountOfCELO, numberOfLPTokens);
    }

    /* ========== EVENTS ========== */

    event SetTGEN(address tokenAddress);
    event SuppliedLiquidity(uint256 amountOfTGEN, uint256 amountOfCELO, uint256 numberOfLPTokens);
}