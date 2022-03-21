import React, { useState } from "react"
import Web3 from 'web3';

const providerUrl = process.env.PROVIDER_URL || "http://localhost:8545";
let provider = window.ethereum;
let selectedAccount;

// Web3 account init & change handling
export const init = () => {
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

    const web3 = new Web3(providerUrl);
}
