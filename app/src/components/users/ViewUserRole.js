import React from 'react';

export default class ViewUserRole extends React.Component {
    render() {
        return (
            <div>
                <h2>View User Role</h2>
                <input type="number" placeholder="User ID" required/>
                <button>View</button>
                <p>
                    Manufacturer ✅
                    <br/>
                    Distributor ❌
                    <br/>
                    Supplier ❌
                    <br/>
                    Retailer ❌
                </p>
            </div>
        );
    }
}
