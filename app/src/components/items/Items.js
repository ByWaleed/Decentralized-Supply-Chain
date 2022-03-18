import React from 'react';
import NewItem from './NewItem';
import SingleItem from './SingleItem';

export default class Items extends React.Component {
    render() {
        return (
            <div className="section">
                <h1>Item Management</h1>

                <NewItem />

                <div>
                    <h2>Existing Items</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>UPC</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Manufacturer</th>
                                <th>Price</th>
                                <th>State</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <SingleItem />
                            <SingleItem />
                            <SingleItem />
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}
