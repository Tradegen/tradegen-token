// SPDX-License-Identifier: MIT
// solhint-disable not-rely-on-time

pragma solidity ^0.8.3;

import "./openzeppelin-solidity/contracts/Math.sol";
import "./openzeppelin-solidity/contracts/SafeMath.sol";
import "./openzeppelin-solidity/contracts/ReentrancyGuard.sol";
import "./openzeppelin-solidity/contracts/Ownable.sol";
import "./openzeppelin-solidity/contracts/ERC20/SafeERC20.sol";

// Inheritance
import "./interfaces/IStakingRewards.sol";

// Interfaces
import "./interfaces/IReleaseEscrow.sol";

contract StakingRewards is IStakingRewards, ReentrancyGuard, Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    /* ========== STATE VARIABLES ========== */

    IERC20 public rewardsToken; //TGEN token
    IERC20 public stakingToken; //TGEN-CELO LP token
    IReleaseEscrow public releaseEscrow;
    uint256 public totalAvailableRewards;
    uint256 public rewardPerTokenStored;

    mapping(address => uint256) public userRewardPerTokenPaid;
    mapping(address => uint256) public rewards;

    uint256 public override totalSupply;
    mapping(address => uint256) public balance;

    /* ========== CONSTRUCTOR ========== */

    constructor(address _rewardsToken, address _stakingTokenAddress) {
        rewardsToken = IERC20(_rewardsToken);
        stakingToken = IERC20(_stakingTokenAddress);
    }

    /* ========== VIEWS ========== */

    /**
     * @dev Returns the number of tokens a user has staked.
     * @param account address of the user.
     * @return (uint256) amount of tokens staked.
     */
    function balanceOf(address account) external view override returns (uint256) {
        require(account != address(0), "StakingRewards: invalid account address.");

        return balance[account];
    }

    /**
     * @dev Calculates the amount of unclaimed rewards the user has available.
     * @param account address of the user.
     * @return (uint256) amount of available unclaimed rewards.
     */
    function earned(address account) public view override returns (uint256) {
        return balance[account].mul(rewardPerTokenStored.sub(userRewardPerTokenPaid[account])).add(rewards[account]);
    }

    /* ========== MUTATIVE FUNCTIONS ========== */

    /**
     * @dev Stakes tokens in the farm.
     * @param amount number of tokens to stake.
     */
    function stake(uint256 amount) external override nonReentrant releaseEscrowIsSet updateReward(msg.sender) {
        require(amount > 0, "StakingRewards: Amount must be positive.");
        require(stakingToken.balanceOf(msg.sender) >= amount, "StakingRewards: Not enough tokens");

        totalSupply = totalSupply.add(amount);
        balance[msg.sender] = balance[msg.sender].add(amount);

        stakingToken.safeTransferFrom(msg.sender, address(this), amount);

        emit Staked(msg.sender, amount);
    }

    /**
     * @dev Withdraws tokens from the farm.
     * @param amount number of tokens to stake.
     */
    function withdraw(uint256 amount) public override nonReentrant releaseEscrowIsSet updateReward(msg.sender) {
        require(amount > 0, "StakingRewards: Amount must be positive.");

        _withdraw(msg.sender, amount);
    }

    /**
     * @dev Claims available rewards for the user.
     * @notice Claims farm's available rewards from Escrow contract first.
     */
    function getReward() public override nonReentrant releaseEscrowIsSet {
        uint256 availableRewards = releaseEscrow.withdraw();
        _addReward(availableRewards);
        _getReward();
    }

    /**
     * @dev Withdraws all tokens a user has staked.
     */
    function exit() external override {
        getReward();
        _withdraw(msg.sender, balance[msg.sender]);
    }

    /* ========== INTERNAL FUNCTIONS ========== */

    /**
     * @dev Claims available rewards for the user.
     */
    function _getReward() internal updateReward(msg.sender) {
        uint256 reward = rewards[msg.sender];

        if (reward > 0) {
            rewards[msg.sender] = 0;
            rewardsToken.transfer(msg.sender, reward);
            emit RewardPaid(msg.sender, reward);
        }
    }

    /**
     * @dev Withdraws the farm's available tokens from the ReleaseEscrow.
     */
    function _withdraw(address _user, uint _amount) internal {
        totalSupply = totalSupply.sub(_amount);
        balance[_user] = balance[_user].sub(_amount);

        stakingToken.safeTransferFrom(address(this), _user, _amount);

        emit Withdrawn(_user, _amount);
    }

    /**
     * @dev Updates the available rewards for the pool, based on the pool's share of global rewards.
     * @notice This function is meant to be called by the PoolManager contract.
     * @param reward number of tokens to add to the pool.
     */
    function _addReward(uint256 reward) internal{
        if (totalSupply > 0) {
            rewardPerTokenStored = rewardPerTokenStored.add(reward.div(totalSupply));
        }

        totalAvailableRewards = totalAvailableRewards.add(reward);

        emit RewardAdded(reward);
    }

    /* ========== RESTRICTED FUNCTIONS ========== */

    /**
     * @dev Sets the address of the ReleaseEscrow contract.
     * @notice This function can only be called once, and must be called before users can interact with StakingRewards.
     */
    function setReleaseEscrow(address _releaseEscrow) external onlyOwner releaseEscrowIsNotSet {
        require(_releaseEscrow != address(0), "StakingRewards: invalid address.");

        releaseEscrow = IReleaseEscrow(_releaseEscrow);

        emit SetReleaseEscrow(_releaseEscrow);
    }

    /* ========== MODIFIERS ========== */

    modifier updateReward(address account) {
        rewards[account] = earned(account);
        userRewardPerTokenPaid[account] = rewardPerTokenStored;
        _;
    }

    modifier releaseEscrowIsSet() {
        require(address(releaseEscrow) != address(0), "StakingRewards: ReleaseEscrow contract must be set before calling this function.");
        _;
    }

    modifier releaseEscrowIsNotSet() {
        require(address(releaseEscrow) == address(0), "StakingRewards: ReleaseEscrow contract already set.");
        _;
    }

    /* ========== EVENTS ========== */

    event RewardAdded(uint256 reward);
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);
    event SetReleaseEscrow(address releaseEscrowAddress);
}