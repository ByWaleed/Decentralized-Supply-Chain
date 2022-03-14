App = {
    web3Provider: null,
    contracts: {},

    upc: 0,
    productNotes: null,
    productPrice: 0,

    emptyAddress: "0x0000000000000000000000000000000000000000",
    metamaskAccountID: "0x0000000000000000000000000000000000000000",

    ownerID: "0x0000000000000000000000000000000000000000",
    originManufacturerID: "0x0000000000000000000000000000000000000000",
    distributorID: "0x0000000000000000000000000000000000000000",
    retailerID: "0x0000000000000000000000000000000000000000",
    consumerID: "0x0000000000000000000000000000000000000000",

    originManufacturerName: null,
    originManufacturerInformation: null,

    init: async function () {
        App.readForm();
        return await App.initWeb3(); // Setup blockchain
    },

    /**
     * UI Setup Functions
     */
    readForm: function () {
        App.sku = $("#sku").val();
        App.ownerID = "0x45C0340627654a06A19C0F8f49B8C061A51b5739";

        App.originManufacturerID = "0x45C0340627654a06A19C0F8f49B8C061A51b5739";
        App.originManufacturerName = "UoH";
        App.originManufacturerInformation = "Waleed Islam @ University of Huddersfield";
        App.productPrice = "0.1"; // Eth

        App.distributorID = "";
        App.retailerID = "";
        App.consumerID = "";
    },

    bindEvents: function () {
        $(button).on("click", App.handleButtonClick);
    },

    handleButtonClick: async function (event) {
        event.preventDefault();

        App.getMetaskAccountID();

        var operation = $(event.target).data("id");

        switch (operation) {
            case 'manufacture':
                return await App.manufactureItem(event);
        }
    },

    /**
     * Blockchain Setup Functions
     */

    initWeb3: async function () {
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                await window.ethereum.enable();
            } catch (error) {
                console.error("User denied account access");
            }
        } else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        } else {
            App.web3Provider = new Web3.providers.HttpProvider("http://localhost:8545");
        }

        App.getMetaskAccountID();
        return App.initSupplyChain();
    },

    getMetaskAccountID: function () {
        web3 = new Web3(App.web3Provider);

        web3.eth.getAccounts(function (err, res) {
            if (err) {
                console.error("Error:", err);
                return;
            }
            App.metamaskAccountID = res[0];
        });
    },

    initSupplyChain: function () {
        var compiledContract = "../../build/contracts/SupplyChain.json";

        $.getJSON(compiledContract, function (data) {
            var Artifact = data;
            App.contracts.SupplyChain = TruffleContract(Artifact);
            App.contracts.SupplyChain.setProvider(App.web3Provider);

            App.fetchEvents();
        });

        return App.bindEvents();
    },

    /**
     * Supply Chain Interaction Functions
     */
    manufactureItem: function () {
        App.contracts.SupplyChain.deployed()
            .then(function (instance) {
                return instance.manufactureItem(
                    App.upc,
                    App.metamaskAccountID,
                    App.originManufacturerName,
                    App.originManufacturerInformation,
                    { from: App.metamaskAccountID }
                );
            })
            .then(function (result) {
                console.info(result.logs[0].event);
            })
            .catch(function (err) {
                console.error(err.message);
            });
    },

    fetchEvents: function () {
        if (typeof App.contracts.SupplyChain.currentProvider.sendAsync !== "function") {
            App.contracts.SupplyChain.currentProvider.sendAsync = function () {
                return App.contracts.SupplyChain.currentProvider.send.apply(
                    App.contracts.SupplyChain.currentProvider,
                    arguments
                );
            };
        }

        App.contracts.SupplyChain.deployed()
            .then(function (instance) {
                var events = instance.allEvents(function (err, log) {
                    if (!err)
                        $("#ftc-events").append(
                            "<li>" + log.event + " - " + log.transactionHash + "</li>"
                        );
                });
            })
            .catch(function (err) {
                console.error(err.message);
            });
    }
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
