import React, { useEffect, useState } from "react"
import "./styles/App.css"
import Header from "./components/Header"
import Items from "./components/items/Items"
import Users from './components/users/Users'
import Search from './components/search/Search'
import { initWeb3, getAccount, initSupplyChain, manufactureItem } from './components/Web3Client'
import Blockchain from './components/Blockchain'

const App = () => {
    // useEffect(() => {
    //     const init = () => {
    //         await initWeb3()
    //     }
    //     init()
    // }, [])

    // const manufacruteItem = () => {
    //     console.log("Button clicked")
    //     manufactureItem({
    //         upc: 123,
    //         price: 789,
    //         originManufacturerID: "0xaf5ccc37d505444d864bb4326aa531db661c9f13",
    //         originManufacturerName: "Waleed",
    //         originManufacturerInformation: "UoH"
    //     })
    // }

    return (
        <div>
            {/* <button onClick={manufacruteItem}>Manufacture Item</button> */}
            <Blockchain />
        </div>
    )
}

export default App
