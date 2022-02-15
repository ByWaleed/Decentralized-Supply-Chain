pragma solidity >=0.4.22 <0.9.0;

import "./Ownable.sol";
import "./roles/Consumer.sol";
import "./roles/Distributor.sol";
import "./roles/Manufacturer.sol";
import "./roles/Retailer.sol";

contract SupplyChain is Ownable, Consumer, Distributor, Manufacturer, Retailer {
    // Define a variable called 'upc' for Universal Product Code (UPC)
    uint256 upc;

    // Define enum 'State' with the following values (from 0 to 6):
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
}
