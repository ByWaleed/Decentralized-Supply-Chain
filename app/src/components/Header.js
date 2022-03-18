import React from 'react';
import { DrizzleContext } from "@drizzle/react-plugin";
import { newContextComponents } from "@drizzle/react-components";

const { AccountData, ContractData, ContractForm } = newContextComponents;

export default class Header extends React.Component {
    render() {
        const { drizzle, drizzleState } = this.props;
        return (
            <div className='section'>
                <h1>OpenChain</h1>

                <h1>Account Details</h1>
                <AccountData
                    drizzle={drizzle}
                    drizzleState={drizzleState}
                    accountIndex={0}
                    units="ether"
                    precision={4}
                />
            </div>
        );
    }
}
