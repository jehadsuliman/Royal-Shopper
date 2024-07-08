import React, { useState, useContext } from "react";
import axios from "axios";
import "./loginStyle.css";
import { userContext } from "../../App";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [fromData, setFromData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [data, setData] = useState("");
  const navigate = useNavigate();
  const { setToken, setUserId } = useContext(userContext);
  const handleChange = (e) => {
    setFromData({
      ...fromData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5000/users/login", {
        ...fromData,
      });
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.userId);
      setUserId(response.data.userId);
      setToken(response.data.token);
      setMessage(response.data.message);
      setData(response.data.token);
      setIsLoggedIn(true);
      navigate("/all");
    } catch (error) {
      console.log(error);
      setMessage(error);
    }
  };

  return (
    <div className="loginBox">
      <div className="inputLogin">
        <p>Login</p>
        <input
          className="emailInput"
          type="email"
          placeholder="Email"
          name="email"
          value={fromData.email}
          onChange={handleChange}
        />

        <input
          className="passwordInput"
          type="password"
          placeholder="Password"
          name="password"
          value={fromData.password}
          onChange={handleChange}
        />
        <br />
        <button className="buttonLogin" onClick={handleLogin}>
          Login
        </button>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default Login;
