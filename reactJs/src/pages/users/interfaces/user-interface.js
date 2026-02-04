import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Users.css';
import { useAuth } from '../../../auth/AuthProvider';

const UserInterface = ({ activeComponent }) => {
  const { token, handleLogout } = useAuth();
  const navigate = useNavigate();

  const goTo = (path) => {
    navigate(path); 
  };

  const renderNavItems = () => {
    switch (token) {
      case 'Farmer':
        return (
          <>
            <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
              <span>Yield</span>
            </h6>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <a className={activeComponent === 'Declare Yield' ? 'nav-link active' : 'nav-link'} aria-current="page" onClick={() => goTo('/farmer/yield')}>
                  <i className="bi bi-bag-check-fill pe-2"></i>
                  Declare Yield
                </a>
              </li>
              <li className="nav-item mb-2">
                <a className={activeComponent === 'History' ? 'nav-link active' : 'nav-link'} aria-current="page" onClick={() => goTo('/farmer/history')}>
                  <i className="bi bi-journal-text pe-2"></i>
                  History
                </a>
              </li>
            </ul>
            <hr/>
          </>
        );
      case 'Transporter':
        return (
          <>
            <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
              <span>Transportations</span>
            </h6>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <a className={activeComponent === 'Transportation' ? 'nav-link active' : 'nav-link'} aria-current="page" onClick={() => goTo('/transporter/transportation')}>
                  <i className="bi bi-truck pe-2"></i>
                  Transportation
                </a>
              </li>
              <li className="nav-item mb-2">
                <a className={activeComponent === 'Accepted' ? 'nav-link active' : 'nav-link'} aria-current="page" onClick={() => goTo('/transporter/accepted')}>
                  <i className="bi bi-check-circle-fill pe-2"></i>
                  Accepted
                </a>
              </li>
              <li className="nav-item mb-2">
                <a className={activeComponent === 'History' ? 'nav-link active' : 'nav-link'} aria-current="page" onClick={() => goTo('/transporter/history')}>
                  <i className="bi bi-journal-text pe-2"></i>
                  History
                </a>
              </li>
              
            </ul>
            <hr/>
          </>
        );
      case 'Silo':
        return (
          <>
            <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
              <span>Silo Operations</span>
            </h6>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <a className={activeComponent === 'Status' ? 'nav-link active' : 'nav-link'} aria-current="page" onClick={() => goTo('/silo/status')}>
                  <i className="bi bi-clipboard-data-fill pe-2"></i>
                  Silo Status
                </a>
              </li>
              <li className="nav-item mb-2">
                <a className={activeComponent === 'Transportations' ? 'nav-link active' : 'nav-link'} aria-current="page" onClick={() => goTo('/silo/transportations')}>
                  <i className="bi bi-truck pe-2"></i>
                  Incoming
                </a>
              </li>
              <li className="nav-item mb-2">
                <a className={activeComponent === 'History' ? 'nav-link active' : 'nav-link'} aria-current="page" onClick={() => goTo('/silo/history')}>
                  <i className="bi bi-truck pe-2"></i>
                  History
                </a>
              </li>
            </ul>
            <hr/>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className='User'>
      <div className='SideBar'>
        <header className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a className="navbar-brand col-md-3 col-lg-2 me-0 px-3" onClick={() => goTo("/user/profile")}>
            <i className="bi bi-person-gear pe-2"></i> {token} <span>Panel</span>
          </a>
          <button className="navbar-toggler position-absolute d-md-none collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
        </header>

        <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
          <div className="position-sticky pt-3">
            <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
              <span>Manage Profile</span>
            </h6>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <a className={activeComponent === 'Profile' ? 'nav-link active' : 'nav-link'} aria-current="page" onClick={() => goTo('/user/profile')}>
                  <i className="bi bi-person-circle pe-2"></i>
                  Profile
                </a>
              </li>
              <li className="nav-item mb-2">
                <a className={activeComponent === 'Change Password' ? 'nav-link active' : 'nav-link'} aria-current="page" onClick={() => goTo('/user/change-password')}>
                  <i className="bi bi-lock-fill pe-2"></i>
                  Change Password
                </a>
              </li>
              <li className="nav-item">
                <a className={activeComponent === 'Upload Permit' ? 'nav-link active' : 'nav-link'} aria-current="page" onClick={() => goTo('/user/upload-permit')}>
                  <i className="bi bi-card-text pe-2"></i>
                  Upload Permit
                </a>
              </li>
            </ul>
            <hr/>
            {renderNavItems()}
            <div className="navbar-nav">
              <div className="nav-item text-nowrap">
                <a className="nav-link px-3" onClick={() => goTo('/')}><i className="bi bi-house-fill pe-2"></i>Home</a>
              </div>
              <div className="navbar-nav SignOut">
                <div className="nav-item text-nowrap">
                  <a className="nav-link px-3" onClick={handleLogout}><i className="bi bi-box-arrow-left pe-2"></i>Sign out</a>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default UserInterface;
