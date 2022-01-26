//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StakingToken is ERC20, ERC20Burnable {
    IERC20 public baseToken;

    constructor(address _baseToken) ERC20("Stake Tokeb", "ST") {
        baseToken = IERC20(_baseToken);
    }

    function stake(uint256 amount) external {
        require(baseToken.allowance(msg.sender, address(this)) >= amount, "not enough approved");

        // transfer baseToken to this contract
        baseToken.transferFrom(msg.sender, address(this), amount);

        // mint the sender the staked token
        _mint(msg.sender, amount);
    }

    function unstake(uint256 amount) external {
        require(allowance(msg.sender, address(this)) >= amount, "not enough approved");

        // burn stake token
        this.burnFrom(msg.sender, amount);

        // transfer the base
        baseToken.transfer(msg.sender, amount);
    }
}
