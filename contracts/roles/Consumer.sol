// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.22 <0.9.0;

import "./Roles.sol";

contract Consumer {
    using Roles for Roles.Role;

    event ConsumerAdded(address account);
    event ConsumerRemoved(address account);

    Roles.Role private consumers;

    constructor() {
        _addConsumer(msg.sender);
    }

    function _addConsumer(address account) internal {
        consumers.add(account);

        emit ConsumerAdded(account);
    }

    function _removeConsumer(address account) internal {
        consumers.remove(account);

        emit ConsumerRemoved(account);
    }

    function isConsumer(address account) public view returns (bool) {
        return consumers.has(account);
    }

    modifier onlyConsumer() {
        require(
            isConsumer(msg.sender),
            "Sender doesn't have the consumer role."
        );
        _;
    }

    function addConsumer(address account) public onlyConsumer {
        _addConsumer(account);
    }

    function renounceConsumer() public {
        _removeConsumer(msg.sender);
    }
}
