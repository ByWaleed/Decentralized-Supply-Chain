import React from "react";
import { DrizzleContext } from "@drizzle/react-plugin";
import { Drizzle } from "@drizzle/store";
import drizzleOptions from "./drizzleOptions";
import "./styles/App.css";
import Header from "./components/Header";
import Items from "./components/items/Items";
import Users from './components/users/Users';
import Search from './components/search/Search';

// const drizzle = new Drizzle(drizzleOptions);

const App = () => {
    return (
        <div className="App">
            <Header />
            <Items />
            <Users />
            <Search />
        </div>
    );
}

export default App;
