import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/images/logo.webp';
import { useAuth } from '../auth/AuthProvider';

const Navbar = ({ activeLink }) => {
  const navigate = useNavigate();
  const { token, handleLogout } = useAuth();

  const goTo = (path) => {
    navigate(path);
  };

  const handleScrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="Navbar sticky-top">
      <nav className="navbar navbar-expand-lg navbar-light px-4">
        <div className="container-fluid">
          {/* Brand and Logo */}
          <a className="navbar-brand">
            <img src={logo} alt="" width="40" height="35" />
          </a>
          <a className="navbar-brand">Cereal Office</a>

          {/* Toggler for Small Screens */}
          <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar">
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Offcanvas Navbar for Small Screens */}
          <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasNavbarLabel">Menu</h5>
              <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
              <ul className="navbar-nav mx-auto">
                <li className={`nav-item  ${activeLink === 'home' ? 'active' : ''}`}>
                  <a className={`nav-link nav-styled ${activeLink === 'home' ? 'active' : ''}`} onClick={() => handleScrollToSection('home')}>Home</a>
                </li>
                <li className="nav-item">
                  <a className={`nav-link nav-styled ${activeLink === 'information' ? 'active' : ''}`} onClick={() => handleScrollToSection('information')}>Information</a>
                </li>
              </ul>
              <hr className="bg-white" />
              {token === '' && (
                <button className="nav-link" onClick={() => goTo('/login')}>Login</button>
              )}
              {token === 'Admin' && (
                <div className="dropdown">
                  <button className="nav-link dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                    Admin
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <li><button className="dropdown-item" onClick={() => goTo('/dashboard')}>Dashboard</button></li>
                    <li><button className="dropdown-item" onClick={() => goTo('/add-user')}>Add users</button></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                  </ul>
                </div>
              )}
              {/* Farmer */}
              {token === 'Farmer' && (
                <div className="dropdown">
                  <button className="nav-link dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                    Farmer
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <li><button className="dropdown-item" onClick={() => goTo('/farmer/yield')}>Declare Yield</button></li>
                    <li><button className="dropdown-item" onClick={() => goTo('/farmer/history')}>History</button></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item" onClick={() => goTo('/user/profile')}>Profile</button></li>
                    <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                  </ul>
                </div>
              )}

              {/* Transporter */}
              {token === 'Transporter' && (
                <div className="dropdown">
                  <button className="nav-link dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                    Transporter
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <li><button className="dropdown-item" onClick={() => goTo('/transporter/transportation')}>Transportation</button></li>
                    <li><button className="dropdown-item" onClick={() => goTo('/transporter/history')}>History</button></li>
                    <li><button className="dropdown-item" onClick={() => goTo('/transporter/accepted')}>Accepted Transportation</button></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item" onClick={() => goTo('/user/profile')}>Profile</button></li>
                    <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                  </ul>
                </div>
              )}

              {/* Silo */}
              {token === 'Silo' && (
                <div className="dropdown">
                  <button className="nav-link dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                    Silo
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <li><button className="dropdown-item" onClick={() => goTo('/silo/status')}>Status</button></li>
                    <li><button className="dropdown-item" onClick={() => goTo('/silo/transportations')}>Transportations</button></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item" onClick={() => goTo('/user/profile')}>Profile</button></li>
                    <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>


  );
};

export default Navbar;
