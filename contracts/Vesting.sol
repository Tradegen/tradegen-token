// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

// OpenZeppelin.
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

    IERC20 public TGEN;

    address[] public beneficiaries;
    mapping (address => VestingSchedule) public schedules;
    // Number of tokens a beneficiary has claimed (includes previous schedules).
    mapping (address => uint256) public claimedTokens;

    uint256 public totalTokensToDistribute;

    // Number of tokens in existing schedules.
    uint256 public tokensVesting;

    bool private initialized = false;

    constructor() Ownable() {}

    /* ========== VIEWS ========== */

    /**
    * @notice Returns the beneficiary's vesting schedule.
    * @param _beneficiary Address of the beneficiary.
    * @return (bool, uint256, uint256, uint256, uin256) The beneficiary's vesting status, start time, end time, last claim time, and total number of tokens to vest.
    */
    function getVestingSchedule(address _beneficiary) external view returns (bool, uint256, uint256, uint256, uint256) {
        require(_beneficiary != address(0), "Vesting: Invalid address for beneficiary.");

        VestingSchedule memory schedule = schedules[_beneficiary];

        return (schedule.isActive, schedule.startTime, schedule.endTime, schedule.lastClaimTime, schedule.numberOfTokens);
    }

    /**
    * @notice Returns the total number of tokens distributed so far.
    * @dev This number doesn't include vested tokens that haven't been claimed yet.
    */
    function totalTokensDistributed() external view returns (uint256) {
        return totalTokensToDistribute.sub(TGEN.balanceOf(address(this)));
    }

    /**
    * @notice Returns the number of tokens left to distribute.
    * @dev This number represents the number of tokens that haven't been allocated to a vesting schedule.
    */
    function tokensLeftToDistribute() public view returns (uint256) {
        return TGEN.balanceOf(address(this)).sub(tokensVesting);
    }

    /* ========== MUTATIVE FUNCTIONS ========== */

    /**
    * @notice Claims vested tokens for the caller.
    * @dev If the caller isn't a beneficiary, they wouldn't be able to claim, since (schedule.active) would be false.
    */
    function claimTokens() external isInitialized {
        VestingSchedule memory schedule = schedules[msg.sender];

        require(schedule.isActive, "Vesting: Beneficiary does not have an active vesting schedule.");
        require(block.timestamp >= schedule.startTime, "Vesting: Vesting schedule has not started yet.");

        // Mark the schedule as inactive if the schedule has ended.
        if (block.timestamp >= schedule.endTime) {
            schedules[msg.sender].isActive = false;
        }

        // Ratio of (time elapsed since last claim) / (duration of vesting schedule).
        uint256 lastTimeApplicable = (block.timestamp >= schedule.endTime) ? schedule.endTime : block.timestamp; 
        uint256 availableTokens = schedule.numberOfTokens.mul(lastTimeApplicable.sub(schedule.lastClaimTime)).div(schedule.endTime.sub(schedule.startTime));

        schedules[msg.sender].lastClaimTime = block.timestamp;
        claimedTokens[msg.sender] = claimedTokens[msg.sender].add(availableTokens);
        tokensVesting = (availableTokens >= tokensVesting) ? 0 : tokensVesting.sub(availableTokens);

        TGEN.transfer(msg.sender, availableTokens);

        emit ClaimedTokens(msg.sender, availableTokens);
    }

    /* ========== RESTRICTED FUNCTIONS ========== */

    /**
    * @notice Creates a vesting schedule for the beneficiary.
    * @dev If the beneficiary has an existing inactive schedule, this function will overwrite the schedule.
    * @dev This function is meant to be called by the contract deployer.
    * @param _beneficiary Address of the beneficiary.
    * @param _startTime The timestamp at which tokens will start vesting.
    * @param _numberOfWeeks Duration of the vesting schedule, in weeks.
    * @param _numberOfTokens Total number of tokens to distribute.
    */
    function addBeneficiary(address _beneficiary, uint256 _startTime, uint256 _numberOfWeeks, uint256 _numberOfTokens) external onlyOwner isInitialized {
        require(_beneficiary != address(0), "Vesting: Invalid address for beneficiary.");
        require(_startTime >= block.timestamp, "Vesting: Start time must be in the future.");
        require(_numberOfWeeks > 0, "Vesting: Number of weeks must be positive.");
        require(_numberOfTokens > 0, "Vesting: Number of tokens must be positive.");
        require(!schedules[_beneficiary].isActive, "Vesting: Beneficiary already has an active vesting schedule.");
        require(tokensLeftToDistribute() >= _numberOfTokens, "Vesting: Not enough tokens in vesting contract.");

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

    /**
    * @notice Checks whether this contract's TGEN balance matches the desired distribution amount.
    * @param _TGEN Address of the TGEN token.
    * @param _totalTokensToDistribute total number of TGEN that this contract will distribute.
    */
    function initialize(address _TGEN, uint256 _totalTokensToDistribute) external onlyOwner isNotInitialized {
        require(_totalTokensToDistribute > 0, "Vesting: Total tokens to distribute must be positive.");

        TGEN = IERC20(_TGEN);
        require(TGEN.balanceOf(address(this)) >= _totalTokensToDistribute, "Vesting: Balance must equal total tokens to distribute.");
        
        totalTokensToDistribute = _totalTokensToDistribute;
        initialized = true;

        emit Initialized(_TGEN, _totalTokensToDistribute);
    }

    /* ========== MODIFIERS ========== */

    modifier isInitialized() {
        require(initialized, "Vesting: Contract must be initialized.");
        _;
    }

    modifier isNotInitialized() {
        require(!initialized, "Vesting: Contract must not be initialized.");
        _;
    }

    /* ========== EVENTS ========== */

    event AddedBeneficiary(address beneficiary, uint256 startTime, uint256 numberOfWeeks, uint256 numberOfTokens);
    event ClaimedTokens(address beneficiary, uint256 numberOfTokens);
    event Initialized(address tradegenToken, uint256 totalTokens);
}