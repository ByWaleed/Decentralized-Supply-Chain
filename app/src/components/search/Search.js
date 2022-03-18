import React from 'react';

class Search extends React.Component {
    render() {
        return (
            <div className="section">
                <h1>Search Item on Blockchain</h1>
                <input type="text" placeholder="Product UPC" required />
                <button>Search</button>
                <table>
                    <tbody>
                        <tr>
                            <td>UPC</td>
                            <td>#123</td>
                        </tr>
                        <tr>
                            <td>Name</td>
                            <td>Nike Hoodie</td>
                        </tr>
                        <tr>
                            <td>Description</td>
                            <td>Plain gray hoodie in medium size.</td>
                        </tr>
                        <tr>
                            <td>Manufacturer</td>
                            <td>Nike</td>
                        </tr>
                        <tr>
                            <td>Price</td>
                            <td>Eth 0.01</td>
                        </tr>
                        <tr>
                            <td>Timestamp</td>
                            <td>01/01/2022 16:00</td>
                        </tr>
                        <tr>
                            <b>Timeline</b>
                        </tr>
                        <tr>
                            <td>Manufactured</td>
                            <td>Yes</td>
                        </tr>
                        <tr>
                            <td>Packed</td>
                            <td>Yes</td>
                        </tr>
                        <tr>
                            <td>For Sale</td>
                            <td>Yes</td>
                        </tr>
                        <tr>
                            <td>Sold</td>
                            <td>Yes</td>
                        </tr>
                        <tr>
                            <td>Shipped</td>
                            <td>Yes</td>
                        </tr>
                        <tr>
                            <td>Received</td>
                            <td>Yes</td>
                        </tr>
                        <tr>
                            <td>Purchased</td>
                            <td>Yes</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Search;
