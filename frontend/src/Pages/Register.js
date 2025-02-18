import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import '../CSS/register.css' 

export default function Register() {
  let navigate = useNavigate();

  const [userRegister, set_user_register] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const { username, email, phoneNumber, password } = userRegister;

  const onInputChange = (e) => {
    set_user_register({ ...userRegister, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:8000/auth/register", userRegister);
    navigate("/"); // Go to login page
  };

  return (
    <div>
       <Navbar />
    
    <div className="register-container">
      <div className="form-container">
        <h2 className="text-center">Register</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Your Name"
              name="username"
              value={username}
              onChange={onInputChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">E-Mail</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter Your E-Mail"
              name="email"
              value={email}
              onChange={onInputChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="phoneNumber" className="form-label">Telephone Number</label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter Your Telephone Number"
              name="phoneNumber"
              value={phoneNumber}
              onChange={onInputChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter Your Password"
              name="password"
              value={password}
              onChange={onInputChange}
            />
          </div>

          <div className="button-group">
          <button type="submit" className="btn btn-primary mt-4">Register</button>
            <Link className="btn btn-danger mt-4" to="/register">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
}
