import React, { createContext, useState } from "react";
import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import Register from "./components/shared components/Register";
import Login from "./components/shared components/Login";
import Product from "./components/shared components/Product";
import Cart from "./components/shared components/Cart";
import { BsCart4 } from "react-icons/bs";
import { BiLogIn, BiSolidHomeAlt2 } from "react-icons/bi";
import { AiOutlineUserAdd } from "react-icons/ai";

export const userContext = createContext();

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "");
  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || ""
  );

  return (
    <div className="App">
      <userContext.Provider
        value={{ token, setToken, userId, setUserId, userName, setUserName }}
      >
        <div className="navBar">
          <div className="imageLogoBar">
            <img className="imageLogo" src="logo.png" />
            <p className="logoText">Royal Shopper</p>
          </div>
          <div>
            <Link className="registerLink" to={"/create"}>
              <AiOutlineUserAdd />
              <br /> Create Account
            </Link>
            <Link className="loginLink" to={"/login"}>
              <BiLogIn />
              <br /> Login
            </Link>
            <Link className="productLink" to={"/all"}>
              <BiSolidHomeAlt2 />
              <br /> Home
            </Link>
            <Link className="cartLink" to={"/cart"}>
              <BsCart4 />
              <br /> My Cart
            </Link>
          </div>
        </div>
        <Routes>
          <Route
            path="/"
            element={
              <div className="wellcomeMessage">
                <h4 className="wellcomeh4">
                  Welcome to Royal Shopper, your ultimate online shopping
                  destination!
                </h4>
                <h5>
                  At Royal Shopper, we are proud to offer a diverse and
                  distinguished selection of products that meet all your needs.
                  Whether you are looking for the latest fashion trends,
                  innovative technology devices, or luxury gifts, we are here to
                  offer you the best options at competitive prices.
                </h5>
                <h5>
                  Royal Shopper prides itself on a unique shopping experience,
                  as we provide you with ease of browsing, flexibility in the
                  purchasing process, and outstanding customer service that
                  guarantees your complete satisfaction.
                </h5>
                <h5>
                  Discover the joy of shopping online with confidence with Royal
                  Shopper, where style, quality and convenience come together
                  under one roof.
                </h5>
                <h5 className="wellcomeH5">
                  Join us today and enjoy an exceptional shopping experience!
                </h5>
              </div>
            }
          />
          <Route path="/create" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/all" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </userContext.Provider>
    </div>
  );
};

export default App;
