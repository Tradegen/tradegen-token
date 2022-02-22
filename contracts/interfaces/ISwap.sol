// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

interface ISwap {
    /**
    * @dev Swaps the given asset for TGEN.
    * @notice Need to transfer asset to Swap contract before calling this function.
    * @param _asset Address of token to swap from.
    * @param _amount Number of tokens to swap.
    */
    function swapAssetForTGEN(address _asset, uint256 _amount) external;
}