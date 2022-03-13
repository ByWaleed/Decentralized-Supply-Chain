// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.22 <0.9.0;

import "./Roles.sol";

contract Distributor {
    using Roles for Roles.Role;

    event DistributorAdded(address indexed account);
    event DistributorRemoved(address indexed account);

    Roles.Role private distributors;

    constructor() {
        _addDistributor(msg.sender);
    }

    function _addDistributor(address account) internal {
        distributors.add(account);

        emit DistributorAdded(account);
    }

    function _removeDistributor(address account) internal {
        distributors.remove(account);

        emit DistributorRemoved(account);
    }

    function isDistributor(address account) public view returns (bool) {
        return distributors.has(account);
    }

    modifier onlyDistributor() {
        require(
            isDistributor(msg.sender),
            "Sender doesn't have the distributor role."
        );
        _;
    }

    function addDistributor(address account) public onlyDistributor {
        _addDistributor(account);
    }

    function renounceDistributor() public {
        _removeDistributor(msg.sender);
    }
}
