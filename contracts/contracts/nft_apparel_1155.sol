// SPDX-License-Identifier: Unlicense
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IMailBox.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract NftApparel is ERC1155, Ownable {
    string public name;
    string public symbol;
    uint256 private highestId;
    address mailbox;
    address apeCoin;
    uint price;
    //mappings
    mapping(uint256 => string) private metadata;
    mapping(uint256 => uint256) private idSupply;
    mapping(uint => mapping(uint => uint)) public isMinted;

    constructor(
        string memory _symbol,
        string memory _name,
        address _apecoin,
        uint _price,
        address _mailbox
    ) public ERC1155("") {
        name = _name;
        symbol = _symbol;
        highestId = 0;
        apeCoin = _apecoin;
        price = _price;
        mailbox = _mailbox;
    }

    // function setTrustedForwarder(address _trustedForwarder) public {
    //     _setTrustedForwarder(_trustedForwarder);
    // }

    function addressToBytes32(address _addr) internal pure returns (bytes32) {
        return bytes32(uint256(uint160(_addr)));
    }

    // TokenId - 1 will be the claimed NFT, Specify its uri also while minting the nft to prevent errors
    function mint(
        address account,
        uint256 id,
        uint256 amount,
        string memory _metadata,
        string memory _metadataClaimed
    ) public onlyOwner {
        require(id % 2 == 0, "Only even number Ids can be minted manually");
        IERC20(apeCoin).transferFrom(msg.sender, address(this), price * amount);
        _customMint(account, id, amount);

        bytes memory bytesData = bytes(_metadata);
        if (bytesData.length != 0) metadata[id] = _metadata;
        bytes memory bytesDataClaimed = bytes(_metadataClaimed);
        if (bytesDataClaimed.length != 0) metadata[id - 1] = _metadataClaimed;
    }

    function _customMint(address account, uint256 id, uint256 amount) private {
        // require(account == _msgSender() || isApprovedForAll(account, _msgSender()), "Need operator approval for 3rd party burns.");
        _mint(account, id, amount, "");
        if (id > highestId) {
            highestId = id;
        }
        idSupply[id] += amount;
    }

    function burn(address account, uint256 id, uint256 amount) public {
        require(
            account == _msgSender() || isApprovedForAll(account, _msgSender()),
            "Need operator approval for 3rd party burns."
        );
        _burn(account, id, amount);
        idSupply[id] -= amount;
    }

    function burnAndClaim(uint256 id) public {
        require(id % 2 == 0, "You are trying to claim the wrong tokenID");
        uint256[] memory tokens = tokensOfOwner(_msgSender());
        bool flag = false;
        for (uint256 i = 0; i < tokens.length; i++) {
            if (tokens[i] == id) flag = true;
        }
        require(
            flag == true,
            "Sorry, You do not own the token you are trying to claim"
        );
        burn(_msgSender(), id, 1);
        _customMint(_msgSender(), id - 1, 1);
    }

    function transferTokenCrossChain(
        uint32 _destinationDomain,
        address _recipientAddress,
        bytes calldata _messageBody
    ) external {
        (address user, uint token, uint feature) = abi.decode(
            _messageBody,
            (address, uint, uint)
        );
        bytes32 receiver = addressToBytes32(_recipientAddress);
        require(!isMinted[token][feature], "Already minted");
        isMinted[token][feature] = true;
        IMailBox(mailbox).dispact(
            _destinationDomain,
            _recipientAddress,
            _messageBody
        );
    }

    function setTokenUri(uint256 id, string memory _metadata) public onlyOwner {
        require(id >= 0, "Id needs be 0 or greater");
        metadata[id] = _metadata;
    }

    function totalSupply(
        uint256 id
    ) public view returns (uint256 total_supply) {
        return idSupply[id];
    }

    function totalTypes(address _owner) public view returns (uint256) {
        uint256 count = 0;
        for (uint256 id = 0; id <= highestId; id++) {
            if (balanceOf(_owner, id) > 0) count++;
        }
        return count;
    }

    function totalBalance(address _owner) public view returns (uint256) {
        uint256 count = 0;
        for (uint256 id = 0; id <= highestId; id++) {
            count += balanceOf(_owner, id);
        }
        return count;
    }

    function tokenTypesOf(
        address _owner
    ) public view returns (uint256[] memory ids) {
        uint256[] memory result = new uint256[](totalTypes(_owner));
        uint256 c = 0;
        for (uint256 id = 0; id <= highestId; id++) {
            if (balanceOf(_owner, id) > 0) {
                result[c] = id;
                c++;
            }
        }
        return result;
    }

    function totalTokenTypes() public view returns (uint256) {
        uint256 count = 0;
        for (uint256 id = 0; id <= highestId; id++) {
            if (totalSupply(id) > 0) count++;
        }
        return count;
    }

    function tokensOfOwner(
        address _owner
    ) public view returns (uint256[] memory) {
        uint256 count = totalTypes(_owner);
        if (count == 0) return new uint256[](0);
        uint256[] memory tokens = new uint256[](count);
        uint256 i = 0;
        for (uint256 id = 0; id <= highestId; id++) {
            if (balanceOf(_owner, id) > 0) {
                tokens[i] = id;
                i++;
            }
        }
        return tokens;
    }

    function uri(uint256 id) public view override returns (string memory) {
        return metadata[id];
    }
}
