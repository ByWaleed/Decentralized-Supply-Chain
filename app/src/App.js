import React, { useEffect, useState } from "react"
import "./styles/App.css"
import Header from "./components/Header"
import Items from "./components/items/Items"
import Users from './components/users/Users'
import Search from './components/search/Search'
import { initWeb3, initSupplyChain } from './components/Web3Client'

const App = () => {
    useEffect(() => {
        initWeb3()
        initSupplyChain()
    }, [])

    return (
        <div>
            <Header account={global.account} />
            <Items />
            <Users />
            <Search />
        </div>
    )
}

export default App
