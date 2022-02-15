pragma solidity ^0.8.3;

/// Provides basic authorization control
contract Item {
    address private origOwner;

    // Assign the contract to an owner
    constructor() {
        origOwner = msg.sender;
    }

    // Look up the address of the owner
    function owner() public view returns (address) {
        return origOwner;
    }

    // Check if the calling address is the owner of the contract
    function isOwner() public view returns (bool) {
        return msg.sender == origOwner;
    }

    // Define a function modifier 'onlyOwner'
    modifier onlyOwner() virtual {
        require(isOwner());
        _;
    }
}
