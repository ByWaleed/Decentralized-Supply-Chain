import React, { useEffect, useState } from "react"

import Web3 from 'web3'
import TruffleContract from "truffle-contract"
import SupplyChainJSON from "../contracts/SupplyChain.json"

import { connect } from "react-redux"
import * as blockchainConnectionActions from "../actions/blockchainConnection/blockchainConnectionActions"

const Blockchain = (props) => {

    useEffect(() => {
        const loadBlockchain = async () => {
            // Wallet
            const provider = Web3.givenProvider || "http://localhost:8545"

            // Web3
            const web3 = new Web3(provider)
            const network = await web3.eth.net.getId()
            const accounts = await web3.eth.getAccounts()
            const account = accounts[0]
            const balance = await web3.eth.getBalance(account)
            const balanceEth = web3.utils.fromWei(balance, 'ether')

            // Contract
            const truffle = TruffleContract(SupplyChainJSON)
            truffle.setProvider(provider)
            truffle.setNetwork(network)
            truffle.deployed().then(contract => {
                // Setup Redux Store
                props.actions.setupConnection({
                    contract: contract,
                    account: account,
                    balance: balanceEth,
                    transactions: []
                })

                syncAllEvents(contract)
            })
        }

        const syncAccountChange = () => {
            window.ethereum.on('accountsChanged', function (accounts) {
                loadBlockchain()
            })
        }

        const syncAllEvents = (contract) => {
            console.log(contract)
            contract.getPastEvents({ fromBlock: 0 }, (err, log) => {
                if (!err) console.log(err, log)
            })
        }

        loadBlockchain()
        syncAccountChange()

        return () => { }
    }, [props.actions])

    const [formData, setFormData] = useState({
        'role_userID': '0x06F9a8A40196A92C7dcBe4B80d49a224e0a204d8',
        'role_role': 'Manufacturer'
    })

    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [name]: type === "checkbox" ? checked : value
            }
        })
    }

    const assignRole = (event) => {
        event.preventDefault()

        const contract = props.blockchain.contract
        const account = props.blockchain.account

        const userID = formData.role_userID
        const role = formData.role_role

        switch (role) {
            case "Manufacturer":
                contract.addManufacturer(userID, { from: account })
                    .then(response => console.log("Transaction completed successfully", response))
                    .catch(error => console.log("Error occured while completing transaction", error))
                break
            case "Distributor":
                contract.addDistributor(userID, { from: account })
                    .then(response => console.log("Transaction completed successfully", response))
                    .catch(error => console.log("Error occured while completing transaction", error))
                break
            case "Supplier":
                contract.addSupplier(userID, { from: account })
                    .then(response => console.log("Transaction completed successfully", response))
                    .catch(error => console.log("Error occured while completing transaction", error))
                break
            case "Retailer":
                contract.addRetailer(userID, { from: account })
                    .then(response => console.log("Transaction completed successfully", response))
                    .catch(error => console.log("Error occured while completing transaction", error))
                break
            case "Consumer":
                contract.addConsumer(userID, { from: account })
                    .then(response => console.log("Transaction completed successfully", response))
                    .catch(error => console.log("Error occured while completing transaction", error))
                break
            default:
                console.error("Unkonwn role provided")
                break
        }
    }

    return (
        <div>
            <div className="section">
                <h1>Open Chain</h1>
                <p>Selected account is {props.blockchain.account}</p>
                <p>Selected account balance is {props.blockchain.balance} Eth
                </p>
            </div>
            <div className="section">
                <h1>Users</h1>
                <div>
                    <h2>Assign Role</h2>
                    <form onSubmit={assignRole}>
                        <input
                            type="text"
                            placeholder="User ID"
                            name="role_userID"
                            value={formData.role_userID}
                            onChange={handleInputChange}
                            required
                        />
                        <select name="role_role" onChange={handleInputChange} value={formData.role_role}>
                            <option value="Manufacturer">Manufacturer</option>
                            <option value="Distributor">Distributor</option>
                            <option value="Supplier">Supplier</option>
                            <option value="Retailer">Retailer</option>
                            <option value="Consumer">Consumer</option>
                        </select>
                        <br />
                        <button>Assign Role</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

/**
 * Redux Configuration
 */

const mapStateToProps = (state) => {
    return {
        blockchain: state.blockchain
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        actions: {
            setupConnection: (details) => dispatch(blockchainConnectionActions.setupConnection(details))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Blockchain)
