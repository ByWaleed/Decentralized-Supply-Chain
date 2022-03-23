import React, {useEffect, useState } from "react"
import Web3 from 'web3'
import TruffleContract from "truffle-contract"
import SupplyChainJSON from "../contracts/SupplyChain.json"
import { connect } from "react-redux";
import * as blockchainConnectionActions from "../actions/blockchainConnection/blockchainConnectionActions"

const Blockchain = (props) => {

    useEffect(() => {

        const loadBlockchain = async () => {
            const provider = Web3.givenProvider || "http://localhost:8545"
            const web3 = new Web3(provider)
            const network = await web3.eth.net.getNetworkType()
            const accounts = await web3.eth.getAccounts()
            const contract = TruffleContract(SupplyChainJSON)
            contract.setProvider(provider)
            const balance = await web3.eth.getBalance(accounts[0])

            props.actions.setupConnection({
                provider: provider,
                web3: web3, // TODO: Gives error when stored in blockchain
                account: accounts[0],
                balance: web3.utils.fromWei(balance, 'ether'),
                contract: contract,
                transactions: []
            });
        }

        const syncAccountChange = () => {
            window.ethereum.on('accountsChanged', function (accounts) {
                loadBlockchain()
            });
        }

        loadBlockchain()
        syncAccountChange()

        return () => {

        };
    }, [props.actions]);

    // const isManufacturer = () => {
    //     console.info("Is Manufacturer button clicked")

    //     // User input
    //     const account = "0x06F9a8A40196A92C7dcBe4B80d49a224e0a204d8"

    //     state.contract.deployed()
    //         .then(instance => {
    //             return instance.isManufacturer(account)
    //         })
    //         .then(res => console.log(res))
    //         .catch(err => console.error(err))
    // }

    // const addManufacturer = () => {
    //     console.info("Add Manufacturer button clicked")

    //     // User input
    //     const account = "0x06F9a8A40196A92C7dcBe4B80d49a224e0a204d8"

    //     state.contract.deployed()
    //         .then(instance => {
    //             return instance.addManufacturer(account, {
    //                 from: state.account
    //             })
    //         })
    //         .then(res => this.setState(prevState => (
    //             this.state,
    //             { transactions: [...this.state.transactions, res] }
    //         )))
    //         .catch(err => console.error(err))
    // }

    return (
        <div>
            <div className="section">
                <h1>Open Chain</h1>
                <p>Selected account is {props.blockchain.account}</p>
                <p>Selected account balance is {props.blockchain.balance} Eth
                </p>
            </div>
            <div className="section">
                <h2>Blockchain Activity</h2>
                <p>Transcations history here...</p>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
      blockchain: state.blockchain
    };
};


const mapDispatchToProps = (dispatch) => {
    return {
      actions: {
        setupConnection: (details) => dispatch(blockchainConnectionActions.setupConnection(details))
      },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Blockchain);
