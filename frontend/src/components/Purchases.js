import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTransactionsByCustomer } from '../features/transactions/transactionSlice';
import { fetchGameById } from '../features/games/gamesSlice';

function Purchases() {
  const dispatch = useDispatch();
  const { transactions, status, error } = useSelector(state => state.transactions);
  const { customerId } = useSelector(state => state.auth);
  const [enrichedTransactions, setEnrichedTransactions] = useState([]);

  // Fetch transactions for a customer
  useEffect(() => {
    if (customerId) {
      dispatch(fetchTransactionsByCustomer(customerId))
        .unwrap()
        .then(data => {
          console.log("Fetched Transactions:", data); // Log fetched transactions
          // Initialize enriched transactions
          setEnrichedTransactions(data.map(transaction => ({
            ...transaction,
            game: null // Initialize game as null
          })));
        })
        .catch((error) => console.error("Fetching transactions failed:", error));
    }
  }, [dispatch, customerId]);

  // Enrich transactions with game details
  useEffect(() => {
    enrichedTransactions.forEach((transaction, index) => {
      if (transaction.gameId && !transaction.game) {
        dispatch(fetchGameById(transaction.gameId))
          .unwrap()
          .then(gameData => {
            const updatedTransactions = [...enrichedTransactions];
            updatedTransactions[index].game = gameData; // Update the game data in the copy of transactions
            setEnrichedTransactions(updatedTransactions); // Set the new state
          })
          .catch(error => console.error("Fetching game data failed:", error));
      }
    });
  }, [transactions, dispatch, enrichedTransactions]);

  if (status === 'loading') return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  console.log("Transactions before rendering:", transactions);
  console.log("Enriched Transactions:", enrichedTransactions);

  return (
    <div className="container mt-5">
      <h2>Purchase History</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Game</th>
            <th>Price</th>
            <th>Purchase Date</th>
          </tr>
        </thead>
        <tbody>
          {enrichedTransactions.map((transaction, index) => (
            <tr key={index}>
              <td>{transaction.game ? transaction.game.name : 'No game info'}</td>
              <td>${transaction.amount.toFixed(2)}</td>
              <td>{new Date(transaction.transactionDate).toLocaleDateString()}</td>
              {/* Convert string to Date object before calling toLocaleDateString() */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Purchases;
