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
            contract.allEvents((err, log) => {
                if (!err) {
                    props.actions.addTransaction(log)
                }
            })
        }

        loadBlockchain()
        syncAccountChange()

        return () => { }
    }, [props.actions])

    const [formData, setFormData] = useState({
        'role_userID': '',
        'role_role': 'Manufacturer',
    })

    const [outputData, setOutputData] = useState({
        'role_assign': null,
        'role_check': null,
        'role_unassign': null,
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

    const checkRole = (event) => {
        event.preventDefault()

        const contract = props.blockchain.contract
        const account = props.blockchain.account

        const userID = formData.role_userID
        const role = formData.role_role

        const getRoleCall = (role) => {
            if (role == "Manufacturer")
                return contract.isManufacturer(userID, { from: account })
            else if (role == "Distributor")
                return contract.isDistributor(userID, { from: account })
            else if (role == "Retailer")
                return contract.isRetailer(userID, { from: account })
            else if (role == "Consumer")
                return contract.isConsumer(userID, { from: account })
            else
                throw ("Unkonwn role selected " + role)
        }

        getRoleCall(role)
            .then(response => {
                console.log(response)
                // setOutputData(prevOutputData => {
                //     return {
                //         ...prevOutputData,
                //         "role_isAssigned": response
                //     }
                // })
            })
            .catch(error => {
                // TODO: Gracefully show error
                console.error("Error occured while completing transaction", error)
            })
    }

    const assignRole = (event) => {
        event.preventDefault()

        const contract = props.blockchain.contract
        const account = props.blockchain.account

        const userID = formData.role_userID
        const role = formData.role_role

        const getRoleCall = (role) => {
            if (role == "Manufacturer")
                return contract.addManufacturer(userID, { from: account })
            else if (role == "Distributor")
                return contract.addDistributor(userID, { from: account })
            else if (role == "Retailer")
                return contract.addRetailer(userID, { from: account })
            else if (role == "Consumer")
                return contract.addConsumer(userID, { from: account })
            else
                throw ("Unkonwn role selected " + role)
        }

        getRoleCall(role)
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                // TODO: Gracefully show error
                console.error("Error occured while completing transaction", error)
            })
    }

    const unassignRole = (event) => {
        event.preventDefault()

        const contract = props.blockchain.contract
        const account = props.blockchain.account

        const userID = formData.role_userID
        const role = formData.role_role

        const getRoleCall = (role) => {
            if (role == "Manufacturer")
                return contract.renounceManufacturer({ from: account })
            else if (role == "Distributor")
                return contract.renounceDistributor({ from: account })
            else if (role == "Retailer")
                return contract.renounceRetailer({ from: account })
            else if (role == "Consumer")
                return contract.renounceConsumer({ from: account })
            else
                throw ("Unkonwn role selected " + role)
        }

        getRoleCall(role)
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                // TODO: Gracefully show error
                console.error("Error occured while completing transaction", error)
            })
    }

    return (
        <div>
            <div className="section">
                <h1>Open Chain</h1>
                <p>Selected account is {props.blockchain.account}</p>
                <p>Selected account balance is {props.blockchain.balance} Eth
                </p>
            </div>

            {/* Roles Management */}
            <div className="section">
                <h1>Roles Managements</h1>
                <div>
                    <form onSubmit={event => event.preventDefault()}>
                        <label htmlFor="role_userID">User ID </label>
                        <input
                            type="text"
                            placeholder="User ID"
                            id="role_userID"
                            name="role_userID"
                            value={formData.role_userID}
                            onChange={handleInputChange}
                            required
                        />
                        <br />
                        <label htmlFor="role_role">Role </label>
                        <select
                            id="role_role"
                            name="role_role"
                            onChange={handleInputChange}
                            value={formData.role_role}>
                            <option value="Manufacturer">Manufacturer</option>
                            <option value="Distributor">Distributor</option>
                            <option value="Retailer">Retailer</option>
                            <option value="Consumer">Consumer</option>
                        </select>
                        <br />
                        <button onClick={assignRole}>Assign Role</button>
                        <button onClick={checkRole}>Check Role</button>
                        <p>
                            <button onClick={unassignRole}>Unassign Role</button>
                            You can only renounce your roles (not for annother account)
                        </p>

                    </form>
                </div>
            </div>

            {/* Item Managemnet */}
            <div className="section">
                <h1>Manufacture Item</h1>
                <form onSubmit={event => event.preventDefault()}>
                    <label htmlFor="role_userID">Item Name </label>
                    <input
                        type="text"
                        placeholder="Item Name"
                        id="role_userID"
                        name="role_userID"
                        value={formData.role_userID}
                        onChange={handleInputChange}
                        required
                    />
                    <br/>
                </form>
            </div>

            {/* Transactions */}
            <div className="section">
                <h1>Transactions</h1>
                {props.blockchain.transactions.length == 0 && <p>No recent transactions to show.</p>}
                <ul>
                    {props.blockchain.transactions.map((transaction, index) => (
                        <li key={index}>
                            {transaction.event} : {transaction.transactionHash}
                        </li>
                    ))}
                </ul>
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
            setupConnection: (details) => dispatch(blockchainConnectionActions.setupConnection(details)),
            addTransaction: (details) => dispatch(blockchainConnectionActions.addTransaction(details))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Blockchain)
