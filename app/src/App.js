import React, { useEffect } from "react";
import "./styles/App.css";
import Header from "./components/Header";
import Items from "./components/items/Items";
import Users from './components/users/Users';
import Search from './components/search/Search';
import Web3 from 'web3';

const App = () => {
    const providerUrl = process.env.PROVIDER_URL || "http://localhost:8545";
    let selectedAccount;

    // Web3 account init & change handling
    useEffect(() => {
        const web3 = new Web3(providerUrl);
        let provider = window.ethereum;
        if (typeof provider !== 'undefined') {
            provider
                .request({ method: 'eth_requestAccounts' })
                .then((accounts) => {
                    selectedAccount = accounts[0];
                    console.info(`Selected account is ${selectedAccount}`);
                })
                .catch((err) => {
                    console.error(err);
                    return;
                });

            window.ethereum.on('accountsChanged', function (accounts) {
                selectedAccount = accounts[0];
                console.info(`Selected account changed to ${selectedAccount}`);
            });
        }
    }, []);

    return (
        <div>
            <Header />
            <Items />
            <Users />
            <Search />
        </div>
    );
}

export default App;
