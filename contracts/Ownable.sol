// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.22 <0.9.0;

contract Ownable {
    address private origOwner;

    event TransferOwnership(address indexed oldOwner, address indexed newOwner);

    constructor() {
        origOwner = msg.sender;
        emit TransferOwnership(address(0), origOwner);
    }

    function _transferOwnership(address newOwner) internal {
        require(newOwner != address(0));
        emit TransferOwnership(origOwner, newOwner);
        origOwner = newOwner;
    }

    function owner() public view returns (address) {
        return origOwner;
    }

    function isOwner() public view returns (bool) {
        return msg.sender == origOwner;
    }

    modifier onlyOwner() virtual {
        require(isOwner());
        _;
    }

    function renounceOwnership() public onlyOwner {
        emit TransferOwnership(origOwner, address(0));
        origOwner = address(0);
    }

    function transferOwnership(address newOwner) public onlyOwner {
        _transferOwnership(newOwner);
    }
}
