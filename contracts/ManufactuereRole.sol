pragma solidity >=0.4.22 <0.9.0;

// Import the library 'Roles'
import "./Roles.sol";

// Define a contract 'ManufactuereRole' to manage this role - add, remove, check
contract ManufactuereRole {
    using Roles for Roles.Role;

    // Define 2 events, one for Adding, and other for Removing
    event ManufacturerAdded(address indexed account);
    event ManufacturerRemoved(address indexed account);

    // Define a struct 'manufacturers' by inheriting from 'Roles' library, struct Role
    Roles.Role private manufacturers;

    // Define an internal function '_addFarmer' to add this role, called by 'addFarmer'
    function _addManufactuere(address account) internal {
        manufacturers.add(account);
        emit ManufacturerAdded(account);
    }
}
