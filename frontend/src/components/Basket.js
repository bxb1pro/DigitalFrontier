import React, { useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { removeFromBasket, clearBasket } from '../features/basket/basketSlice';
import { postTransaction, postAllTransactions } from '../features/transactions/transactionSlice';
import { Button, Modal } from 'react-bootstrap';
import './Basket.css';

const Basket = () => {
  // useSelector is hook to retrieve state from Redux, and re-render if state changes
  const { items: basketItems, customerId } = useSelector(state => ({
    items: state.basket.items,
    customerId: state.auth.customerId,
  }), shallowEqual);
  // (shallowEqual used for experimental quicker performance)

  // useDispatch is hook to dispatch actions (async or synchronous) to Redux store to change the state
  const dispatch = useDispatch();

  // useState adds local state to manage state in functions
  const [show, setShow] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAllConfirm, setShowAllConfirm] = useState(false);

  // Event handler for selected item for purchase, sets up modal
  const handlePurchaseClick = (item) => {
    setShow(true);
    setSelectedItem(item);
  };

  // Event handler for purchasing all items
  const handlePurchaseAll = () => {
    setShowAllConfirm(true);
  };

  // Event handler for confirming single purchase and dispatching actions
  const handleConfirmPurchase = () => {
    if (selectedItem) {
      const transactionData = {
        GameId: selectedItem.id,
        CustomerId: customerId,
        Amount: selectedItem.price,
        TransactionDate: new Date().toISOString(),
      };
      dispatch(postTransaction(transactionData));
      dispatch(removeFromBasket(selectedItem));
      setShow(false);
    }
  };

  // Event handler for confirming multiple purchase and dispatching actions
  const handleConfirmPurchaseAll = () => {
    dispatch(postAllTransactions()).then(() => {
      dispatch(clearBasket());
      setShowAllConfirm(false);
    });
  };

  // Event handler to close open modals
  const handleClose = () => {
    setShow(false);
    setSelectedItem(null);
  };

  const totalPrice = basketItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="basket">
      <h2>Your Basket</h2>
      <div className="basket-container">
        {basketItems.length > 0 ? (
          <div>
            {basketItems.map((item, index) => (
              <div key={item.id + '-' + index} className="basket-item">
                <img src={`/images/game_artwork/${item.imageName}`} alt={item.title} className="basket-item-image" />
                <div className="basket-item-details">
                  <h5>{item.title}</h5>
                  <p>£{item.price.toFixed(2)}</p>
                </div>
                <div className="basket-item-actions">
                  <Button variant="danger" onClick={() => dispatch(removeFromBasket(item))}>Remove</Button>
                  <Button variant="primary" onClick={() => handlePurchaseClick(item)}>Purchase</Button>
                </div>
              </div>
            ))}
            <div className="total-price">
            <h5>Total Price: £{totalPrice.toFixed(2)}</h5>
            </div>
            <div className="basket-actions">
              <Button variant="danger" onClick={() => dispatch(clearBasket())}>Clear Basket</Button>
              <Button variant="primary" onClick={handlePurchaseAll}>Purchase All</Button>
            </div>
          </div>
        ) : (
          <p>Your basket is empty.</p>
        )}
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Purchase</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to purchase this item?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button variant="primary" onClick={handleConfirmPurchase}>Confirm Purchase</Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showAllConfirm} onHide={() => setShowAllConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Purchase All</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to purchase all items in your basket?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAllConfirm(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleConfirmPurchaseAll}>Confirm Purchase All</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
  
};

export default Basket;
