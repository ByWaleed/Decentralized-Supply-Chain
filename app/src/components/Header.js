import React, { Component } from 'react';

class Header extends Component {
    render() {
        return (
            <div className='section'>
                <h1>OpenChain</h1>

                <h1>Account Details</h1>
                <p>Selected account is 0x000000...</p>
                <p>Selected account balance is 0.000 Eth</p>
            </div>
        );
    }
}

export default Header
