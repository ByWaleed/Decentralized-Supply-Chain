import React, { Component, useEffect, useState } from "react"
import Web3 from 'web3'
import TruffleContract from "truffle-contract"
import SupplyChainJSON from "../contracts/SupplyChain.json"
import { connect } from "react-redux";

class Blockchain extends Component {
    constructor(props) {
        super(props)
        this.state = {
            provider: null,
            web3: null,
            account: null,
            contract: null,
            transactions: []
        }
    }

    componentWillMount() {
        this.loadBlockchain()
    }

    /**
     * Blockchain Functions
     */
    async loadBlockchain() {
        const provider = Web3.givenProvider || "http://localhost:8545"
        const web3 = new Web3(provider)
        const network = await web3.eth.net.getNetworkType()
        const accounts = await web3.eth.getAccounts()
        const contract = TruffleContract(SupplyChainJSON)
        contract.setProvider(provider)

        this.setState({
            provider: provider,
            web3: web3,
            account: accounts[0],
            contract: contract,
            transactions: []
        })

        this.syncAllEvents(contract)
    }

    syncAllEvents(contract) {
        if (typeof contract.currentProvider.sendAsync !== "function") {
            contract.currentProvider.sendAsync = function () {
                return contract.currentProvider.send.apply(
                    contract.currentProvider,
                    arguments
                );
            };
        }

        contract.deployed()
            .then(instance => {
                var events = instance.allEvents((err, log) => {
                    console.log("Async event received", log)
                });
            })
            .catch((err) => {
                console.error(err.message);
            });
    }

    isManufacturer(state) {
        console.info("Is Manufacturer button clicked")

        // User input
        const account = "0x06F9a8A40196A92C7dcBe4B80d49a224e0a204d8"

        state.contract.deployed()
            .then(instance => {
                return instance.isManufacturer(account)
            })
            .then(res => console.log(res))
            .catch(err => console.error(err))
    }

    addManufacturer(state) {
        console.info("Add Manufacturer button clicked")

        // User input
        const account = "0x06F9a8A40196A92C7dcBe4B80d49a224e0a204d8"

        state.contract.deployed()
            .then(instance => {
                return instance.addManufacturer(account, {
                    from: state.account
                })
            })
            .then(res => this.setState(prevState => (
                this.state,
                { transactions: [...this.state.transactions, res] }
            )))
            .catch(err => console.error(err))
    }

    manufactureItem(state) {
        console.log("Manufacture Item button clicked")
        const item = {
            upc: 123,
            price: 789,
            account: "0x06F9a8A40196A92C7dcBe4B80d49a224e0a204d8",
            manName: "Waleed",
            manInfo: "UoH"
        }

        state.contract.deployed()
            .then(instance => {
                return instance.manufactureItem(
                    item.upc,
                    item.price,
                    item.account,
                    item.manName,
                    item.manInfo,
                    { from: state.account }
                )
            })
            .then(res => {
                this.setState(prevState => (
                    this.state,
                    { transactions: "Updated!" }
                ))
            })
            .catch(err => console.error(err))
    }

    render() {
        return (
            <div>
                <div>
                    <h1>Open Chain</h1>
                    <p>Selected account: {this.state.account}</p>
                    <button onClick={() => this.isManufacturer(this.state)}>Is Manufacturer</button>
                    <button onClick={() => this.addManufacturer(this.state)}>Add Manufacturer</button>
                    <button onClick={() => this.manufactureItem(this.state)}>Manufacture Item</button>
                </div>
                <div>
                    <h2>Blockchain Activity</h2>
                    {this.state.transactions.length}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
      blockchain: state.blockchain
    };
};

export default connect(mapStateToProps)(Blockchain);
