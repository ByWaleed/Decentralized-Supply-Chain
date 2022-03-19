import React from 'react';

export default class NewItem extends React.Component {
    manufactureItem() {
        console.log("Clicked");
    }

    render() {
        return (
            <div>
                <h2>New Item</h2>
                <input type="number" placeholder="UPC" required/>
                <input type="text" placeholder="Name"required />
                <input type="text" placeholder="Description" required />
                <input type="number" placeholder="Price (eth)" required/>
                <button onClick={this.manufactureItem}>Manufacture</button>
            </div>
        );
    }
}
