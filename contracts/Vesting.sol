// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

//OpenZeppelin
import "./openzeppelin-solidity/contracts/ERC20/SafeERC20.sol";
import "./openzeppelin-solidity/contracts/ERC20/IERC20.sol";
import "./openzeppelin-solidity/contracts/Ownable.sol";
import "./openzeppelin-solidity/contracts/SafeMath.sol";

contract Vesting is Ownable {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    struct VestingSchedule {
        bool isActive;
        uint256 startTime;
        uint256 endTime;
        uint256 lastClaimTime;
        uint256 numberOfTokens;
    }

    IERC20 public immutable TGEN;

    address[] public beneficiaries;
    mapping (address => VestingSchedule) public schedules;
    mapping (address => uint256) public claimedTokens; // Number of tokens a beneficiary has claimed (includes previous schedules).

    uint256 public immutable totalTokensToDistribute;
    uint256 public tokensVesting; // Number of tokens in existing schedules.

    constructor(address _TGEN) Ownable() {
        require(_TGEN != address(0), "Vesting: invalid address for TGEN.");

        TGEN = IERC20(_TGEN);

        totalTokensToDistribute = IERC20(_TGEN).balanceOf(address(this));
    }

    /* ========== VIEWS ========== */

    /**
    * @dev Returns the beneficiary's vesting schedule.
    * @param _beneficiary Address of the beneficiary.
    * @return (bool, uint256, uint256, uint256, uin256) The beneficiary's vesting status, start time, end time, last claim time, and total number of tokens to vest
    */
    function getVestingSchedule(address _beneficiary) external view returns (bool, uint256, uint256, uint256, uint256) {
        require(_beneficiary != address(0), "Vesting: invalid address for beneficiary.");

        VestingSchedule memory schedule = schedules[_beneficiary];

        return (schedule.isActive, schedule.startTime, schedule.endTime, schedule.lastClaimTime, schedule.numberOfTokens);
    }

    /**
    * @dev Returns the total number of tokens distributed so far.
    * @notice This number doesn't include vested tokens that haven't been claimed yet.
    */
    function totalTokensDistributed() external view returns (uint256) {
        return totalTokensToDistribute.sub(TGEN.balanceOf(address(this)));
    }

    /**
    * @dev Returns the number of tokens left to distribute.
    * @notice This number represents the number of tokens that haven't been allocated to a vesting schedule.
    */
    function tokensLeftToDistribute() public view returns (uint256) {
        return totalTokensToDistribute.sub(tokensVesting);
    }

    /* ========== MUTATIVE FUNCTIONS ========== */

    /**
    * @dev Claims vested tokens for the caller.
    * @notice If the caller isn't a beneficiary, they wouldn't be able to claim, since (schedule.active) would be false.
    */
    function claimTokens() external {
        VestingSchedule memory schedule = schedules[msg.sender];

        require(schedule.isActive, "Vesting: beneficiary does not have an active vesting schedule.");
        require(block.timestamp >= schedule.startTime, "Vesting: vesting schedule has not started yet.");

        // Mark the schedule as inactive if the schedule has ended.
        if (block.timestamp >= schedule.endTime) {
            schedules[msg.sender].isActive = false;
        }

        // Ratio of (time elapsed since last claim) / (duration of vesting schedule)
        uint256 availableTokens = schedule.numberOfTokens.mul(block.timestamp.sub(schedule.lastClaimTime)).div(schedule.endTime.sub(schedule.startTime));

        schedules[msg.sender].lastClaimTime = block.timestamp;
        claimedTokens[msg.sender] = claimedTokens[msg.sender].add(availableTokens);
        tokensVesting = (availableTokens >= tokensVesting) ? 0 : tokensVesting.sub(availableTokens);

        TGEN.transfer(msg.sender, availableTokens);

        emit ClaimedTokens(msg.sender, availableTokens);
    }

    /* ========== RESTRICTED FUNCTIONS ========== */

    /**
    * @dev Creates a vesting schedule for the beneficiary.
    * @notice If the beneficiary has an existing inactive schedule, this function will overwrite the schedule.
    * @notice This function is meant to be called by the contract deployer.
    * @param _beneficiary Address of the beneficiary.
    * @param _startTime The timestamp at which tokens will start vesting.
    * @param _numberOfWeeks Duration of the vesting schedule, in weeks.
    * @param _numberOfTokens Total number of tokens to distribute.
    */
    function addBeneficiary(address _beneficiary, uint256 _startTime, uint256 _numberOfWeeks, uint256 _numberOfTokens) external onlyOwner {
        require(_beneficiary != address(0), "Vesting: invalid address for beneficiary.");
        require(_startTime >= block.timestamp, "Vesting: start time must be in the future.");
        require(_numberOfWeeks > 0, "Vesting: number of weeks must be positive.");
        require(_numberOfTokens > 0, "Vesting: number of tokens must be positive.");
        require(!schedules[_beneficiary].isActive, "Vesting: beneficiary already has an active vesting schedule.");
        require(tokensLeftToDistribute() >= _numberOfTokens, "Vesting: not enough tokens in vesting contract.");

        // Add to the list of beneficiaries if the beneficiary is new.
        if (schedules[_beneficiary].startTime == 0) {
            beneficiaries.push(_beneficiary);
        }

        schedules[_beneficiary] = VestingSchedule({
            isActive: true,
            startTime: _startTime,
            endTime: _startTime.add(_numberOfWeeks.mul(1 weeks)),
            lastClaimTime: _startTime,
            numberOfTokens: _numberOfTokens
        });

        tokensVesting = tokensVesting.add(_numberOfTokens);

        emit AddedBeneficiary(_beneficiary, _startTime, _numberOfWeeks, _numberOfTokens);
    }

    /* ========== EVENTS ========== */

    event AddedBeneficiary(address beneficiary, uint256 startTime, uint256 numberOfWeeks, uint256 numberOfTokens);
    event ClaimedTokens(address beneficiary, uint256 numberOfTokens);
}