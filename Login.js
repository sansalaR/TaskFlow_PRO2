import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Components/Navbar";
import '../CSS/login.css';

export default function Login() {
  const navigate = useNavigate();

  const [userRegister, setUserRegister] = useState({
    username: "",
    password: "",
  });

  const { username, password } = userRegister;

  const onInputChange = (e) => {
    setUserRegister({ ...userRegister, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/auth/login", userRegister);
      const { token, role } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (error) {
      console.error("Login failed", error.response.data);
      alert("Invalid username or password");
    }
  };

  return (
    <div>
       <Navbar />
  
    <div className="login-container">
      <div className="form-container">
        <h2 className="text-center">Login</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label htmlFor="Name" className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Your Username"
              name="username"
              value={username}
              onChange={onInputChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="Password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter Your Password"
              name="password"
              value={password}
              onChange={onInputChange}
            />
          </div>

          <button type="submit" className="btn btn-primary mt-4">Login</button>
          <Link className="btn btn-danger mt-4" to="/register">Cancel</Link>
        </form>
      </div>
    </div>
    </div>
  );
}
