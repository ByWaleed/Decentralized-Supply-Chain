import Web3 from 'web3'
import SupplyChain from "../contracts/SupplyChain.json"

const providerUrl = process.env.PROVIDER_URL || "http://localhost:8545"
let provider = window.ethereum
let selectedAccount
let contract
let web3

let initialized = false

// Initialize Web3 & account
export const initWeb3 = () => {
    if (typeof provider !== 'undefined') {
        provider
            .request({ method: 'eth_requestAccounts' })
            .then((accounts) => {
                selectedAccount = accounts[0]
                console.info(`Selected account is ${selectedAccount}`)
            })
            .catch((err) => {
                console.error(err)
                return
            })

        window.ethereum.on('accountsChanged', function (accounts) {
            selectedAccount = accounts[0]
            console.info(`Selected account changed to ${selectedAccount}`)
        })
    }

    web3 = new Web3(providerUrl)
    initialized = true
}

// Initialize Supply Chain smart contract
export const initSupplyChain = () => {
    if (!initialized) { initWeb3() }
    contract = new web3.eth.Contract(SupplyChain.abi)
}
