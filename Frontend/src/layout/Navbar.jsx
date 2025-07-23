import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => (
  <nav className="navbar fixed-bottom bg-white border-top d-flex justify-content-around py-2">
    <NavLink to="/" className="text-center text-decoration-none text-dark">
      <i className="bi bi-house"></i><br />
      <small>Home</small>
    </NavLink>
    <div className="text-center text-muted">
      <i className="bi bi-briefcase"></i><br />
      <small>My Trips</small>
    </div>
    <div className="text-center text-muted">
      <i className="bi bi-person"></i><br />
      <small>Profile</small>
    </div>
  </nav>
);

export default Navbar;