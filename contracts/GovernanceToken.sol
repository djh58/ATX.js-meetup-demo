// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "hardhat/console.sol";

contract GovernanceToken is ERC20, ERC20Burnable {
    IERC20 public baseToken;

    constructor(address _baseToken) ERC20("GovernanceToken", "GVT") {
        baseToken = IERC20(_baseToken);
    }

    function stake(uint256 amount) external {
        require(baseToken.allowance(msg.sender, address(this)) > amount - 1, "Not enough allowance");
        baseToken.transferFrom(msg.sender, address(this), amount);
        _mint(msg.sender, amount);
    }

    function unstake(uint256 amount) external {
        require(allowance(msg.sender, address(this)) > amount - 1, "Not enough allowance");
        this.burnFrom(msg.sender, amount);
        baseToken.transfer(msg.sender, amount);
    }
}
