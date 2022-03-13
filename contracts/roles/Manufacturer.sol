// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.22 <0.9.0;

import "./Roles.sol";

contract Manufacturer {
    using Roles for Roles.Role;

    event ManufacturerAdded(address indexed account);
    event ManufacturerRemoved(address indexed account);

    Roles.Role private manufacturers;

    constructor() {
        _addManufacturer(msg.sender);
    }

    function _addManufacturer(address account) internal {
        manufacturers.add(account);
        emit ManufacturerAdded(account);
    }

    function _removeManufacturer(address account) internal {
        manufacturers.remove(account);
        emit ManufacturerRemoved(account);
    }

    function isManufacturer(address account) public view returns (bool) {
        return manufacturers.has(account);
    }

    modifier onlyManufacturer() {
        require(isManufacturer(msg.sender), "Sender doesn't have the manufacturer role.");
        _;
    }

    function addManufacturer(address account) public onlyManufacturer {
        _addManufacturer(account);
    }

    function renounceManufacturer() public {
        _removeManufacturer(msg.sender);
    }
}
