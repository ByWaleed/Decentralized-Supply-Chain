pragma solidity >=0.4.22 <0.9.0;

// Import the library 'Roles'
import "./Roles.sol";

// Define a contract 'ManufacturerRole' to manage this role - add, remove, check
contract ManufacturerRole {
    using Roles for Roles.Role;

    // Define 2 events, one for Adding, and other for Removing
    event ManufacturerAdded(address indexed account);
    event ManufacturerRemoved(address indexed account);

    // Define a struct 'manufacturers' by inheriting from 'Roles' library, struct Role
    Roles.Role private manufacturers;

    // In the constructor make the address that deploys this contract the 1st manufacturer
    constructor() {
        _addManufacturer(msg.sender);
    }

    // Define an internal function '_addManufactuere' to add this role, called by 'addManufacturer'
    function _addManufacturer(address account) internal {
        manufacturers.add(account);
        emit ManufacturerAdded(account);
    }
}
