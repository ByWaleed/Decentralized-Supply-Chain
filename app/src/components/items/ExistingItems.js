import React from 'react';
import SingleItem from './SingleItem';

export default class ExistingItems extends React.Component {
    render() {
        return (
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
        );
    }
}
