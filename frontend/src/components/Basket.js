import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromBasket, clearBasket } from '../features/basket/basketSlice';
import { postTransaction } from '../features/transactions/transactionSlice';
import { Button, Modal } from 'react-bootstrap';

const Basket = () => {
  const { items: basketItems, customerId } = useSelector(state => ({
    items: state.basket.items,
    customerId: state.auth.customerId,
  }));
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handlePurchaseClick = (item) => {
    setShow(true);
    setSelectedItem(item);
  };

  const handleConfirmPurchase = () => {
    if (selectedItem) {
      const transactionData = {
        GameId: selectedItem.id,
        CustomerId: customerId,
        Amount: selectedItem.price,
        TransactionDate: new Date().toISOString(),
      };
      dispatch(postTransaction(transactionData));
      dispatch(removeFromBasket(selectedItem));  // Remove the item from the basket after confirming purchase
      setShow(false);
    }
  };

  const handleClose = () => {
    setShow(false);
    setSelectedItem(null);
  };

  return (
    <div>
      <h2>Your Basket</h2>
      {basketItems.length > 0 ? (
        <div>
          {basketItems.map(item => (
            <div key={item.id} className="basket-item">
              <img src={`/images/game_artwork/${item.imageName}`} alt={item.title} className="basket-item-image" />
              <div className="basket-item-details">
                <h5>{item.title}</h5>
                <p>${item.price.toFixed(2)}</p>
              </div>
              <div className="basket-item-actions">
                <Button variant="danger" onClick={() => dispatch(removeFromBasket(item))}>Remove</Button>
                <Button variant="outline-primary" onClick={() => handlePurchaseClick(item)}>Purchase</Button>
              </div>
            </div>
          ))}
          <Button variant="danger" onClick={() => dispatch(clearBasket())}>Clear Basket</Button>
        </div>
      ) : (
        <p>Your basket is empty.</p>
      )}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Purchase</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to purchase this item?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmPurchase}>
            Confirm Purchase
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Basket;
