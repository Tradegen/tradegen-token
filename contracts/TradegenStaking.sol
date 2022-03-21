// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

import "./openzeppelin-solidity/contracts/ERC20/SafeERC20.sol";
import "./openzeppelin-solidity/contracts/ERC20/ERC20.sol";
import "./openzeppelin-solidity/contracts/ERC20/IERC20.sol";
import "./openzeppelin-solidity/contracts/SafeMath.sol";

// This contract handles swapping to and from xTGEN, Tradegen's staking token.
contract TradegenStaking is ERC20("Tradegen Staking Token", "xTGEN"){
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    IERC20 public immutable TGEN;

    /**
     * @dev Creates the TradegenStaking contract and defines the Tradegen token.
     * @param _TGEN address of the Tradegen token contract.
     */
    constructor(address _TGEN) {
        TGEN = IERC20(_TGEN);
    }

    /* ========== VIEWS ========== */

    /**
     * @dev Returns the price of one share, in TGEN.
     */
    function getSharePrice() external view returns (uint256) {
        if (totalSupply() == 0) {
            return 1e18;
        }

        return TGEN.balanceOf(address(this)).mul(1e18).div(totalSupply());
    }

    /* ========== MUTATIVE FUNCTIONS ========== */

    /**
     * @dev Stakes TGEN tokens.
     * @param _amount Number of TGEN tokens to stake.
     */
    function stake(uint256 _amount) public {
        require (_amount > 0, "TradegenStaking: Amount must be greater than 0.");

        // Gets the amount of TGEN locked in the contract
        uint256 totalTGEN = TGEN.balanceOf(address(this));
        // Gets the amount of xTGEN in existence
        uint256 totalShares = totalSupply();
        // If no xTGEN exists, mint it 1:1 to the amount put in
        if (totalShares == 0 || totalTGEN == 0) {
            _mint(msg.sender, _amount);

            emit Stake(msg.sender, _amount, _amount);
        } 
        // Calculate and mint the amount of xTGEN the Tradegen token is worth. The ratio will change overtime, as xTGEN is burned/minted and TGEN deposited + gained from fees.
        else {
            uint256 numberOfShares = _amount.mul(totalShares).div(totalTGEN);
            _mint(msg.sender, numberOfShares);

            emit Stake(msg.sender, _amount, numberOfShares);
        }
        // Lock the TGEN in the contract
        TGEN.safeTransferFrom(msg.sender, address(this), _amount);
    }

    /**
     * @dev Unlocks the staked/gained TGEN and burns xTGEN.
     * @param _share Number of xTGEN to burn.
     */
    function withdraw(uint256 _share) public {
        require (_share > 0, "TradegenStaking: Amount must be greater than 0.");

        // Gets the amount of xTGEN in existence
        uint256 totalShares = totalSupply();
        // Calculates the amount of TGEN the xTGEN is worth
        uint256 numberOfTGEN = _share.mul(TGEN.balanceOf(address(this))).div(totalShares);

        _burn(msg.sender, _share);
        TGEN.safeTransfer(msg.sender, numberOfTGEN);

        emit Withdraw(msg.sender, _share, numberOfTGEN);
    }

    /**
     * @dev Withdraws the user's entire balance of xTGEN.
     */
    function exit() public {
        withdraw(balanceOf(msg.sender));
    }

    /* ========== EVENTS ========== */

    event Stake(address indexed user, uint256 amountOfTGEN, uint256 amountOfShares);
    event Withdraw(address indexed user, uint256 amountOfShares, uint256 amountOfTGEN);
}