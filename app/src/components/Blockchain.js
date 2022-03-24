import React, { useEffect, useState } from "react"
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
            const network = await web3.eth.net.getId()
            const accounts = await web3.eth.getAccounts()
            const contract = TruffleContract(SupplyChainJSON)
            contract.setProvider(provider)
            contract.setNetwork(network)
            const balance = await web3.eth.getBalance(accounts[0])
            const deployedContract = await contract.deployed()

            props.actions.setupConnection({
                provider: provider,
                // web3: web3, // TODO: Gives error when stored in blockchain
                account: accounts[0],
                balance: web3.utils.fromWei(balance, 'ether'),
                contract: deployedContract,
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

    const [formData, setFormData] = useState({
        'role_userID': '0x06F9a8A40196A92C7dcBe4B80d49a224e0a204d8',
        'role_role': 'Manufacturer'
    });

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

        const account = props.blockchain.account
        const userID = formData.role_userID
        const role = formData.role_role

        let contract = props.blockchain.contract

        contract.addManufacturer(userID, { from: account }).then(console.log)



        // props.blockchain.contract.deployed().then(instance => {
        //     instance.addManufacturer(userID, { from: account }).call((err, res) => {
        //         console.log(err)
        //         console.log(res)
        //     })
        // })

        // props.blockchain.contract.deployed()
        //     .then(instance => {
        //         return instance.addManufacturer(
        //             userID,
        //             {
        //                 from: props.blockchain.account
        //             }
        //         );
        //     })
        //     .then(result => {
        //         console.log(result.logs[0].event);
        //     })
        //     .catch(err => {
        //         console.log(err.message);
        //     });

        // switch (role) {
        //     case "Manufacturer":

        //     case "Distributor":

        //     case "Supplier":

        //     case "Retailer":

        //     default:
        //         console.error("Unkonwn role provided")
        // }
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
                        </select>
                        <br />
                        <button>Assign Role</button>
                    </form>
                </div>
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
