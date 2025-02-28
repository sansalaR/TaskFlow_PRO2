import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; 

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary rounded-0">
      <div className="container-fluid">
        {/* Logo / Brand Name */}
        <Link className="navbar-brand" to="/">
          TaskFlow Pro
        </Link>
        
        {/* Navigation Links */}
        <div className="d-flex">
          <Link className="btn btn-outline-light me-2" to="/about">
            About
          </Link>
          <Link className="btn btn-outline-light" to="/login">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
