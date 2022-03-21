import React, { Component } from 'react';
import NewItem from './NewItem';
import ExistingItems from './ExistingItems';

class Items extends Component {
    render() {
        return (
            <div className="section">
                <h1>Item Management</h1>
                <NewItem />
                <ExistingItems />
            </div>
        );
    }
}

export default Items
