import React, { useEffect } from "react";
import "./styles/App.css";
import Header from "./components/Header";
import Items from "./components/items/Items";
import Users from './components/users/Users';
import Search from './components/search/Search';
import { init } from './components/Web3Client'

const App = () => {
    useEffect(() => {
        init()
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
