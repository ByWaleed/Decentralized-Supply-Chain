App = {
    web3Provider: null,
    contracts: {},
    emptyAddress: "0x0000000000000000000000000000000000000000",
    upc: 0,
    metamaskAccountID: "0x0000000000000000000000000000000000000000",
    ownerID: "0x0000000000000000000000000000000000000000",
    originManufacturerID: "0x0000000000000000000000000000000000000000",
    originManufacturerName: null,
    originManufacturerInformation: null,
    productNotes: null,
    productPrice: 0,
    distributorID: "0x0000000000000000000000000000000000000000",
    retailerID: "0x0000000000000000000000000000000000000000",
    consumerID: "0x0000000000000000000000000000000000000000",

    init: async function () {
        return await App.initWeb3();
    },

    initWeb3: async function () {
        // Find or Inject Web3 Provider
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                await window.ethereum.enable(); // Request account access
            } catch (error) {
                // User denied account access...
                console.error("User denied account access");
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        } // If no injected web3 instance is detected, fall back to Ganache
        else {
            App.web3Provider = new Web3.providers.HttpProvider("http://localhost:8545");
        }

        App.getMetaskAccountID();
    },

    getMetaskAccountID: function () {
        web3 = new Web3(App.web3Provider);

        // Retrieving accounts
        web3.eth.getAccounts(function (err, res) {
            if (err) {
                console.error("Error:", err);
                return;
            }
            console.log("getMetaskID:", res);
            App.metamaskAccountID = res[0];
        });
    },

    initSupplyChain: function () {
        // Source the truffle compiled smart contracts
        var jsonSupplyChain = "../../build/contracts/SupplyChain.json";

        // JSONfy the smart contracts
        $.getJSON(jsonSupplyChain, function (data) {
            console.log("data", data);
            var SupplyChainArtifact = data;
            App.contracts.SupplyChain = TruffleContract(SupplyChainArtifact);
            App.contracts.SupplyChain.setProvider(App.web3Provider);
        });
    },

    manufactureItem: function () {
        App.contracts.SupplyChain.deployed()
            .then(function (instance) {
                return instance.manufactureItem(
                    App.upc,
                    App.metamaskAccountID,
                    "UoH", // App.originManufacturerName,
                    "Waleed @ University of Huddersfield", // App.originManufacturerInformation,
                    { from: App.metamaskAccountID }
                );
            })
            .then(function (result) {
                console.log("manufactureItem", result);
            })
            .catch(function (err) {
                console.error(err.message);
            });
    },
};

$(function () {
    $(window).load(function () {
        App.init();
        App.initSupplyChain();
        // App.manufactureItem();
    });
});
