import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css'; // Optional if you want to keep custom styles

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm">
      <div className="container">
        {/* Logo */}
        <NavLink className="navbar-brand" to="/">
          <img src="/logo.png" alt="SOMTRAVEL AGENCY" height="40" />
        </NavLink>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav Links */}
        <div className="collapse navbar-collapse justify-content-center" id="mainNavbar">
          <ul className="navbar-nav mb-2 mb-lg-0">

            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>Home</NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/ndc">⭐ NDC</NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/ethnic">✈️ Ethnic</NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/transactions">Transactions</NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/charge-deposit">Charge Deposit</NavLink>
            </li>

            {/* Dropdown */}
            <li className="nav-item dropdown">
              <span
                className="nav-link dropdown-toggle"
                id="reservesDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Reserves
              </span>
              <ul className="dropdown-menu" aria-labelledby="reservesDropdown">
                <li>
                  <NavLink className="dropdown-item" to="/reserves/domestic">Domestic</NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/reserves/international">International</NavLink>
                </li>
              </ul>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/support">Support</NavLink>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
