import React, { useState, useEffect } from "react";
import axios from "axios";
import { useContext } from "react";
import { userContext } from "../../App";
import "./cartStyle.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const { token, userId } = useContext(userContext);

  const toggleCart = () => {
    setShowCart(!showCart);
  };

  useEffect(() => {
    getToCart();
  }, [showCart]);

  const getToCart = () => {
    axios
      .get(`http://localhost:5000/users/get/cart`, {
        params: { userId: userId },
      })
      .then((result) => {
        setCartItems(result.data.products[0].ProductId);
      })
      .catch((err) => {
        console.log(err);
        setCartItems([]);
      });
  };

  const deleteCartById = (productId) => {
    axios
      .delete(`http://localhost:5000/users/cart/delete`, {
        data: { userId: userId, productId: productId },
      })
      .then((result) => {
        getToCart();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const buyItems = () => {
    axios
      .post(`http://localhost:5000/orders/create`, {
        userId: userId,
        products: cartItems,
      })
      .then((response) => {
        setCartItems([]);
        setShowCart(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <button onClick={toggleCart} className="toggleCartButton">
        {showCart ? "Hide Cart" : "Show Cart"}
      </button>
      <div className="cartBox">
        {showCart && (
          <div>
            <h2>Cart</h2>
            <p>Number of items in cart: {cartItems.length}</p>
            {cartItems.length === 0 ? (
              <p>No item in cart</p>
            ) : (
              <ul>
                {cartItems.map((item, index) => (
                  <li key={index}>
                    <div>
                      <p>Item Number ({index + 1})</p>
                      <h3>{item.title}</h3>
                      <div className="imageAndDescription">
                        <p>Description: {item.description}</p>
                        <img className="imageProduct" src={item.image} />
                      </div>
                      <p>Price: {item.price}</p>
                    </div>
                    <br />
                    <button
                      className="deleteCart"
                      onClick={() => deleteCartById(item._id)}
                    >
                      Delete
                    </button>
                    <hr />
                    <br />
                    <br />
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
      <button className="buyBTN" onClick={buyItems}>
        Buy
      </button>
    </div>
  );
};

export default Cart;
