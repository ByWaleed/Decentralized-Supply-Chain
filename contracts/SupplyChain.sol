// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.22 <0.9.0;

import "./Ownable.sol";
import "./roles/Consumer.sol";
import "./roles/Distributor.sol";
import "./roles/Manufacturer.sol";
import "./roles/Retailer.sol";

contract SupplyChain is Ownable, Consumer, Distributor, Manufacturer, Retailer {
    uint256 upc;

    enum State {
        Manufactured,
        Packed,
        ForSale,
        Sold,
        Shipped,
        Received,
        Purchased
    }

    State constant defaultState = State.Manufactured;

    struct Item {
        uint256 upc;
        string name;
        string description;
        uint256 price;
        address ownerID;
        State itemState;
        address manufacturerID;
        address distributorID;
        address retailerID;
        address consumerID;
    }

    mapping(uint256 => Item) items;

    event Manufactured(uint256 upc);
    event Packed(uint256 upc);
    event ForSale(uint256 upc);
    event Sold(uint256 upc);
    event Shipped(uint256 upc);
    event Received(uint256 upc);
    event Purchased(uint256 upc);

    constructor() payable {
        upc = 1;
    }

    function kill() public {
        if (isOwner()) selfdestruct(payable(msg.sender));
    }

    function manufactureItem(
        uint256 _upc,
        string memory _name,
        string memory _description,
        uint256 _price
    ) public onlyManufacturer {
        items[_upc] = Item({
            upc: _upc,
            name: _name,
            description: _description,
            price: _price,
            ownerID: msg.sender,
            itemState: State.Manufactured,
            manufacturerID: msg.sender,
            distributorID: address(0),
            retailerID: address(0),
            consumerID: address(0)
        });

        emit Manufactured(_upc);
    }

    function packItem(uint256 _upc)
        public
        manufactured(_upc)
        verifyCaller(msg.sender)
        onlyManufacturer
    {
        items[_upc].itemState = State.Packed;

        emit Packed(_upc);
    }

    function sellItem(uint256 _upc, uint256 _price)
        public
        packed(_upc)
        verifyCaller(msg.sender)
        onlyManufacturer
    {
        items[_upc].itemState = State.ForSale;
        items[_upc].price = _price;

        emit ForSale(_upc);
    }

    function buyItem(uint256 _upc)
        public
        payable
        forSale(_upc)
        paidEnough(items[_upc].price)
        checkValue(_upc)
        onlyDistributor
    {
        items[_upc].ownerID = msg.sender;
        items[_upc].itemState = State.Sold;
        items[_upc].distributorID = msg.sender;

        uint256 price = items[_upc].price;
        payable(items[_upc].manufacturerID).transfer(price);

        emit Sold(_upc);
    }

    function shipItem(uint256 _upc)
        public
        sold(_upc)
        verifyCaller(msg.sender)
        onlyDistributor
    {
        items[_upc].itemState = State.Shipped;

        emit Shipped(_upc);
    }

    function receiveItem(uint256 _upc) public shipped(_upc) onlyRetailer {
        items[_upc].ownerID = msg.sender;
        items[_upc].itemState = State.Received;
        items[_upc].retailerID = msg.sender;

        emit Received(_upc);
    }

    function purchaseItem(uint256 _upc) public received(_upc) onlyConsumer {
        items[_upc].ownerID = msg.sender;
        items[_upc].itemState = State.Purchased;
        items[_upc].consumerID = msg.sender;

        emit Purchased(_upc);
    }

    function fetchItem(uint256 _upc)
        public
        view
        returns (
            uint256 UPC,
            address owner,
            uint256 price,
            uint256 state,
            address manufacturerID,
            string memory name,
            string memory description,
            address distributorID,
            address retailerID,
            address consumerID
        )
    {
        UPC = items[_upc].upc;
        owner = items[_upc].ownerID;
        price = items[_upc].price;
        state = uint256(items[_upc].itemState);
        manufacturerID = items[_upc].manufacturerID;
        name = items[_upc].name;
        description = items[_upc].description;
        distributorID = items[_upc].distributorID;
        retailerID = items[_upc].retailerID;
        consumerID = items[_upc].consumerID;

        return (
            UPC,
            owner,
            price,
            state,
            manufacturerID,
            name,
            description,
            distributorID,
            retailerID,
            consumerID
        );
    }

    /*
     * Modifiers
     */

    modifier paidEnough(uint256 _price) {
        require(
            msg.value >= _price,
            "Paid amount is insufficient for the price."
        );
        _;
    }

    modifier checkValue(uint256 _upc) {
        _;
        uint256 _price = items[_upc].price;
        uint256 amountToReturn = msg.value - _price;
        payable(items[_upc].consumerID).transfer(amountToReturn);
    }

    modifier verifyCaller(address _address) {
        require(
            msg.sender == _address,
            "Sender is not the caller of the contract."
        );
        _;
    }

    modifier manufactured(uint256 _upc) {
        require(
            items[_upc].itemState == State.Manufactured,
            "Product hasn't been manufactured."
        );
        _;
    }

    modifier packed(uint256 _upc) {
        require(
            items[_upc].itemState == State.Packed,
            "Product hasn't been packed."
        );
        _;
    }

    modifier forSale(uint256 _upc) {
        require(
            items[_upc].itemState == State.ForSale,
            "Product isn't for sale yet."
        );
        _;
    }

    modifier sold(uint256 _upc) {
        require(
            items[_upc].itemState == State.Sold,
            "Product hasn't been sold."
        );
        _;
    }

    modifier shipped(uint256 _upc) {
        require(
            items[_upc].itemState == State.Shipped,
            "Product hasn't been shipped."
        );
        _;
    }

    modifier received(uint256 _upc) {
        require(
            items[_upc].itemState == State.Received,
            "Product hasn't been received."
        );
        _;
    }

    modifier purchased(uint256 _upc) {
        require(
            items[_upc].itemState == State.Purchased,
            "Product hasn't been purchased."
        );
        _;
    }
}
