// migrating the appropriate contracts
var Manufacturer = artifacts.require("./Manufacturer.sol");
var Distributor = artifacts.require("./Distributor.sol");
var Retailer = artifacts.require("./Retailer.sol");
var Consumer = artifacts.require("./Consumer.sol");
var SupplyChain = artifacts.require("./SupplyChain.sol");

module.exports = function(deployer) {
  deployer.deploy(Manufacturer);
  deployer.deploy(Distributor);
  deployer.deploy(Retailer);
  deployer.deploy(Consumer);
  deployer.deploy(SupplyChain);
};
