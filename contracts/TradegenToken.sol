// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

import "./openzeppelin-solidity/contracts/ERC20/ERC20.sol";

contract TradegenERC20 is ERC20 {
    constructor() ERC20('Tradegen', 'TGEN') {
        _mint(msg.sender, 1e27);
    }
}