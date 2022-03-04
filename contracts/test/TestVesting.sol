// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

//Libraries
import "../Vesting.sol";

contract TestVesting is Vesting {
    constructor(address _TGEN)
        Vesting(_TGEN) {}

    function setSchedule(address _beneficiary, bool _isActive, uint256 _startTime, uint256 _endTime, uint256 _lastClaimTime, uint256 _numberOfTokens) external {
        schedules[_beneficiary] = VestingSchedule({
            isActive: _isActive,
            startTime: _startTime,
            endTime: _endTime,
            lastClaimTime: _lastClaimTime,
            numberOfTokens: _numberOfTokens
        });
    }

    function getCurrentTime() external view returns (uint256) {
        return block.timestamp;
    }
}