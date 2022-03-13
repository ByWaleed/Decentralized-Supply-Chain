var SupplyChain = artifacts.require("SupplyChain");

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract("SupplyChain", (accounts) => {
    // Item and Manufacturer Details
    var sku = 12;
    const productPrice = web3.utils.toWei("0.07", "ether");
    var itemState = 0;
    const originManufacturerName = "Number One Manufacturer";
    const originManufactuereInformation = "Contact details";

    // Accounts
    const ownerID = accounts[0];
    const originManufacturerID = accounts[1];
    const distributorID = accounts[2];
    const retailerID = accounts[3];
    const consumerID = accounts[4];



    const emptyAddress = "0x00000000000000000000000000000000000000";

    console.log("ganache-cli accounts used here...");
    console.log("Contract Owner: ", accounts[0]);
    console.log("Manufacturer: ", accounts[1]);
    console.log("Distributor: ", accounts[2]);
    console.log("Retailer: ", accounts[3]);
    console.log("Consumer: ", accounts[4]);

    let supplyChain;

    beforeEach(async () => {
        supplyChain = await SupplyChain.deployed()
    })

    describe('Manufacturer', async () => {
        let result
        it('add a manufacturer', async () => {
            result = await supplyChain.addManufacturer(originManufacturerID);
            const log = result.logs[0]
            const event = log.args
            event.account.toString().should.equal(originManufacturerID, 'Manufactuere is correct')
        });
    });

    describe('ManufactureItem', async () => {
        let result
        it('manufacture an item', async () => {
            result = await supplyChain.manufactureItem(
                sku,
                originManufacturerID,
                originManufacturerName,
                originManufactuereInformation
            );
            const log = result.logs[0]
            const event = log.args
            const resultBufferOne = await supplyChain.fetchItemBuffer(sku);

            console.log(resultBufferOne[2]);
            console.log(originManufacturerID);
            assert.equal(resultBufferOne[0], sku, "Error: Invalid item SKU");
            // assert.equal(
            //     resultBufferOne[2],
            //     originManufacturerID,
            //     "Error: Missing or Invalid ownerID"
            // );
        });
    });

});
