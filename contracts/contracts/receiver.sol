pragma solidity 0.8.19;

import "./IMailBox.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Receiver is ERC1155, Ownable {
    address public mailbox;

    constructor(address _mailbox) ERC1155("Test") {
        mailbox = _mailbox;
    }

    modifier onlyMailbox() {
        require(msg.sender == mailbox);
        _;
    }

    function handle(
        uint32 _origin,
        bytes32 _sender,
        bytes calldata _body
    ) external onlyMailbox {
        address sender = bytes32ToAddress(_sender);
        (address user, uint token, uint feature) = abi.decode(
            _body,
            (address, uint, uint)
        );
        _mint(user, feature, 1, "");
    }

    // alignment preserving cast
    function bytes32ToAddress(bytes32 _buf) internal pure returns (address) {
        return address(uint160(uint256(_buf)));
    }
}
