pragma solidity >=0.4.22 <0.9.0;

// Import the library 'Roles'
import "./Roles.sol";

// Define a contract 'ConsumerRole' to manage this role - add, remove, check
contract ConsumerRole {
    using Roles for Roles.Role;

    // Define 2 events, one for Adding, and other for Removing
    event ConsumerAdded(address account);
    event ConsumerRemoved(address account);

    // Define a struct 'consumers' by inheriting from 'Roles' library, struct Role
    Roles.Role private consumers;

    // In the constructor make the address that deploys this contract the 1st consumer
    constructor() {
        _addConsumer(msg.sender);
    }

    // Define an internal function '_addConsumer' to add this role, called by 'addConsumer'
    function _addConsumer(address account) internal {
        consumers.add(account);

        emit ConsumerAdded(account);
    }

    // Define an internal function '_removeConsumer' to remove this role, called by 'removeConsumer'
    function _removeConsumer(address account) internal {
        consumers.remove(account);

        emit ConsumerRemoved(account);
    }
}
