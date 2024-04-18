import React from 'react';

// Dummy purchase data for illustration purposes
const purchaseHistory = [
    { game: "Cyberpunk 2077", price: 59.99, purchaseDate: new Date(2022, 11, 17) },
    { game: "The Witcher 3", price: 39.99, purchaseDate: new Date(2022, 10, 5) },
    // ... other purchases
];

function Purchases() {
    return (
        <div className="container mt-5">
            <h2>Purchase History</h2>
            <p>Review your purchases.</p>
            <table className="table">
                <thead>
                    <tr>
                        <th>Game</th>
                        <th>Price</th>
                        <th>Purchase Date</th>
                    </tr>
                </thead>
                <tbody>
                    {purchaseHistory.map((purchase, index) => (
                        <tr key={index}>
                            <td>{purchase.game}</td>
                            <td>${purchase.price.toFixed(2)}</td>
                            <td>{purchase.purchaseDate.toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Purchases;
