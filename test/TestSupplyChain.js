const { assert } = require('chai');

var SupplyChain = artifacts.require("SupplyChain");

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract("SupplyChain", (accounts) => {
    // Item and Manufacturer Details
    var upc = 12;
    const itemName = "Item Name"
    const itemDescription = "Description";
    const itemPrice = web3.utils.toWei("0.07", "ether");
    var itemState = 0;

    // Accounts
    const ownerID = accounts[0];
    const manufacturerID = accounts[1];
    const distributorID = accounts[2];
    const retailerID = accounts[3];
    const consumerID = accounts[4];

    console.log("ganache-cli accounts used here...");
    console.log("Contract Owner: ", accounts[0]);
    console.log("Manufacturer: ", manufacturerID);
    console.log("Distributor: ", distributorID);
    console.log("Retailer: ", retailerID);
    console.log("Consumer: ", consumerID);

    const emptyAddress = "0x0000000000000000000000000000000000000000";

    let supplyChain;

    before(async () => {
        supplyChain = await SupplyChain.deployed()
    })

    describe('Role: Manufacturer', async () => {
        let result

        it('add a manufacturer', async () => {
            result = await supplyChain.addManufacturer(manufacturerID);
            const log = result.logs[0]
            const event = log.args
            event.account.toString().should.equal(manufacturerID, 'Manufacturer is correct')
        });

        it('check if manufacturer', async () => {
            result = await supplyChain.isManufacturer(manufacturerID);
            assert.equal(result, true, "Manufacturer does not have the correct role")
        });

        it('renounce manufacturer role', async () => {
            renounce = await supplyChain.renounceManufacturer({ from: manufacturerID });
            result = await supplyChain.isManufacturer(manufacturerID);
            assert.equal(result, false, "Manufacturer does not have the correct role")
        });

        it('add a manufacturer again', async () => {
            result = await supplyChain.addManufacturer(manufacturerID);
            const log = result.logs[0]
            const event = log.args
            event.account.toString().should.equal(manufacturerID, 'Manufacturer is correct')
        });
    });

    describe('Role: Distributor', async () => {
        let result

        it('add a distributor', async () => {
            result = await supplyChain.addDistributor(distributorID);
            const log = result.logs[0]
            const event = log.args
            event.account.toString().should.equal(distributorID, 'Distributor is correct')
        });

        it('check if distributor', async () => {
            result = await supplyChain.isDistributor(distributorID);
            assert.equal(result, true, "Distributor does not have the correct role")
        });

        it('renounce distributor role', async () => {
            renounce = await supplyChain.renounceDistributor({ from: distributorID });
            result = await supplyChain.isDistributor(distributorID);
            assert.equal(result, false, "Distributor does not have the correct role")
        });

        it('add a distributor again', async () => {
            result = await supplyChain.addDistributor(distributorID);
            const log = result.logs[0]
            const event = log.args
            event.account.toString().should.equal(distributorID, 'Distributor is correct')
        });
    });

    describe('Role: Retailer', async () => {
        let result

        it('add a retailer', async () => {
            result = await supplyChain.addRetailer(retailerID);
            const log = result.logs[0]
            const event = log.args
            event.account.toString().should.equal(retailerID, 'Retailer is correct')
        });

        it('check if retailer', async () => {
            result = await supplyChain.isRetailer(retailerID);
            assert.equal(result, true, "Retailer does not have the correct role")
        });

        it('renounce retailer role', async () => {
            renounce = await supplyChain.renounceRetailer({ from: retailerID });
            result = await supplyChain.isRetailer(retailerID);
            assert.equal(result, false, "Retailer does not have the correct role")
        });

        it('add a retailer again', async () => {
            result = await supplyChain.addRetailer(retailerID);
            const log = result.logs[0]
            const event = log.args
            event.account.toString().should.equal(retailerID, 'Retailer is correct')
        });
    });

    describe('Role: Consumer', async () => {
        let result

        it('add a consumer', async () => {
            result = await supplyChain.addConsumer(consumerID);
            const log = result.logs[0]
            const event = log.args
            event.account.toString().should.equal(consumerID, 'Consumer is correct')
        });

        it('check if consumer', async () => {
            result = await supplyChain.isConsumer(consumerID);
            assert.equal(result, true, "Consumer does not have the correct role")
        });

        it('renounce consumer role', async () => {
            renounce = await supplyChain.renounceConsumer({ from: consumerID });
            result = await supplyChain.isConsumer(consumerID);
            assert.equal(result, false, "Consumer does not have the correct role")
        });

        it('add a consumer again', async () => {
            result = await supplyChain.addConsumer(consumerID);
            const log = result.logs[0]
            const event = log.args
            event.account.toString().should.equal(consumerID, 'Consumer is correct')
        });
    });

    describe('Manufacture Item', async () => {
        let result

        it('manufacture an item', async () => {
            result = await supplyChain.manufactureItem(
                upc,
                itemName,
                itemDescription,
                itemPrice,
                { from: manufacturerID }
            );
            const log = result.logs[0]
            const event = log.args
            const fetchItem = await supplyChain.fetchItem(upc);

            // UPC
            assert.equal(fetchItem[0], upc, "Error: Invalid item UPC");

            // Name
            assert.equal(
                fetchItem[5],
                itemName,
                "Error: Missing or Invalid name"
            );

            // Description
            assert.equal(
                fetchItem[6],
                itemDescription,
                "Error: Missing or Invalid price"
            );

            // State
            assert.equal(fetchItem[3], itemState, "Error: Missing or Invalid state");

            // Manufacturer ID
            assert.equal(
                fetchItem[4],
                manufacturerID,
                "Error: Missing or Invalid manufacturerID"
            );
        });
    });

    describe('Pack Item', async () => {
        let result

        it('pack an item', async () => {
            result = await supplyChain.packItem(upc);
            const log = result.logs[0]
            const event = log.event.toString()

            const fetchItem = await supplyChain.fetchItem(upc);

            assert.equal(fetchItem[0], upc, "Error: Invalid item UPC");

            assert.equal(fetchItem[1], manufacturerID, "Error: Invalid ownerID");

            assert.equal(event, "Packed", "Invalid event emitted");
        });
    });

    describe('Sell Item', async () => {
        let result
        it('mark item for sale', async () => {
            result = await supplyChain.sellItem(upc, itemPrice);
            const log = result.logs[0]
            const event = log.event.toString()

            const fetchItem = await supplyChain.fetchItem(upc);

            assert.equal(fetchItem[0], upc, "Error: Invalid item UPC");
            assert.equal(fetchItem[1], manufacturerID, "Error: Invalid ownerID");
            assert.equal(fetchItem[2], itemPrice, "Error: Invalid item price");

            assert.equal(fetchItem[3], 2, "Error: Invalid item State");

            assert.equal(event, 'ForSale', "Invalid event emitted");
        });
    });

    describe('Buy Item', async () => {
        let result

        it('buy an item', async () => {
            result = await supplyChain.buyItem(upc, {
                value: itemPrice,
                from: distributorID,
            });
            const log = result.logs[0]
            const event = log.event.toString()

            const fetchItem = await supplyChain.fetchItem(upc);

            assert.equal(fetchItem[0], upc, "Error: Invalid item UPC");
            assert.equal(fetchItem[1], distributorID, "Error: Invalid ownerID");
            assert.equal(fetchItem[2], itemPrice, "Error: Invalid item price");

            assert.equal(fetchItem[4], manufacturerID, "Error: Missing or Invalid manufacturerID");
            assert.equal(fetchItem[7], distributorID, "Error: Missing or Invalid distributorID");
            assert.equal(fetchItem[8], emptyAddress, "Error: Missing or Invalid retailerID");
            assert.equal(fetchItem[9], emptyAddress, "Error: Missing or Invalid consumerID");

            assert.equal(fetchItem[3], 3, "Error: Invalid item State");

            assert.equal(event, 'Sold', "Invalid event emitted");
        });
    });

    describe('Ship Item', async () => {
        let result
        it('ship an item', async () => {
            result = await supplyChain.shipItem(upc, { from: distributorID });
            const log = result.logs[0]
            const event = log.event.toString()

            const fetchItem = await supplyChain.fetchItem(upc);

            assert.equal(fetchItem[0], upc, "Error: Invalid item UPC");
            assert.equal(fetchItem[1], distributorID, "Error: Invalid ownerID");
            assert.equal(fetchItem[2], itemPrice, "Error: Invalid item price");

            assert.equal(fetchItem[4], manufacturerID, "Error: Missing or Invalid manufacturerID");
            assert.equal(fetchItem[7], distributorID, "Error: Missing or Invalid distributorID");
            assert.equal(fetchItem[8], emptyAddress, "Error: Missing or Invalid retailerID");
            assert.equal(fetchItem[9], emptyAddress, "Error: Missing or Invalid consumerID");

            assert.equal(fetchItem[3], 4, "Error: Invalid item State");

            assert.equal(event, 'Shipped', "Invalid event emitted");
        });
    });

    describe('Receive Item', async () => {
        let result
        it('receive an item', async () => {
            result = await supplyChain.receiveItem(upc, { from: retailerID });
            const log = result.logs[0]
            const event = log.event.toString()

            const fetchItem = await supplyChain.fetchItem(upc);

            assert.equal(fetchItem[0], upc, "Error: Invalid item UPC");
            assert.equal(fetchItem[1], retailerID, "Error: Invalid ownerID");
            assert.equal(fetchItem[2], itemPrice, "Error: Invalid item price");

            assert.equal(fetchItem[4], manufacturerID, "Error: Missing or Invalid manufacturerID");
            assert.equal(fetchItem[7], distributorID, "Error: Missing or Invalid distributorID");
            assert.equal(fetchItem[8], retailerID, "Error: Missing or Invalid retailerID");
            assert.equal(fetchItem[9], emptyAddress, "Error: Missing or Invalid consumerID");

            assert.equal(fetchItem[3], 5, "Error: Invalid item State");

            assert.equal(event, 'Received', "Invalid event emitted");
        });
    });

    describe('Purchase Item', async () => {
        let result

        it('purchase an item', async () => {
            result = await supplyChain.purchaseItem(upc, { from: consumerID });
            const log = result.logs[0]
            const event = log.event.toString()

            const fetchItem = await supplyChain.fetchItem(upc);

            assert.equal(fetchItem[0], upc, "Error: Invalid item UPC");
            assert.equal(fetchItem[1], consumerID, "Error: Invalid ownerID");
            assert.equal(fetchItem[2], itemPrice, "Error: Invalid item price");

            assert.equal(fetchItem[4], manufacturerID, "Error: Missing or Invalid manufacturerID");
            assert.equal(fetchItem[7], distributorID, "Error: Missing or Invalid distributorID");
            assert.equal(fetchItem[8], retailerID, "Error: Missing or Invalid retailerID");
            assert.equal(fetchItem[9], consumerID, "Error: Missing or Invalid consumerID");

            assert.equal(fetchItem[3], 6, "Error: Invalid item State");

            assert.equal(event, 'Purchased', "Invalid event emitted");
        });
    });

    describe('Fetch Item', async () => {
        let fetchItem
        let resultBufferTwo

        it('fetch item details', async () => {
            fetchItem = await supplyChain.fetchItem(upc);

            assert.equal(fetchItem[0], upc, "Error: Invalid item UPC");
            assert.equal(fetchItem[1], consumerID, "Error: Invalid ownerID");
            assert.equal(fetchItem[2], itemPrice, "Error: Invalid item price");
            assert.equal(fetchItem[3], 6, "Error: Invalid item State");
            assert.equal(fetchItem[4], manufacturerID, "Error: Missing or Invalid manufacturerID");
            assert.equal(fetchItem[5], itemName, "Error: Invalid item name");
            assert.equal(fetchItem[6], itemDescription, "Error: Invalid item description");
            assert.equal(fetchItem[7], distributorID, "Error: Missing or Invalid distributorID");
            assert.equal(fetchItem[8], retailerID, "Error: Missing or Invalid retailerID");
            assert.equal(fetchItem[9], consumerID, "Error: Missing or Invalid consumerID");
        });

        // Move tests into individual files e.g. Roles, Item Stages, Fetchign Data
    });
});
