import React from 'react';
import NewItem from './NewItem';
import ExistingItems from './ExistingItems';

export default class Items extends React.Component {
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
