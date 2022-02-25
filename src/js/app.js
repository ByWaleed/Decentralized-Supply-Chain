App = {
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
                console.log("Error:", err);
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

        App.fetchItemBuffer();
    },

    fetchItemBuffer: function () {
        App.contracts.SupplyChain.deployed()
            .then(function (instance) {
                return instance.fetchItemBuffer(App.upc);
            })
            .then(function (result) {
                console.log("fetchItemBuffer", result);
            })
            .catch(function (err) {
                console.log(err.message);
            });
    },
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
