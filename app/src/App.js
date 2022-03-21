import React from "react";
import "./styles/App.css";
import Header from "./components/Header";
import Items from "./components/items/Items";
import Users from './components/users/Users';
import Search from './components/search/Search';

const App = () => {
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
