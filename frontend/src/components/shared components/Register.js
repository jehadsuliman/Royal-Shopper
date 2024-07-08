import React, { useState, useContext } from "react";
import axios from "axios";
import "./registerStyle.css";
import { useNavigate } from "react-router-dom";
import { userContext } from "../../App";

const Register = () => {
  const [fromData, setFromData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    age: "",
    country: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const { setToken } = useContext(userContext);

  const handleChange = (e) => {
    setFromData({
      ...fromData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/users/create",
        fromData
      );
      setMessage(response.data.message);
      setToken(response.data.token);
      navigate("/login");
    } catch (error) {
      setMessage(error);
    }
  };

  return (
    <div className="registerBox">
      <div className="inputRegister">
        <p>Register Account</p>
        <input
          className="firstNameInput"
          type="text"
          placeholder="First Name"
          name="firstName"
          value={fromData.firstName}
          onChange={handleChange}
        />

        <input
          className="lastNameInput"
          type="text"
          placeholder="Last Name"
          name="lastName"
          value={fromData.lastName}
          onChange={handleChange}
        />

        <input
          className="userNameInput"
          type="text"
          placeholder="User Name"
          name="userName"
          value={fromData.userName}
          onChange={handleChange}
        />

        <input
          className="ageInput"
          type="number"
          placeholder="Age"
          name="age"
          value={fromData.age}
          onChange={handleChange}
        />

        <input
          className="countryInput"
          type="text"
          placeholder="Country"
          name="country"
          value={fromData.country}
          onChange={handleChange}
        />

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
        <button className="buttonRegister" onClick={handleRegister}>
          Create Account
        </button>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default Register;
