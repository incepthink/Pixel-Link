pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    constructor() ERC20("Test APECOIN", "APECOIN") {}

    function mint(uint amount) external {
        _mint(msg.sender, amount);
    }
}
