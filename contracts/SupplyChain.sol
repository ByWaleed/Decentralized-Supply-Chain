pragma solidity >=0.4.22 <0.9.0;

contract SupplyChain {
    // Automatically has getter and setter created
    mapping(uint => int) public map;

    function setKey(uint key, int value) public {
        map[key] = value;
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}
