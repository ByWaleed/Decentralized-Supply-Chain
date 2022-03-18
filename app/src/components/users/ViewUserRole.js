import React from 'react';

class ViewUserRole extends React.Component {
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

export default ViewUserRole;
