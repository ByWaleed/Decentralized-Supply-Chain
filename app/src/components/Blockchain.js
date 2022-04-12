import React, { useEffect, useState } from "react"

import Web3 from 'web3'
import TruffleContract from "truffle-contract"
import SupplyChainJSON from "../contracts/SupplyChain.json"

import { connect } from "react-redux"
import * as blockchainConnectionActions from "../actions/blockchainConnection/blockchainConnectionActions"

const Blockchain = (props) => {

    const emptyAddress = "0x0000000000000000000000000000000000000000"
    const stages = ["Pack Item", "Mark for Sale", "Purchase Item", "Mark Shipped", "Confirm Received", "Purchase Item"]

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
        // Role Management
        'role_userID': '',
        'role_role': 'Manufacturer',
        // Manufacture Item
        'item_id': '1',
        'item_name': 'Poco F2 Pro',
        'item_price': '300',
        'item_description': 'MI flagship smart phone release in 2019.',
        // Search Item
        'search_id': ''
    })

    const [outputData, setOutputData] = useState({
        'role_assign': null,
        'role_check': null,
        'role_unassign': null,
        'manufacture_item': null,
        // Search Item
        'search_result': null,
        'search_item': null,
        'step_item_stage': null,
    })

    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: type === "checkbox" ? checked : value
        }))
    }

    const checkRole = (event) => {
        event.preventDefault()

        const contract = props.blockchain.contract
        const account = props.blockchain.account

        const userID = formData.role_userID
        const role = formData.role_role

        if (userID.length != 42) {
            console.error("Invalid address given")
            return
        }

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
                if (response == true)
                    setOutputData(prevOutputData => (
                        prevOutputData,
                        { role_check: role + " ✅" }
                    ))
                else
                    setOutputData(prevOutputData => (
                        prevOutputData,
                        { role_check: role + " ❌" }
                    ))
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

        // TODO: Confirm user `does not` the role to be assigned

        getRoleCall(role)
            .then(response => {
                if (response.receipt.status)
                    setOutputData(prevOutputData => (
                        prevOutputData,
                        { role_assign: "Role assigned successful ✅" }
                    ))
                else
                    setOutputData(prevOutputData => (
                        prevOutputData,
                        { role_assign: "Error occured while assigning role  ❌" }
                    ))
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

        // TODO: Confirm user `has` the role to be unassigned

        getRoleCall(role)
            .then(response => {
                if (response.receipt.status)
                    setOutputData(prevOutputData => (
                        { ...prevOutputData, role_unassign: "Role unassigned successful ✅" }
                    ))
                else
                    setOutputData(prevOutputData => (
                        { prevOutputData, role_unassign: "Error occured while assigning role  ❌" }
                    ))
            })
            .catch(error => {
                // TODO: Gracefully show error
                console.error("Error occured while completing transaction", error)
            })
    }

    const manufactureItem = (event) => {
        event.preventDefault()

        const { contract, account } = props.blockchain
        const {
            item_id,
            item_name,
            item_price,
            item_description } = formData

        contract.manufactureItem(
            item_id,
            item_name,
            item_description,
            item_price,
            { from: account }
        )
            .then(response => {
                if (response.receipt.status)
                    setOutputData(prevOutputData => (
                        { ...prevOutputData, manufacture_item: "Item manufactured successfully ✅" }
                    ))
                else
                    setOutputData(prevOutputData => (
                        { ...prevOutputData, manufacture_item: "Error occured while manufacturing item  ❌" }
                    ))
            })
            .catch(error => {
                // TODO: Gracefully show error
                console.error("Error occured while completing transaction", error)
            })
    }

    const searchItem = (event) => {
        if (event != undefined) event.preventDefault()

        const { contract, account } = props.blockchain
        const { search_id } = formData

        contract.fetchItem(search_id, { from: account })
            .then(response => {
                if (response.owner != emptyAddress)
                    setOutputData(prevOutputData => ({
                        ...prevOutputData,
                        search_result: true,
                        search_item: response
                    }))
                else
                    setOutputData(prevOutputData => (
                        { ...prevOutputData, search_result: false }
                    ))
            })
            .catch(error => {
                // TODO: Gracefully show error
                console.error("Error occured while completing transaction", error)
            })
    }

    const stepItemStage = () => {
        const { contract, account } = props.blockchain
        const item_id = outputData.search_item.UPC.words[0]
        const item_price = outputData.search_item.price.words[0]
        const item_state = outputData.search_item.state.words[0]

        const getActionMethod = (currentState) => {
            if (currentState == 0)
                return contract.packItem(item_id, { from: account })
            else if (currentState == 1)
                return contract.sellItem(item_id, item_price, { from: account })
            else if (currentState == 2)
                return contract.buyItem(item_id, { from: account, value: item_price })
            else if (currentState == 3)
                return contract.shipItem(item_id, { from: account })
            else if (currentState == 4)
                return contract.receiveItem(item_id, { from: account })
            else if (currentState == 5)
                return contract.purchaseItem(item_id, { from: account })
        }

        getActionMethod(item_state)
            .then(response => {
                if (response.owner != emptyAddress) {
                    setOutputData(prevOutputData => ({
                        ...prevOutputData,
                        step_item_stage: "Transaction completed successfully ✅"
                    }))
                    searchItem()
                } else
                    setOutputData(prevOutputData => ({
                        ...prevOutputData,
                        step_item_stage: "Error occured while completing transaction  ❌"
                    }))
                searchItem()
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
                            minLength="12"
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
                        <p>
                            <button onClick={checkRole}>Check Role</button>
                            {outputData.role_check != null ? outputData.role_check : ''}
                        </p>
                        <p>
                            <button onClick={assignRole}>Assign Role</button>
                            {outputData.role_assign != null ? outputData.role_assign : ''}
                        </p>
                        <p>You can only renounce your roles (not for annother account).</p>
                        <p>
                            <button onClick={unassignRole}>Unassign Role</button>
                            {outputData.role_unassign != null ? outputData.role_unassign : ''}
                        </p>
                    </form>
                </div>
            </div>

            {/* Item Managemnet */}
            <div className="section">
                <h1>Manufacture Item</h1>
                <form onSubmit={manufactureItem}>
                    <label htmlFor="item_id">SKU </label>
                    <input
                        type="number"
                        placeholder="ID"
                        id="item_id"
                        name="item_id"
                        value={formData.item_id}
                        onChange={handleInputChange}
                        required
                    />
                    <br />
                    <label htmlFor="item_name">Name </label>
                    <input
                        type="text"
                        placeholder="Name"
                        id="item_name"
                        name="item_name"
                        value={formData.item_name}
                        onChange={handleInputChange}
                        required
                    />
                    <br />
                    <label htmlFor="item_description">Description </label>
                    <input
                        type="text"
                        placeholder="Name"
                        id="item_description"
                        name="item_description"
                        value={formData.item_description}
                        onChange={handleInputChange}
                        required
                    />
                    <br />
                    <label htmlFor="item_price">Price </label>
                    <input
                        type="number"
                        placeholder="Price"
                        id="item_price"
                        name="item_price"
                        value={formData.item_price}
                        onChange={handleInputChange}
                        required
                    />
                    <br />
                    <button>Manufacture</button>
                    <p>{outputData.manufacture_item != null ? outputData.manufacture_item : ''}</p>
                </form>
            </div>
            <div className="section">
                <h1>Search Item</h1>
                <form onSubmit={searchItem}>
                    <label>Item SKU </label>
                    <input
                        type="number"
                        placeholder="SKU"
                        id="search_id"
                        name="search_id"
                        value={formData.search_id}
                        onChange={handleInputChange}
                        required
                    />
                    <button>Search</button>
                    {outputData.search_result == false && <p>No item found 😕</p>}
                    {outputData.search_result && (
                        <table>
                            <tbody>
                                <tr>
                                    <td><strong>UPC</strong></td>
                                    <td>{outputData.search_item.UPC.words[0]}</td>
                                </tr>
                                <tr>
                                    <td><strong>Name</strong></td>
                                    <td>{outputData.search_item.name}</td>
                                </tr>
                                <tr>
                                    <td><strong>Description</strong></td>
                                    <td>{outputData.search_item.description}</td>
                                </tr>
                                <tr>
                                    <td><strong>Price</strong></td>
                                    <td>£{outputData.search_item.price.words[0]}</td>
                                </tr>
                                <tr>
                                    <td><strong>Manufacturer ID</strong></td>
                                    <td>{outputData.search_item.manufacturerID}</td>
                                </tr>
                                <tr>
                                    <td><strong>Distributor ID</strong></td>
                                    <td>{outputData.search_item.distributorID}</td>
                                </tr>
                                <tr>
                                    <td><strong>Retailer ID</strong></td>
                                    <td>{outputData.search_item.retailerID}</td>
                                </tr>
                                <tr>
                                    <td><strong>Consumer ID</strong></td>
                                    <td>{outputData.search_item.consumerID}</td>
                                </tr>
                                <tr>
                                    <td><strong>Timeline</strong></td>
                                    <table>
                                        <tr>
                                            <td>Manufactured</td>
                                            <td>{outputData.search_item.state.words[0] >= 0 ? "✅" : "❌"}</td>
                                        </tr>
                                        <tr>
                                            <td>Packed</td>
                                            <td>{outputData.search_item.state.words[0] >= 1 ? "✅" : "❌"}</td>
                                        </tr>
                                        <tr>
                                            <td>For Sale</td>
                                            <td>{outputData.search_item.state.words[0] >= 2 ? "✅" : "❌"}</td>
                                        </tr>
                                        <tr>
                                            <td>Sold</td>
                                            <td>{outputData.search_item.state.words[0] >= 3 ? "✅" : "❌"}</td>
                                        </tr>
                                        <tr>
                                            <td>Shipped</td>
                                            <td>{outputData.search_item.state.words[0] >= 4 ? "✅" : "❌"}</td>
                                        </tr>
                                        <tr>
                                            <td>Received</td>
                                            <td>{outputData.search_item.state.words[0] >= 5 ? "✅" : "❌"}</td>
                                        </tr>
                                        <tr>
                                            <td>Purchased</td>
                                            <td>{outputData.search_item.state.words[0] >= 6 ? "✅" : "❌"}</td>
                                        </tr>
                                    </table>
                                </tr>
                                <tr>
                                    <td>
                                        {
                                            outputData.search_item.state.words[0] != 6
                                            &&
                                            <button onClick={stepItemStage}>{stages[outputData.search_item.state.words[0]]}</button>
                                        }
                                    </td>
                                    <td><p>{outputData.step_item_stage}</p></td>
                                </tr>
                            </tbody>
                        </table>
                    )}
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
