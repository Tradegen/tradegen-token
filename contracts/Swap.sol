// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

//Interfaces
import './interfaces/IUbeswapPathManager.sol';
import './interfaces/IUniswapV2Router02.sol';

//OpenZeppelin
import "./openzeppelin-solidity/contracts/ERC20/SafeERC20.sol";
import "./openzeppelin-solidity/contracts/ERC20/IERC20.sol";

//Inheritance
import './interfaces/ISwap.sol';

contract Swap is ISwap {
    using SafeERC20 for IERC20;

    IUbeswapPathManager public immutable pathManager;
    IUniswapV2Router02 public immutable ubeswapRouter;
    address public immutable xTGEN;
    IERC20 public immutable TGEN;

    constructor(address _ubeswapPathManagerAddress, address _ubeswapRouter, address _xTGEN, address _TGEN) {
        require(_ubeswapPathManagerAddress != address(0), "Swap: invalid address for UbeswapPathManager.");
        require(_ubeswapRouter != address(0), "Swap: invalid address for Ubeswap router.");
        require(_xTGEN != address(0), "Swap: invalid address for xTGEN.");
        require(_TGEN != address(0), "Swap: invalid address for TGEN.");

        pathManager = IUbeswapPathManager(_ubeswapPathManagerAddress);
        ubeswapRouter = IUniswapV2Router02(_ubeswapRouter);
        xTGEN = _xTGEN;
        TGEN = IERC20(_TGEN);
    }

    /* ========== MUTATIVE FUNCTIONS ========== */

    /**
    * @dev Swaps the given asset for TGEN.
    * @notice Need to set (asset => TGEN) path in UbeswapPathManager before calling this function.
    * @notice Need to transfer asset to Swap contract before calling this function.
    * @param _asset Address of token to swap from.
    * @param _amount Number of tokens to swap.

    */
    function swapAssetForTGEN(address _asset, uint256 _amount) external override {
        require(_asset != address(0), "Swap: invalid asset address.");
        require(_amount > 0, "Swap: amount must be positive.");
        require(IERC20(_asset).balanceOf(address(this)) >= _amount, "Swap: not enough tokens.");

        address[] memory path = pathManager.getPath(_asset, address(TGEN));
        uint256[] memory amounts = ubeswapRouter.swapExactTokensForTokens(_amount, 0, path, address(TGEN), block.timestamp + 10000);

        TGEN.safeTransfer(xTGEN, amounts[amounts.length - 1]);

        emit Swapped(_asset, _amount, amounts[amounts.length - 1]);
    }

    /* ========== EVENTS ========== */

    event Swapped(address asset, uint256 amountOfTokensSwapped, uint256 amountOfTokensReceived);
}