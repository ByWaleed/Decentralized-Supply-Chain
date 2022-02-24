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
        else if (window.web3)
            App.web3Provider = window.web3.currentProvider;
        // If no injected web3 instance is detected, fall back to Ganache
        else
            App.web3Provider = new Web3.providers.HttpProvider("http://localhost:8545");
    }
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
