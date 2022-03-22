import Web3 from 'web3'
import SupplyChainJSON from "../contracts/SupplyChain.json"
import TruffleContract from 'truffle-contract'

const providerUrl = Web3.givenProvider || "http://localhost:8545"
let provider = window.ethereum
let selectedAccount
let contract
let web3Provider

export const initWeb3 = async () => {
    if (window.ethereum) {
        web3Provider = window.ethereum;
        try {
            await window.ethereum.enable();
        } catch (error) {
            console.error("User denied account access");
        }
    } else if (window.web3) {
        web3Provider = window.web3.currentProvider;
    } else {
        web3Provider = new Web3.providers.HttpProvider(providerUrl);
    }
}

export const getAccount = () => {
    web3Provider = new Web3(web3Provider);

    web3Provider.eth.getAccounts(function (err, res) {
        if (err) {
            console.error("Error:", err);
            return;
        }
        selectedAccount = res[0];
        console.info(`Selected account ${selectedAccount}`)
    });

    window.ethereum.on('accountsChanged', function (accounts) {
        selectedAccount = accounts[0]
        console.info(`Selected account changed to ${selectedAccount}`)
    })
}

export const initSupplyChain = () => {
    contract = TruffleContract(SupplyChainJSON);
    contract.setProvider(web3Provider)
}

export const manufactureItem = (item) => {
    console.log("Manufacturing item")
    contract.setProvider(web3Provider)
    contract.deployed().then(instance => console.log(instance))

    const { upc, price, originManufacturerID, originManufacturerName, originManufacturerInformation } = item

    // contract.deployed()
    //     .then(function (instance) {
    //         return instance.manufactureItem(
    //             upc,
    //             price,
    //             originManufacturerID,
    //             originManufacturerName,
    //             originManufacturerInformation,
    //             { from: selectedAccount }
    //         );
    //     })
    //     .then(function (result) {
    //         console.info(result.logs[0].event);
    //     })
    //     .catch(function (err) {
    //         console.error(err.message);
    //     });
}
