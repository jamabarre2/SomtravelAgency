import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="navbar-main sticky-top shadow-sm ">
      <div className="navbar-container ">
        {/* Logo */}
        <NavLink to="/" className="logo" >
          <img src="/logo.png" alt="SOMTRAVEL AGENCY" />
        </NavLink>

        {/* Mobile Toggle */}
        <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        {/* Nav Links */}
        <nav className={`nav-links ${isOpen ? 'open' : ''}`}>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/ndc">⭐ NDC</NavLink>
          <NavLink to="/ethnic">✈️ Ethnic</NavLink>
          <NavLink to="/transactions">Transactions</NavLink>
          <NavLink to="/charge-deposit">Charge Deposit</NavLink>

          <div className="dropdown">
            <span>Reserves ▾</span>
            <div className="dropdown-menu">
              <NavLink to="/reserves/domestic">Domestic</NavLink>
              <NavLink to="/reserves/international">International</NavLink>
            </div>
          </div>

          <NavLink to="/support">Support</NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
