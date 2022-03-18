import React from 'react';

export default class CreateUser extends React.Component {
    render() {
        return (
            <div>
                <h2>Assign Role</h2>
                <input type="number" placeholder="User ID" required/>
                <select>
                    <option value="Manufacturer">Manufacturer</option>
                    <option value="Distributor">Distributor</option>
                    <option value="Supplier">Supplier</option>
                    <option value="Retailer">Retailer</option>
                </select>
                <br/>
                <button>Assign Role</button>
                <button>Unassign Role</button>
            </div>
        );
    }
}
